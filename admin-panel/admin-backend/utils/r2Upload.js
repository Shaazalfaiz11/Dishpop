// admin-backend/utils/r2Upload.js
import "dotenv/config";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 – Fully compatible S3Client (No Express Mode, No Checksums)
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  forcePathStyle: true,
  useArnRegion: false,
  disableHostPrefix: true,
  signer: undefined,
  checksumAlgorithms: [],

  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY?.trim(),
    secretAccessKey: process.env.R2_SECRET_KEY?.trim(),
  },
});

// Upload buffer to R2
export const uploadBufferToR2 = async (buffer, key, contentType = null) => {
  if (!buffer) throw new Error("R2 Upload Error: Missing file buffer");
  if (!key) throw new Error("R2 Upload Error: Missing file key");

  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  };

  await r2.send(new PutObjectCommand(params));

  return `${process.env.R2_PUBLIC_URL}/${key}`;
};

// Delete from R2
export const deleteFromR2 = async (key) => {
  if (!key) return;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    })
  );
};
