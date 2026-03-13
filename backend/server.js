const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ============================================
// MONGODB CONNECTION (IMPROVED)
// ============================================
console.log('\n📡 Attempting MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI ? 'Set ✅' : 'NOT SET ❌');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env file!');
  console.error('Please add MONGODB_URI to your .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Database: Connected and ready\n');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your MONGODB_URI in .env file');
    console.error('2. Verify username and password are correct');
    console.error('3. Check IP whitelist in MongoDB Atlas');
    console.error('4. Ensure database user exists in MongoDB Atlas');
    console.error('5. Check internet connection\n');
  });


// Proposal Schema
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
  pdfFilePath: String,
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

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 Uploads directory created');
}

// Multer Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// File filter - only allow PDF
const fileFilter = (req, file, cb) => {
  console.log('📂 File received:', file.originalname, 'Type:', file.mimetype);
  
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Gmail Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email setup error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// ============================================
// API ROUTES
// ============================================

// API Route: Submit Proposal with PDF
// API Route: Submit Proposal with PDF (OPTIMIZED)
app.post('/api/proposals', upload.single('pdfFile'), async (req, res) => {
  try {
    const { researcherName, email, projectTitle} = req.body;

    console.log('\n📨 ========== NEW PROPOSAL SUBMISSION ==========');
    console.log('📨 Received Form Data:');
    console.log('   - Name:', researcherName);
    console.log('   - Email:', email);
    console.log('   - Title:', projectTitle);

    // VALIDATIONS (keep same)
    if (!researcherName || researcherName.trim() === '') {
      return res.status(400).json({ 
        message: 'Researcher name is required',
        success: false
      });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ 
        message: 'Email address is required',
        success: false
      });
    }

    if (!projectTitle || projectTitle.trim() === '') {
      return res.status(400).json({ 
        message: 'Project title is required',
        success: false
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'PDF file is required',
        success: false
      });
    }

    console.log('✅ All validations passed!');

    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    const generatedProjectId = `IHEC-${currentYear}-${randomNum}`;
    
    console.log(`🆔 Generated Project ID: ${generatedProjectId}`);

    // STEP 1: Save to database FIRST (fast operation)
    const proposal = new Proposal({
      projectId: generatedProjectId,
      researcherName: researcherName.trim(),
      email: email.trim(),
      projectTitle: projectTitle.trim(),
      pdfFileName: req.file.originalname,
      pdfFilePath: `/uploads/${req.file.filename}`
    });

    await proposal.save();
    console.log('💾 Proposal saved to MongoDB:', proposal._id);

    // STEP 2: Return success to user IMMEDIATELY ⚡
    res.status(201).json({
      message: 'Proposal submitted successfully!',
      projectId: generatedProjectId, 
      proposalId: proposal._id,
      pdfPath: proposal.pdfFilePath,
      success: true
    });

    console.log('✅ Response sent to user (instant!)');

    // STEP 3: Send emails in BACKGROUND (don't wait for them)
    // This happens AFTER response is sent
    
    // Email to researcher
    const mailToResearcher = {
      from: process.env.GMAIL_USER,
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
    // Send to researcher (background - no await)
    transporter.sendMail(mailToResearcher, (error, info) => {
      if (error) {
        console.log('❌ Error sending email to researcher:', error.message);
      } else {
        console.log('📧 Email sent to researcher:', email);
      }
    });

    // Email to committee
    const mailToCommittee = {
      from: process.env.GMAIL_USER,
      to: 'ops052005@gmail.com',  // Change to committee email later
      subject: `[NEW PROPOSAL] ${projectTitle} - ${researcherName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: #236b60; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">📥 New Research Proposal Received</h2>
          </div>
          
          <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px;">
            <h3 style="color: #236b60; margin-top: 0;">Researcher Information:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>👤 Name:</strong> ${researcherName}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>📧 Email:</strong> ${email}</li>
              <li style="padding: 8px 0;"><strong>📋 Title:</strong> ${projectTitle}</li>
            </ul>

            <div style="background: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <strong>📎 PDF Attached:</strong> ${req.file.originalname}
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              Submitted: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: path.join(__dirname, req.file.path)
        }
      ]
    };

    // Send to committee (background - no await)
    transporter.sendMail(mailToCommittee, (error, info) => {
      if (error) {
        console.log('❌ Error sending email to committee:', error.message);
      } else {
        console.log('📧 Email sent to committee');
      }
    });

    console.log('✅ PROPOSAL SUBMISSION COMPLETE (emails sending in background)');
    console.log('================================================\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting file:', err);
      });
    }

    res.status(500).json({
      message: 'Error submitting proposal',
      error: error.message,
      success: false
    });
  }
});

// ============================================
// API Route: RESUBMIT Proposal with Updated PDF
// ============================================
app.post('/api/proposals/resubmit', upload.single('pdfFile'), async (req, res) => {
  try {
    const { projectId, researcherName, email } = req.body;

    console.log('\n📨 ========== PROPOSAL RESUBMISSION ==========');
    console.log('📨 Received Resubmission Data:');
    console.log('   - Project ID:', projectId);
    console.log('   - Name:', researcherName);
    console.log('   - Email:', email);

    // VALIDATIONS
    if (!projectId || projectId.trim() === '') {
      return res.status(400).json({ 
        message: 'Project ID is required',
        success: false
      });
    }

    if (!researcherName || researcherName.trim() === '') {
      return res.status(400).json({ 
        message: 'Researcher name is required',
        success: false
      });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ 
        message: 'Email address is required',
        success: false
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'PDF file is required for resubmission',
        success: false
      });
    }

    console.log('✅ All validations passed!');

    // Find existing proposal by projectId
    const existingProposal = await Proposal.findOne({ projectId: projectId.trim() });

    if (!existingProposal) {
      return res.status(404).json({ 
        message: 'Project ID not found. Please check and try again.',
        success: false
      });
    }

    console.log('✅ Found existing proposal:', existingProposal._id);

    // Delete old PDF file if it exists
    if (existingProposal.pdfFilePath) {
      const oldFilePath = path.join(__dirname, existingProposal.pdfFilePath);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.log('Note: Could not delete old file:', err.message);
        else console.log('🗑️ Old PDF file deleted');
      });
    }

    // Update proposal with new PDF
    existingProposal.researcherName = researcherName.trim();
    existingProposal.email = email.trim();
    existingProposal.pdfFileName = req.file.originalname;
    existingProposal.pdfFilePath = `/uploads/${req.file.filename}`;
    existingProposal.submittedAt = new Date(); // Update submission date
    existingProposal.status = 'Pending'; // Reset status to pending

    await existingProposal.save();
    console.log('💾 Proposal resubmission saved to MongoDB:', existingProposal._id);

    // Return success to user IMMEDIATELY
    res.status(200).json({
      message: 'Proposal resubmitted successfully!',
      projectId: projectId, 
      proposalId: existingProposal._id,
      pdfPath: existingProposal.pdfFilePath,
      success: true
    });

    console.log('✅ Response sent to user');

    // Send emails in BACKGROUND

    // Email to researcher
    const mailToResearcher = {
      from: process.env.GMAIL_USER,
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

    transporter.sendMail(mailToResearcher, (error, info) => {
      if (error) {
        console.log('❌ Error sending resubmission email to researcher:', error.message);
      } else {
        console.log('📧 Resubmission confirmation email sent to researcher:', email);
      }
    });

    // Email to committee
    const mailToCommittee = {
      from: process.env.GMAIL_USER,
      to: 'ops052005@gmail.com',  // Change to committee email later
      subject: `[RESUBMITTED PROPOSAL] ${projectId} - ${researcherName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: #236b60; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">🔄 Proposal Resubmitted</h2>
          </div>
          
          <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px;">
            <h3 style="color: #236b60; margin-top: 0;">Resubmission Information:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>📋 Project ID:</strong> ${projectId}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>👤 Name:</strong> ${researcherName}</li>
              <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>📧 Email:</strong> ${email}</li>
              <li style="padding: 8px 0;"><strong>📎 PDF:</strong> ${req.file.originalname}</li>
            </ul>

            <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <strong>⚠️ Note:</strong> This is a resubmission. The proposal status has been reset to "Pending" for re-review.
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; margin: 0;">
              Resubmitted: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: path.join(__dirname, req.file.path)
        }
      ]
    };

    transporter.sendMail(mailToCommittee, (error, info) => {
      if (error) {
        console.log('❌ Error sending resubmission email to committee:', error.message);
      } else {
        console.log('📧 Resubmission notification sent to committee');
      }
    });

    console.log('✅ RESUBMISSION COMPLETE (emails sending in background)');
    console.log('================================================\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting file:', err);
      });
    }

    res.status(500).json({
      message: 'Error resubmitting proposal',
      error: error.message,
      success: false
    });
  }
});

