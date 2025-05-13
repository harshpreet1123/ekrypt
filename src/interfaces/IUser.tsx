// interfaces/IUser.ts
export interface IUser {
  email: string;
  name?: string;
  otp?: string;
  otpExpiresAt?: Date;
  isVerified: boolean;
  passwordHash?: string;
  provider?: string;
  createdAt: Date;
}
