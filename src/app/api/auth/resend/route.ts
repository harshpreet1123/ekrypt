// app/api/auth/resend/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new NextResponse('User not found', { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiresAt = expiresAt;
  await user.save();

  console.log('Resent OTP:', otp); // Replace with email logic

  return NextResponse.json({ message: 'OTP resent' });
}
