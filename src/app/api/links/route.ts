// app/api/link/route.ts (or pages/api/link.ts if using pages)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { nanoid } from 'nanoid';
import { Link } from '@/model/Link';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const {
    originalUrl,
    ttlMinutes,
    expiresAt,
    oneTimeOnly,
    password,
    maxClicks,
    userId,
  } = body;

  const shortCode = nanoid(6);

  const link = await Link.create({
    originalUrl,
    shortCode,
    ttlMinutes,
    expiresAt,
    oneTimeOnly,
    maxClicks,
    passwordHash: password ? await bcrypt.hash(password, 10) : null,
    userId: userId || null,
    clickCount: 0,
    createdAt: new Date(),
  });
  console.log(link);

  return NextResponse.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
}
