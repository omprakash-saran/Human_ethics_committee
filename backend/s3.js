const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const required = (name) => {
  if (!process.env[name] || process.env[name].trim() === "") {
    throw new Error(`${name} is not set in environment variables`);
  }
  return process.env[name];
};

function getBucket() {
  return required("AWS_S3_BUCKET");
}

function getRegion() {
  return process.env.AWS_REGION || process.env.AWS_BUCKET_REGION || required("AWS_REGION");
}

function getS3Client() {
  return new S3Client({
    region: getRegion(),
    credentials: {
      accessKeyId: required("AWS_ACCESS_KEY_ID"),
      secretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
    },
  });
}

async function uploadPdfToS3({ key, buffer, contentType = "application/pdf" }) {
  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await s3.send(command);
  return { key };
}

async function deleteFromS3(key) {
  if (!key) return;
  const s3 = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  await s3.send(command);
}

async function getSignedDownloadUrl(key, expiresInSeconds = 600) {
  const s3 = getS3Client();
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

async function downloadToBuffer(key) {
  const s3 = getS3Client();
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });

  const result = await s3.send(command);

  if (!result.Body) throw new Error("S3 GetObject returned empty Body");

  const chunks = [];
  for await (const chunk of result.Body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = {
  uploadPdfToS3,
  deleteFromS3,
  getSignedDownloadUrl,
  downloadToBuffer,
};