const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const slugify = require('slugify');
const { uploadPdfToS3, deleteFromS3, getSignedDownloadUrl, downloadToBuffer } = require('./s3');
const config = require('./config/oauth');
const authRoutes = require('./routes/auth');
const { requireAuth, requireFaculty, requireAdmin } = require('./config/middleware/auth');

dotenv.config({
  path: path.resolve(__dirname, '.env'),
  override: true
});

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://human-ethics-committee.vercel.app',
  process.env.FRONTEND_URL
].filter(url => url && url.trim()); // Remove empty/undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Session setup for OAuth authentication
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});


app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRoutes);

app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return res.status(500).json({ success: false, message: 'Admin credentials are not configured' });
  }

  if (username === adminUser && password === adminPass) {
    req.session.user = {
      username: adminUser,
      fullName: 'Admin User',
      isAdmin: true
    };
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

console.log('\n Attempting MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI ? 'Set ' : 'NOT SET ');

if (!process.env.MONGODB_URI) {
  console.error(' MONGODB_URI is not set in .env file!');
  console.error('Please add MONGODB_URI to your .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected successfully');
    console.log('Database: Connected and ready\n');
  })
  .catch(err => {
    console.error(' MongoDB Connection Error:');
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your MONGODB_URI in .env file');
    console.error('2. Verify username and password are correct');
    console.error('3. Check IP whitelist in MongoDB Atlas');
    console.error('4. Ensure database user exists in MongoDB Atlas');
    console.error('5. Check internet connection\n');
  });

const proposalSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  researcherName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },

  pdfFileName: String, 
  pdfS3Key: String,    

  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected']
  }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

const fileFilter = (req, file, cb) => {
  console.log('File received:', file.originalname, 'Type:', file.mimetype);

  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailLogDir = path.join(__dirname, 'logs');
const emailLogFile = path.join(emailLogDir, 'email.log');

function logEmailEvent(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;

  try {
    fs.mkdirSync(emailLogDir, { recursive: true });
    fs.appendFileSync(emailLogFile, line, 'utf8');
  } catch (logError) {
    console.log('Failed to write email log:', logError.message);
  }

  console.log(message);
}

transporter.verify((error, success) => {
  if (error) {
    logEmailEvent(`Email setup error: ${error.message}`);
  } else {
    logEmailEvent('Email service ready');
  }
});

function generateProjectId() {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IHEC-${currentYear}-${randomNum}`;
}

function buildS3Key({ projectId, originalFileName }) {
  const year = new Date().getFullYear();
  const fileName = path.basename(originalFileName || 'proposal.pdf');
  const key = `proposals/${year}/${projectId}/${fileName}`;

  return { key, fileName };
}

function buildAcknowledgementPdfBuffer(proposal) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    doc.fontSize(18).text('Institutional Human Ethics Committee', { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(13).text('Proposal Submission Acknowledgement', { align: 'center' });
    doc.moveDown(1.2);

    doc.fontSize(11).text(`Date: ${new Date(proposal.submittedAt || Date.now()).toLocaleDateString()}`);
    doc.moveDown(0.6);

    doc.fontSize(12).text(`Project ID: ${proposal.projectId}`);
    doc.text(`Researcher Name: ${proposal.researcherName}`);
    doc.text(`Email: ${proposal.email}`);
    doc.text(`Project Title: ${proposal.projectTitle}`);
    doc.text(`File Name: ${proposal.pdfFileName || 'N/A'}`);

    doc.moveDown(1.2);
    doc.fontSize(11).text('Your proposal has been received and is under review. Please retain this acknowledgement for future reference.');
    doc.moveDown(2);
    doc.fontSize(10).text('IIT Roorkee - Institutional Human Ethics Committee', { align: 'center' });

    doc.end();
  });
}

app.post('/api/proposals', upload.single('pdfFile'), async (req, res) => {
  try {
    const { researcherName, email, projectTitle } = req.body;

    console.log('\n========== NEW PROPOSAL SUBMISSION ==========');

    if (!researcherName || researcherName.trim() === '') {
      return res.status(400).json({ message: 'Researcher name is required', success: false });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email address is required', success: false });
    }
    if (!projectTitle || projectTitle.trim() === '') {
      return res.status(400).json({ message: 'Project title is required', success: false });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required', success: false });
    }

    const generatedProjectId = generateProjectId();
    console.log(`Generated Project ID: ${generatedProjectId}`);

    const { key: s3Key } = buildS3Key({
      projectId: generatedProjectId,
      originalFileName: req.file.originalname
    });

    console.log('Uploading PDF to S3...');
    await uploadPdfToS3({
      key: s3Key,
      buffer: req.file.buffer,
      contentType: req.file.mimetype
    });

    const proposal = new Proposal({
      projectId: generatedProjectId,
      researcherName: researcherName.trim(),
      email: email.trim(),
      projectTitle: projectTitle.trim(),
      pdfFileName: req.file.originalname,
      pdfS3Key: s3Key
    });

    await proposal.save();

    const signedUrl = await getSignedDownloadUrl(s3Key, 60 * 10); 
    const acknowledgementUrl = `${req.protocol}://${req.get('host')}/api/proposals/${proposal._id}/acknowledgement?email=${encodeURIComponent(email.trim())}`;
    res.status(201).json({
      message: 'Proposal submitted successfully!',
      projectId: generatedProjectId,
      proposalId: proposal._id,
      researcherName: proposal.researcherName,
      email: proposal.email,
      projectTitle: proposal.projectTitle,
      pdfFileName: proposal.pdfFileName,
      pdfSignedUrl: signedUrl,
      acknowledgementUrl,
      success: true
    });

    const mailToResearcher = {
      from: process.env.EMAIL_USER,
      to: email.trim(),
      subject: 'Proposal Submission Confirmation - IIT Roorkee Ethics Committee',
      html: `
        <h3>Dear ${researcherName},</h3>
        <p>Your research proposal titled <b>"${projectTitle}"</b> has been successfully submitted to the Institutional Human Ethics Committee.</p>
        <br/>
        <p><b>IMPORTANT:</b> Your unique Project ID is <b>${generatedProjectId}</b>.</p>
        <p>Please save this ID safely. If the committee requests changes, you will need this ID to resubmit your updated PDF.</p>
        <br/>
        <p>Regards,<br/>IHEC Committee, IIT Roorkee</p>
      `
    };

    transporter.sendMail(mailToResearcher, (error) => {
      if (error) {
        logEmailEvent(`Error sending submission email to researcher (${email}): ${error.message}`);
      } else {
        logEmailEvent(`Submission email sent to researcher: ${email}`);
      }
    });

    logEmailEvent('Committee notification email skipped for submissions.');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    res.status(500).json({
      message: 'Error submitting proposal',
      error: error.message,
      success: false
    });
  }
});

