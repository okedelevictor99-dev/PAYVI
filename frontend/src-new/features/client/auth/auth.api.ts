// features/client/auth/auth.api.ts
import { client, getRefreshToken } from "@/api-setup/client";
import type { ApiResponse } from "@/app/response";
import type {
  User,
  SignupPayload,
  VerifyEmailPayload,
  ResendVerificationTokenPayload,
  LoginPayload,
  LoginResponseData,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  VerifyResetOtpResponseData,
  ResetPasswordPayload,
  RefreshTokenResponseData,
} from "@/features/client/auth/auth.type";

export const signup = async (payload: SignupPayload) => {
  const { data } = await client.post<ApiResponse<User>>("/auth/register", payload);
  return data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/verify-email", payload);
  return data;
};

export const resendVerificationToken = async (
  payload: ResendVerificationTokenPayload
) => {
  const { data } = await client.post<ApiResponse>("/auth/resend-verification", payload);
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await client.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/forgot-password", payload);
  return data;
};

export const verifyResetOtp = async (payload: VerifyResetOtpPayload) => {
  const { data } = await client.post<ApiResponse<VerifyResetOtpResponseData>>(
    "/auth/verify-reset-otp",
    payload
  );
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await client.post<ApiResponse>("/auth/reset-password", payload);
  return data;
};

export const restoreSession = async () => {
  const refreshToken = getRefreshToken();
  const { data } = await client.post<ApiResponse<RefreshTokenResponseData>>(
    "/auth/refresh",
    { refreshToken }
  );
  return data;
};
export const getMe = async () => {
  const { data } = await client.get<ApiResponse<User>>("/auth/me");
  return data;
};