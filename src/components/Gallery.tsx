'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export type GalleryItem = {
  url: string;
  name: string;
  type: 'image' | 'video';
  id: string;
};

type GalleryProps = {
  items: GalleryItem[];
};

export default function Gallery({ items }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] ?? null : null;

  const open = useCallback((i: number) => setSelectedIndex(i), []);
  const close = useCallback(() => setSelectedIndex(null), []);
  const next = useCallback(() => {
    setSelectedIndex((p) => (p !== null ? (p + 1) % items.length : null));
  }, [items.length]);
  const prev = useCallback(() => {
    setSelectedIndex((p) =>
      p !== null ? (p - 1 + items.length) % items.length : null,
    );
  }, [items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex, close, next, prev]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-32 text-muted text-sm">
        No media found in{' '}
        <code className="ml-1 px-1.5 py-0.5 bg-surface rounded text-xs text-accent">public/gallery</code>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.015, 0.5), ease: [0.16, 1, 0.3, 1] }}
            onClick={() => open(i)}
            className="group relative block w-full text-left cursor-pointer rounded-xl overflow-hidden bg-surface border border-border hover:border-accent/30 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="aspect-[4/5] relative">
              {item.type === 'video' ? (
                <>
                  <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/10">
                      <Play size={18} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={i < 6}
                />
              )}

              {/* Hover reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <p className="absolute left-3 right-3 bottom-3 text-[11px] text-white/80 truncate translate-y-1 group-hover:translate-y-0 transition-transform duration-300 font-medium">
                  {item.name}
                </p>
              </div>

              {/* Accent line on hover - bottom edge */}
              <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 backdrop-blur-md"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <motion.div
              key={selectedItem.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] rounded-lg"
                />
              ) : (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  width={1920}
                  height={1920}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg w-auto h-auto"
                  quality={95}
                  priority
                />
              )}

              {items.length > 1 && (
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white/40 text-xs font-mono tabular-nums">
                  {selectedIndex! + 1}/{items.length}
                </span>
              )}
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/40 text-xs max-w-[80vw] truncate">
              {selectedItem.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