app.post('/api/proposals/resubmit', upload.single('pdfFile'), async (req, res) => {
  try {
    const { projectId, researcherName, email } = req.body;

    console.log('\n📨 ========== PROPOSAL RESUBMISSION ==========');

    if (!projectId || projectId.trim() === '') {
      return res.status(400).json({ message: 'Project ID is required', success: false });
    }
    if (!researcherName || researcherName.trim() === '') {
      return res.status(400).json({ message: 'Researcher name is required', success: false });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email address is required', success: false });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required for resubmission', success: false });
    }

    const existingProposal = await Proposal.findOne({ projectId: projectId.trim() });
    if (!existingProposal) {
      return res.status(404).json({ message: 'Project ID not found. Please check and try again.', success: false });
    }

    if (existingProposal.pdfS3Key) {
      console.log('Deleting old S3 object:', existingProposal.pdfS3Key);
      await deleteFromS3(existingProposal.pdfS3Key);
    }

    const effectiveTitle = (existingProposal.projectTitle || 'proposal').trim();

    const { key: s3Key } = buildS3Key({
      projectId: projectId.trim(),
      originalFileName: req.file.originalname
    });

    console.log('Uploading updated PDF to S3...');
    await uploadPdfToS3({
      key: s3Key,
      buffer: req.file.buffer,
      contentType: req.file.mimetype
    });

    existingProposal.researcherName = researcherName.trim();
    existingProposal.email = email.trim();
    existingProposal.pdfFileName = req.file.originalname;
    existingProposal.pdfS3Key = s3Key;
    existingProposal.submittedAt = new Date();
    existingProposal.status = 'Pending';

    await existingProposal.save();

    const signedUrl = await getSignedDownloadUrl(s3Key, 60 * 10);
    const acknowledgementUrl = `${req.protocol}://${req.get('host')}/api/proposals/${existingProposal._id}/acknowledgement?email=${encodeURIComponent(email.trim())}`;
    res.status(200).json({
      message: 'Proposal resubmitted successfully!',
      projectId: projectId,
      proposalId: existingProposal._id,
      researcherName: existingProposal.researcherName,
      email: existingProposal.email,
      projectTitle: existingProposal.projectTitle,
      pdfFileName: existingProposal.pdfFileName,
      pdfSignedUrl: signedUrl,
      acknowledgementUrl,
      success: true
    });

    const mailToResearcher = {
      from: process.env.EMAIL_USER,
      to: email.trim(),
      subject: 'Proposal Resubmission Confirmation - IIT Roorkee Ethics Committee',
      html: `
        <h3>Dear ${researcherName},</h3>
        <p>Your updated research proposal has been successfully resubmitted to the Institutional Human Ethics Committee.</p>
        <br/>
        <p><b>Project ID:</b> <b>${projectId}</b></p>
        <p>Your proposal is now under review again. We will notify you once the committee has reviewed the changes.</p>
        <br/>
        <p>Regards,<br/>IHEC Committee, IIT Roorkee</p>
      `
    };

    transporter.sendMail(mailToResearcher, (error) => {
      if (error) {
        logEmailEvent(`Error sending resubmission email to researcher (${email}): ${error.message}`);
      } else {
        logEmailEvent(`Resubmission email sent to researcher: ${email}`);
      }
    });

    logEmailEvent('Committee notification email skipped for resubmissions.');

  } catch (error) {
    console.error(' ERROR:', error.message);
    res.status(500).json({
      message: 'Error resubmitting proposal',
      error: error.message,
      success: false
    });
  }
});

