// pages/Signup.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/client/auth/auth.validation";
import { isAlreadyRegisteredError } from "@/features/client/auth/auth.utils";
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
  <Link to="/" className="mb-8 inline-flex items-center gap-2.5">
    <SignalMark className="h-5 w-7" />
    <span className="font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
      PAY<span className="text-[#34E7B4]">VI</span>
    </span>
  </Link>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp, signupError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch {
      // error is displayed below via signupError
    }
  };

  // Backend message: "User already exists and verified, Please Login"
  const isAlreadyRegistered = isAlreadyRegisteredError(signupError);

  const signupErrorMessage = isAlreadyRegistered
    ? "You already have an account, proceed to login"
    : isAxiosError(signupError) && signupError.response?.data?.message
    ? signupError.response.data.message
    : undefined;

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6 py-10">
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Join PAYVI to start recharging in seconds.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                type="text"
                id="firstName"
                placeholder="Jane"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Last name"
                type="text"
                id="lastName"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

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
              {!errors.password && (
                <p className="mt-1.5 text-xs text-[var(--color-muted-foreground)]">
                  At least 8 characters, with uppercase, lowercase, and a
                  number.
                </p>
              )}
            </div>

            {signupErrorMessage && (
              <p className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
                {signupErrorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isSigningUp}
              className="mt-2 w-full"
            >
              Create account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
            Already have an account?{" "}
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

export default Signup;