// features/client/auth/auth.validation.ts
import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and number"
  );

export const otpSchema = z
  .string()
  .length(6, "Code must be 6 digits")
  .regex(/^\d{6}$/, "Code must contain only digits");

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resendVerificationTokenSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyResetOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

// The reset form only collects the new password.
// resetToken comes from router state, not from the form.
export const newPasswordSchema = z.object({
  newPassword: passwordSchema,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationTokenFormValues = z.infer<typeof resendVerificationTokenSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;