app.get('/api/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proposals', error: error.message, success: false });
  }
});

app.get('/api/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found', success: false });

    const signedUrl = proposal.pdfS3Key ? await getSignedDownloadUrl(proposal.pdfS3Key, 60 * 10) : null;

    res.json({
      success: true,
      data: {
        ...proposal.toObject(),
        pdfSignedUrl: signedUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proposal', error: error.message, success: false });
  }
});

app.put('/api/proposals/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status', success: false });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!proposal) return res.status(404).json({ message: 'Proposal not found', success: false });

    const statusMessage = {
      'Approved': '✅ APPROVED',
      'Rejected': '❌ REJECTED',
      'Pending': '⏳ PENDING REVIEW'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: proposal.email,
      subject: `Proposal Status Update: ${statusMessage[status]} - ${proposal.projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: #236b60; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">Proposal Status Update</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px;">
            <p>Dear ${proposal.researcherName},</p>

            <div style="background: white; padding: 20px; border-left: 4px solid #236b60; margin: 20px 0; font-size: 18px; font-weight: bold;">
              Status: <span style="color: ${status === 'Approved' ? '#22c55e' : status === 'Rejected' ? '#ef4444' : '#f59e0b'};">${statusMessage[status]}</span>
            </div>

            <p><strong>Project:</strong> ${proposal.projectTitle}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>

            <p>Thank you for submitting your proposal to IIT Roorkee Ethics Committee.</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              Best regards,<br/>
              IIT Roorkee Ethics Committee
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Proposal status updated to ${status}`, proposal, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating proposal status', error: error.message, success: false });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ message: 'File size too large (max 5MB)', success: false });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Only one file allowed', success: false });
    }
  }

  if (error && error.message === 'Only PDF files are allowed') {
    return res.status(400).json({ message: 'Only PDF files are allowed', success: false });
  }

  if (error) {
    return res.status(500).json({ message: error.message, success: false });
  }

  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Home page (public) - Ethics Committee API' });
});

app.get('/user-dashboard', requireAuth, (req, res) => {
  res.json({
    message: `Welcome ${req.session.user.fullName || req.session.user.username}`,
    user: req.session.user
  });
});

app.get('/faculty-application', requireAuth, requireFaculty, (req, res) => {
  res.json({
    message: `Welcome ${req.session.user.fullName || req.session.user.username} to Faculty Application Portal`,
    user: req.session.user
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port:${PORT}`);
  console.log(`  Database: Connected to MongoDB`);
  console.log(` File Storage: AWS S3 (private)`);
  console.log(` Email Service: Configured\n`);
});

app.get('/api/admin/proposals', requireAdmin, async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ submittedAt: -1 });
    res.json({ success: true, data: proposals });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching proposals', error: error.message });
  }
});

app.get('/api/admin/proposals/:id/download', requireAdmin, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal || !proposal.pdfS3Key) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    const signedUrl = await getSignedDownloadUrl(proposal.pdfS3Key, 600);
    return res.json({ success: true, url: signedUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Error generating download link', error: error.message });
  }
});

app.get('/api/proposals/:id/acknowledgement', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found', success: false });
    }

    const emailQuery = String(req.query.email || '').trim().toLowerCase();
    if (emailQuery && emailQuery !== String(proposal.email || '').trim().toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match proposal record', success: false });
    }

    const pdfBuffer = await buildAcknowledgementPdfBuffer(proposal);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="IHEC-Acknowledgement-${proposal.projectId}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: 'Error generating acknowledgement', error: error.message, success: false });
  }
});