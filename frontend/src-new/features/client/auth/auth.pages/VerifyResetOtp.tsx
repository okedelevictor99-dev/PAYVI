// pages/VerifyResetOtp.tsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "@/features/client/auth/auth.hook";
import { useCooldown } from "@/hooks/useCooldown";
import { OtpInput } from "@/components/ui/otpInput";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/pageTransition";

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

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const { secondsLeft, isActive: isCoolingDown, start: startCooldown } =
    useCooldown(60);

  const {
    verifyResetOtp,
    isVerifyingResetOtp,
    verifyResetOtpError,
    forgotPassword,
    isSendingForgotPassword,
  } = useAuth();

  const handleSubmit = async () => {
    setCodeTouched(true);
    if (code.length !== 6) return; // don't hit the endpoint until the code is complete

    try {
      const response = await verifyResetOtp({ email, otp: code });
      navigate("/reset-password", {
        state: { resetToken: response.data.resetToken },
        replace: true,
      });
    } catch {
      // error is displayed via verifyResetOtpError below
    }
  };

  // There's no dedicated resend route, so resending = requesting a new reset code
  const handleResend = async () => {
    setResendMessage(null);
    try {
      await forgotPassword({ email });
      setResendMessage("A new code has been sent to your email.");
      startCooldown();
    } catch (error) {
      setResendMessage(
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Couldn't resend the code. Please try again."
      );
    }
  };

  const verifyErrorMessage =
    isAxiosError(verifyResetOtpError) &&
    verifyResetOtpError.response?.data?.message
      ? verifyResetOtpError.response.data.message
      : undefined;

  // All OTP errors are shown as plain text; the OTP boxes never turn red
  const otpErrorText =
    codeTouched && code.length !== 6
      ? "Enter the 6-digit code"
      : verifyErrorMessage;

  if (!email) {
    return (
      <PageTransition>
        <div className="flex h-full min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            We couldn&apos;t find an email to reset.{" "}
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

  return (
    <PageTransition>
      <div className="relative flex h-full min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />

        <div className="relative w-full max-w-sm text-center">
          <Wordmark />

          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-foreground)]">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Enter the 6-digit code we sent you to reset your password.
          </p>

          <div className="mt-8">
            <OtpInput value={code} onChange={setCode} />

            {otpErrorText && (
              <p className="mt-3 text-sm text-[var(--color-error)]">
                {otpErrorText}
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            variant="primary"
            isLoading={isVerifyingResetOtp}
            className="mt-6 w-full"
          >
            Verify code
          </Button>

          <div className="mt-6 text-sm text-[var(--color-muted-foreground)]">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isSendingForgotPassword || isCoolingDown}
              className="font-medium text-[#34E7B4] hover:underline disabled:opacity-60"
            >
              {isSendingForgotPassword
                ? "Sending..."
                : isCoolingDown
                ? `Resend in ${secondsLeft}s`
                : "Resend code"}
            </button>
          </div>

          {resendMessage && (
            <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyResetOtp;