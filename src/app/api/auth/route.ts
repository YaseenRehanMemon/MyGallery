import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// In a real app, these should be environment variables
// For this setup, we'll use these defaults but suggest setting them in Vercel
const USERNAME = process.env.GALLERY_USERNAME || 'admin';
const PASSWORD = process.env.GALLERY_PASSWORD || 'password123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-123-very-long';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === USERNAME && password === PASSWORD) {
      // Create a simple JWT token
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return NextResponse.json({ success: true });
}
