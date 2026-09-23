// pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/client/auth/auth.validation";
import { isUnverifiedUserError } from "@/features/client/auth/auth.utils";
import { useAuth } from "@/features/client/auth/auth.hook";
import { useToast } from "@/context/toastContext";
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
  <Link to="/" className="mb-8 inline-flex items-center gap-2.5">
    <SignalMark className="h-5 w-7" />
    <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
      PAY<span className="text-[#34E7B4]">VI</span>
    </span>
  </Link>
);

const Login = () =>{
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const {
    login,
    isLoggingIn,
    loginError,
    resendVerificationToken,
    isResendingVerificationToken,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      navigate(from);
    } catch (error) {
      // Backend message: "User not verified" (401)
      if (isUnverifiedUserError(error)) {
        showToast("Verify your email before logging in");
        try {
          await resendVerificationToken({ email: values.email });
        } catch {
          // the verify page has its own resend button
        }
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    }
  };

  // The "User not verified" case is communicated by the toast only,
  // so it's never shown as inline text.
  const loginErrorMessage =
    !isUnverifiedUserError(loginError) &&
    isAxiosError(loginError) &&
    loginError.response?.data?.message
      ? loginError.response.data.message
      : undefined;

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
        {/* subtle ambient glow — keeps the page from feeling flat with no side panel */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, #34E7B4, transparent 70%)" }}
        />

        <div className="relative w-full max-w-sm">
          <Wordmark />

          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--color-foreground)]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Log in to manage your airtime, data and bills in one place.
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

            <div>
              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--color-muted-foreground)] transition-colors hover:text-[#34E7B4]"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {loginErrorMessage && (
              <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
                {loginErrorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoggingIn || isResendingVerificationToken}
              className="mt-2 w-full"
            >
              Log in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
            New to PAYVI?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#34E7B4] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;