// pages/ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/client/auth/auth.validation";
import { useAuth } from "@/features/client/auth/auth.hook";
import { Input } from "@/components/ui/input";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isSendingForgotPassword, forgotPasswordError } =
    useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values);
      navigate(`/verify-reset-otp?email=${encodeURIComponent(values.email)}`);
    } catch {
      // error is displayed below via forgotPasswordError
    }
  };

  const errorMessage =
    isAxiosError(forgotPasswordError) &&
    forgotPasswordError.response?.data?.message
      ? forgotPasswordError.response.data.message
      : undefined;

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />

        <div className="relative w-full max-w-sm">
          <Wordmark />

          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-foreground)]">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Enter your email and we&apos;ll send you a reset code.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4"
          >
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {errorMessage && (
              <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSendingForgotPassword}
              className="mt-2 w-full"
            >
              Send reset code
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-medium text-[#34E7B4] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;