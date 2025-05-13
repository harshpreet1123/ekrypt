// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/model/User';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, name } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const existing = await User.findOne({ email });

  if (existing) {
    return new NextResponse('User already exists', { status: 400 });
  }

  await User.create({
    email,
    name,
    otp,
    otpExpiresAt: expiresAt,
    isVerified: false,
    createdAt: new Date(),
  });

  console.log('OTP for signup:', otp); // Replace with email logic

  return NextResponse.json({ message: 'OTP sent to email' });
}
