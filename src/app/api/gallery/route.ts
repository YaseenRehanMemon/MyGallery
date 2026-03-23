import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { listCloudFiles } from '@/lib/storage';

export async function GET() {
  try {
    // 1. List local files from public/gallery
    const localGalleryPath = path.join(process.cwd(), 'public', 'gallery');
    let localFiles: string[] = [];
    
    try {
      localFiles = await fs.readdir(localGalleryPath);
    } catch (e) {
      console.error("Local gallery directory not found or inaccessible", e);
    }

    const localItems = localFiles
      .filter(file => !file.startsWith('.'))
      .map(file => ({
        url: `/gallery/${file}`,
        name: file,
        type: file.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
        source: 'local' as const,
        id: `local-${file}`
      }));

    // 2. List remote files from Cloud (Vercel Blob OR S3/Oracle)
    const remoteBlobs = await listCloudFiles();
    const remoteItems = remoteBlobs.map(blob => ({
      url: blob.url,
      name: blob.pathname,
      type: blob.pathname.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
      source: 'cloud' as const,
      id: blob.url
    }));

    // Combine and sort (newest first based on name if it contains timestamp)
    const allItems = [...localItems, ...remoteItems].sort((a, b) => b.name.localeCompare(a.name));

    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Gallery API error:", error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
