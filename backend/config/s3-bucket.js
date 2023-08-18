import { S3Client } from "@aws-sdk/client-s3";

export const s3Storage = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});
