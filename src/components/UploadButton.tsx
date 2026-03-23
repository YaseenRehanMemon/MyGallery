'use client';

import { useState, useRef } from 'react';
import { Upload, Check, Loader2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');

    try {
      // 1. Get the signed upload URL from our API
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        }
      });

      if (!response.ok) throw new Error('Failed to get upload URL');
      
      const { uploadUrl } = await response.json();

      if (uploadUrl) {
        // 2. Upload DIRECTLY to MinIO (bypassing Vercel's 4.5MB limit)
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) throw new Error('Cloud upload failed');
      } else {
        // Handle Vercel Blob or other fallbacks if needed
        throw new Error('No upload URL provided');
      }

      setStatus('success');
      // Reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*,video/*"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all shadow-lg
          ${status === 'success' ? 'bg-green-600 text-white' : 
            status === 'error' ? 'bg-red-600 text-white' : 
            'bg-accent text-background hover:bg-accent-dark'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="animate-spin" size={20} />
              <span>Uploading...</span>
            </motion.div>
          ) : status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Check size={20} />
              <span>Done!</span>
            </motion.div>
          ) : status === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <XCircle size={20} />
              <span>Failed</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Upload size={20} />
              <span>New memory</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {status === 'error' && (
         <p className="text-xs text-red-500 font-mono mt-2">
           Note: Vercel Blob must be configured for cloud uploads
         </p>
      )}
    </div>
  );
}
