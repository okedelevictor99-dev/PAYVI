import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageTransition } from "@/components/layout/pageTransition";
import { useAuthContext } from "@/context/authContext";

const SignalMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} fill="none">
    <rect x="0" y="13" width="5" height="7" rx="1" fill="#34E7B4" />
    <rect x="7.5" y="9" width="5" height="11" rx="1" fill="#34E7B4" opacity="0.85" />
    <rect x="15" y="5" width="5" height="15" rx="1" fill="#5B4FE9" opacity="0.9" />
    <rect x="22.5" y="0" width="5" height="20" rx="1" fill="#5B4FE9" />
  </svg>
);

const chips = ["Airtime", "Data", "Bills", "Electricity"];

const Welcome = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[var(--color-background)] px-6 pb-8">
        {/* animated ambient glow */}
        <motion.div
          animate={{ opacity: [0.12, 0.2, 0.12], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #34E7B4, transparent 70%)" }}
        />

        {/* Content — vertically centered */}
        <div className="relative z-10 flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10 flex items-center gap-4"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <SignalMark className="h-13 w-16 drop-shadow-[0_8px_24px_rgba(91,79,233,0.35)]" />
            </motion.div>
            <span className="font-[var(--font-display)] text-6xl font-bold tracking-tight text-[var(--color-foreground)]">
              PAY<span className="text-[#34E7B4]">VI</span>
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-medium text-[var(--color-foreground)]"
          >
            Recharge in seconds.
          </motion.p>

          {/* service chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                className="rounded-full border border-[var(--color-foreground)]/10 bg-[var(--color-foreground)]/[0.03] px-4 py-2 text-sm font-medium text-[var(--color-muted-foreground)]"
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="mt-14 flex w-full items-center gap-3"
          >
            {isAuthenticated ? (
              <motion.div
                whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,79,233,0.4)" }}
                whileTap={{ scale: 0.97, y: 0 }}
                className="w-full rounded-lg"
              >
                <Link
                  to="/dashboard"
                  className="block whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-4 py-5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(91,79,233,0.3)]"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,79,233,0.4)" }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  className="flex-1 rounded-lg"
                >
                  <Link
                    to="/signup"
                    className="block whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-4 py-5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(91,79,233,0.3)]"
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(52,231,180,0.25)" }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  className="flex-1 rounded-lg"
                >
                  <Link
                    to="/login"
                    className="block whitespace-nowrap rounded-lg border border-[var(--color-foreground)]/15 bg-[var(--color-background)] px-4 py-5 text-base font-semibold text-[var(--color-foreground)] transition-colors hover:border-[#34E7B4]"
                  >
                    Log In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Footer motto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative z-10 mb-2 text-xs font-medium tracking-wide text-[var(--color-muted-foreground)]"
        >
          Always on. Always{" "}
          <span className="text-[#34E7B4]">PAY</span>
          <span className="text-[#5B4FE9]">VI</span>.
        </motion.p>
      </div>
    </PageTransition>
  );
};

export default Welcome;