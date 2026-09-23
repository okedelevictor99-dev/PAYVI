// features/client/auth/auth.type.ts

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  avatar: string | null;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendVerificationTokenPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponseData {
  resetToken: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}