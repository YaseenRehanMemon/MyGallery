import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { put, list } from '@vercel/blob';

// Storage Configuration
const isS3Enabled = process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY;

const s3Client = isS3Enabled ? new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
}) : null;

const S3_BUCKET = process.env.S3_BUCKET || 'mygallery';

/**
 * Returns a pre-signed URL for direct-to-cloud upload to bypass Vercel's 4.5MB limit.
 * This allows uploading files of any size directly to your Oracle/MinIO server.
 */
export async function getUploadUrl(filename: string, contentType: string) {
  if (isS3Enabled && s3Client) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: filename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return {
      uploadUrl: url,
      publicUrl: `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${S3_BUCKET}/${filename}`,
      pathname: filename,
    };
  }

  // Fallback (Will use Vercel Blob but still limited by Vercel if handled server-side)
  return { uploadUrl: null, publicUrl: null };
}

export async function uploadToCloud(filename: string, body: Buffer | ReadableStream, contentType: string) {
  if (isS3Enabled && s3Client) {
    // Legacy helper - kept for compatibility but getUploadUrl is preferred for large files
    const { uploadToS3 } = await import('@aws-sdk/lib-storage').then(m => ({ uploadToS3: m.Upload }));
    const upload = new uploadToS3({
      client: s3Client,
      params: {
        Bucket: S3_BUCKET,
        Key: filename,
        Body: body,
        ContentType: contentType,
      },
    });

    await upload.done();
    return {
      url: `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${S3_BUCKET}/${filename}`,
      pathname: filename,
    };
  }

  // Fallback to Vercel Blob
  return await put(filename, body, { access: 'public' });
}

export async function listCloudFiles() {
  if (isS3Enabled && s3Client) {
    try {
      const command = new ListObjectsV2Command({ Bucket: S3_BUCKET });
      const response = await s3Client.send(command);
      return (response.Contents || []).map(item => ({
        url: `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${S3_BUCKET}/${item.Key}`,
        pathname: item.Key || '',
      }));
    } catch (e) {
      console.error("S3 List Error:", e);
      return [];
    }
  }

  // Fallback to Vercel Blob
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list();
    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
    }));
  } catch (e) {
    return [];
  }
}
