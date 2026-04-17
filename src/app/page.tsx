import fs from 'fs/promises';
import path from 'path';
import { Camera } from 'lucide-react';
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
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent-light/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/60 border-b border-accent/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center transition-transform group-hover:rotate-12">
              <Camera size={20} />
            </div>
            <h1 className="text-2xl font-serif text-foreground font-medium">My Gallery</h1>
          </div>

          <p className="text-sm text-accent/60">Static photo archive</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase text-accent/60 bg-accent/5 rounded-full">
            Private Collection
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8 leading-[1.1]">
            Captured Moments, <br /> Forever <span className="italic text-accent">Ours</span>.
          </h2>
          <p className="mx-auto max-w-xl text-accent/70 leading-7">
            Add files to `public/gallery`, push to Git, and Vercel will rebuild the gallery automatically.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-24 relative z-10">
        <Gallery items={items} />
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-accent/5 flex flex-col items-center gap-4 text-accent/40 text-sm font-light">
         <p>© {new Date().getFullYear()} Static Gallery • Hosted on Vercel</p>
         <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
         </div>
      </footer>
    </main>
  );
}
