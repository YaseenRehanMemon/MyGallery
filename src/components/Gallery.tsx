'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Maximize2, Play, X } from 'lucide-react';

export type GalleryItem = {
  url: string;
  name: string;
  type: 'image' | 'video';
  id: string;
};

type GalleryProps = {
  items: GalleryItem[];
  specialItem?: GalleryItem | null;
};

export default function Gallery({ items, specialItem = null }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    },
  };

  const handleUnlock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passphrase.trim().toLowerCase() === 'sabeen') {
      setIsUnlocked(true);
      setUnlockError('');
      return;
    }

    setIsUnlocked(false);
    setUnlockError('Not the right word.');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {specialItem ? (
        <div className="mb-16 rounded-[2rem] border border-accent/15 bg-card/80 p-6 md:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                <Heart size={12} />
                Special Section
              </p>
              <h3 className="mt-5 text-3xl md:text-4xl font-serif text-foreground">
                A hidden memory that opens with the right name.
              </h3>
              <p className="mt-4 text-accent/70 leading-7">
                Enter the passphrase to unlock this one special video.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="w-full md:max-w-sm space-y-3">
              <label className="block text-sm font-medium text-foreground/70">
                Enter the passphrase
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  placeholder="Type here"
                  className="w-full rounded-2xl border border-accent/20 bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent/40"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-foreground px-5 py-3 text-background transition hover:opacity-90"
                >
                  Unlock
                </button>
              </div>
              {unlockError ? (
                <p className="text-sm text-red-500">{unlockError}</p>
              ) : (
                <p className="text-xs text-accent/50">Hint: it is a name.</p>
              )}
            </form>
          </div>

          <AnimatePresence initial={false}>
            {isUnlocked ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mt-8"
              >
                <button
                  type="button"
                  onClick={() => setSelectedItem(specialItem)}
                  className="group block w-full overflow-hidden rounded-[2rem] border border-accent/15 bg-background text-left shadow-sm smooth-shadow"
                >
                  <div className="grid gap-0 md:grid-cols-[minmax(0,1.1fr)_320px]">
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent/60">
                        Unlocked
                      </p>
                      <h4 className="mt-4 text-2xl md:text-3xl font-serif text-foreground">
                        {specialItem.name}
                      </h4>
                      <p className="mt-3 max-w-xl text-accent/70 leading-7">
                        This one sits apart from the rest. Tap to open the video.
                      </p>
                    </div>

                    <div className="relative min-h-[240px] bg-foreground">
                      <video
                        src={specialItem.url}
                        className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:opacity-100"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/90 text-foreground">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex min-h-[220px] items-center justify-center rounded-[2rem] border border-dashed border-accent/20 bg-background/60 p-8 text-center"
              >
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Lock size={22} />
                  </div>
                  <p className="mt-4 text-lg font-medium text-foreground">Locked for now</p>
                  <p className="mt-2 text-sm text-accent/60">
                    Enter the correct word to reveal the special video.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh] text-accent/60">
          No media found in `public/gallery`.
        </div>
      ) : null}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemAnim}
            className="group relative cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-accent/5 border border-accent/10 shadow-sm smooth-shadow">
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover" 
                    muted 
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-foreground">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-background/80 bg-black/20 p-1 rounded-md backdrop-blur-md">
                     <Play size={14} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-accent-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2 className="text-background" size={24} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 px-1">
               <p className="text-xs font-mono text-accent/40 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.name}
               </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-xl p-4 md:p-12"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-background/50 hover:text-background p-2 rounded-full hover:bg-white/10 transition-colors z-[60]"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
              
              <div className="absolute bottom-[-40px] left-0 right-0 text-center text-background/60 text-sm font-light">
                {selectedItem.name}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
