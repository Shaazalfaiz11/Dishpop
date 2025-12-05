// helpers/storageS3.js
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload buffer to S3 and return public URL
 */
async function uploadBufferToS3(buffer, bucket, key, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Delete object from S3
 */
async function deleteFromS3(bucket, key) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    console.log("🔥 Deleted from S3:", key);
  } catch (err) {
    console.error("❌ Failed deleting from S3:", err);
  }
}

module.exports = {
  uploadBufferToS3,
  deleteFromS3,
};
