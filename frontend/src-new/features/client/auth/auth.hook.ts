// features/client/auth/auth.hook.ts
import { useMutation } from "@tanstack/react-query";

import * as authApi from "@/features/client/auth/auth.api";
import { setAccessToken, setRefreshToken } from "@/api-setup/client";
import { useAuthContext } from "@/context/authContext";

import type {
  LoginPayload,
  SignupPayload,
  VerifyEmailPayload,
  ResendVerificationTokenPayload,
  ForgotPasswordPayload,
  VerifyResetOtpPayload,
  ResetPasswordPayload,
} from "@/features/client/auth/auth.type";

export const useAuth = () => {
  const { setUser } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setUser(response.data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
  });

  const resendVerificationTokenMutation = useMutation({
    mutationFn: (payload: ResendVerificationTokenPayload) =>
      authApi.resendVerificationToken(payload),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });

  const verifyResetOtpMutation = useMutation({
    mutationFn: (payload: VerifyResetOtpPayload) =>
      authApi.verifyResetOtp(payload),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });

  // No logout route on the backend yet, so this only clears the session locally.
    const logoutMutation = useMutation({
    // No logout route on the backend yet, so this only clears the session locally.
    mutationFn: async () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,

    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,

    resendVerificationToken: resendVerificationTokenMutation.mutateAsync,
    isResendingVerificationToken: resendVerificationTokenMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingForgotPassword: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    verifyResetOtp: verifyResetOtpMutation.mutateAsync,
    isVerifyingResetOtp: verifyResetOtpMutation.isPending,
    verifyResetOtpError: verifyResetOtpMutation.error,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  };
};