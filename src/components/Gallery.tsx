'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Play, X } from 'lucide-react';

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
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
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

  return (
    <div className="container mx-auto px-4 py-12">
      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh] text-accent/60">
          No media found in `public/gallery`.
        </div>
      ) : null}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {items.map((item, i) => (
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
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i < 4}
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
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  width={1920}
                  height={1920}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl w-auto h-auto"
                  quality={90}
                  priority
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
