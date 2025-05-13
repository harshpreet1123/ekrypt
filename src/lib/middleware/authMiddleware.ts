// lib/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../auth';

export const requireAuth = async (
  req: NextRequest
): Promise<{ userId: string } | NextResponse> => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    return { userId: decoded.userId };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
};
