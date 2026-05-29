import fs from 'fs/promises';
import path from 'path';
import Gallery, { type GalleryItem } from '@/components/Gallery';

async function getGalleryItems(): Promise<GalleryItem[]> {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');

  try {
    return (await fs.readdir(galleryDir))
      .filter((file) => !file.startsWith('.'))
      .filter((file) => !file.toLowerCase().includes('tareef'))
      .sort((a, b) => b.localeCompare(a))
      .map((file) => ({
        url: `/gallery/${file}`,
        name: file,
        type: file.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
        id: file,
      }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const items = await getGalleryItems();

  return (
    <main className="min-h-screen bg-bg">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/6 rounded-full blur-[150px] pointer-events-none" />

      <header className="sticky top-0 z-40 bg-bg/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <span className="text-sm font-medium tracking-tight text-foreground">Gallery</span>
          </div>
          <span className="text-xs text-muted font-mono">{items.length} items</span>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 pt-14 pb-6">
        <div className="mb-12">
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-accent font-medium mb-4">
            Private Collection
          </span>
          <h1 className="text-3xl font-medium text-foreground tracking-tight">
            Captured moments
          </h1>
        </div>
        <Gallery items={items} />
      </div>

      <footer className="max-w-[1600px] mx-auto px-6 py-10 border-t border-border flex justify-between text-xs text-muted">
        <span>&copy; {new Date().getFullYear()}</span>
        <span>Hosted on Vercel</span>
      </footer>
    </main>
  );
}
