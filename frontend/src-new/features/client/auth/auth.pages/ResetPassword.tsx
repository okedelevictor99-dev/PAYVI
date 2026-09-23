// pages/ResetPassword.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { z } from "zod";
import { newPasswordSchema } from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

// Extends the shared schema with a confirm field that only exists on this form.
const resetPasswordFormSchema = newPasswordSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

const SignalMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} fill="none">
    <rect x="0" y="13" width="5" height="7" rx="1" fill="#34E7B4" />
    <rect x="7.5" y="9" width="5" height="11" rx="1" fill="#34E7B4" opacity="0.85" />
    <rect x="15" y="5" width="5" height="15" rx="1" fill="#5B4FE9" opacity="0.9" />
    <rect x="22.5" y="0" width="5" height="20" rx="1" fill="#5B4FE9" />
  </svg>
);

const Wordmark = () => (
  <Link to="/" className="mb-10 inline-flex items-center gap-2.5">
    <SignalMark className="h-5 w-7" />
    <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
      PAY<span className="text-[#34E7B4]">VI</span>
    </span>
  </Link>
);

const CheckBadge = () => (
  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#34E7B4]/10">
    <svg
      className="h-7 w-7 text-[#34E7B4]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReset, setIsReset] = useState(false);

  // resetToken is handed over by VerifyResetOtp via router state.
  // It is never in the URL, so a refresh or direct visit will not have it.
  const resetToken =
    (location.state as { resetToken?: string } | null)?.resetToken ?? "";

  const { resetPassword, isResettingPassword, resetPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      // confirmPassword is only for client-side matching, so it isn't sent
      await resetPassword({ resetToken, newPassword: values.newPassword });
      setIsReset(true);
    } catch {
      // error is displayed below via resetPasswordError
    }
  };

  const resetErrorMessage =
    isAxiosError(resetPasswordError) &&
    resetPasswordError.response?.data?.message
      ? resetPasswordError.response.data.message
      : undefined;

  if (!resetToken) {
    return (
      <PageTransition>
        <div className="flex h-full min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Your reset session has expired or is invalid.{" "}
            <Link
              to="/forgot-password"
              className="font-medium text-[#34E7B4] hover:underline"
            >
              Start over
            </Link>
          </p>
        </div>
      </PageTransition>
    );
  }

  if (isReset) {
    return (
      <PageTransition>
        <div className="flex h-full min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
          <div className="w-full max-w-sm">
            <CheckBadge />
            <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-foreground)]">
              Password reset
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Your password has been updated. You can log in now.
            </p>
            <Button
              onClick={() => navigate("/login", { replace: true })}
              variant="primary"
              className="mt-8 w-full"
            >
              Continue to login
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, #34E7B4, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />

        <div className="relative w-full max-w-sm">
          <Wordmark />

          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-foreground)]">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Your code is verified. Choose a new password for your account.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4"
          >
            <div>
              <Input
                label="New password"
                type="password"
                id="newPassword"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              {!errors.newPassword && (
                <p className="mt-1.5 text-xs text-[var(--color-muted-foreground)]">
                  At least 8 characters, with uppercase, lowercase, and a
                  number.
                </p>
              )}
            </div>

            <Input
              label="Confirm password"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {resetErrorMessage && (
              <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
                {resetErrorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isResettingPassword}
              className="mt-2 w-full"
            >
              Reset password
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
            Changed your mind?{" "}
            <Link
              to="/login"
              className="font-medium text-[#34E7B4] hover:underline"
            >
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;