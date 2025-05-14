// app/api/auth/verify/route.ts
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { User } from "@/model/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  console.log(user);

  if (!user || user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
    return new NextResponse("Invalid or expired OTP", { status: 400 });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return NextResponse.json({
    data: {},
    sucess: true,
    message: "email verified",
  });
}
