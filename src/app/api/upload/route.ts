import { getUploadUrl } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Instead of processing the upload here, we return a signed URL.
    // This allows the client to upload directly to MinIO, bypassing Vercel's 4.5MB limit.
    const uploadData = await getUploadUrl(filename, contentType);

    return NextResponse.json(uploadData);
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
