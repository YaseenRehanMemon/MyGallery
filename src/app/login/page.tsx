'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
        className="w-full max-w-md p-8 bg-card rounded-2xl border border-accent/10 shadow-xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent/10 text-accent">
            <Camera size={32} />
          </div>
          <h1 className="text-3xl font-serif text-foreground">My Gallery</h1>
          <p className="mt-2 text-accent/60">Unlock your digital memories</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all text-foreground"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all text-foreground"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/30" size={18} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-foreground text-background font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Unlock Gallery'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