// API Route: Get all proposals
app.get('/api/proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching proposals',
      error: error.message,
      success: false 
    });
  }
});

// API Route: Get proposal by ID
app.get('/api/proposals/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ 
        message: 'Proposal not found',
        success: false 
      });
    }
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching proposal',
      error: error.message,
      success: false 
    });
  }
});

// API Route: Update proposal status
app.put('/api/proposals/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        success: false 
      });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!proposal) {
      return res.status(404).json({ 
        message: 'Proposal not found',
        success: false 
      });
    }

    // Send status update email
    const statusMessage = {
      'Approved': '✅ APPROVED',
      'Rejected': '❌ REJECTED',
      'Pending': '⏳ PENDING REVIEW'
    };

    const mailOptions = {
      from: process.env.GMAIL_USER,
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

    res.json({
      message: `Proposal status updated to ${status}`,
      proposal: proposal,
      success: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Error updating proposal status',
      error: error.message,
      success: false
    });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ 
        message: 'File size too large (max 5MB)',
        success: false 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Only one file allowed',
        success: false 
      });
    }
  }
  
  if (error && error.message === 'Only PDF files are allowed') {
    return res.status(400).json({ 
      message: 'Only PDF files are allowed',
      success: false 
    });
  }

  if (error) {
    return res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   🚀 IIT ROORKEE ETHICS COMMITTEE SERVER 🚀   ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads folder: ./uploads`);
  console.log(`🗄️  Database: Connected to MongoDB`);
  console.log(`📧 Email Service: Configured\n`);
});