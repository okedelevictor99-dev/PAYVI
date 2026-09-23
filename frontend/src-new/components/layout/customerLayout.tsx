import { useState, useEffect } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/features/client/auth/auth.hook";
import FullScreenLoader from "../ui/fullScreenLoader";

const SignalMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 28 20" className={className} fill="none">
    <rect x="0" y="13" width="5" height="7" rx="1" fill="#34E7B4" />
    <rect x="7.5" y="9" width="5" height="11" rx="1" fill="#34E7B4" opacity="0.85" />
    <rect x="15" y="5" width="5" height="15" rx="1" fill="#5B4FE9" opacity="0.9" />
    <rect x="22.5" y="0" width="5" height="20" rx="1" fill="#5B4FE9" />
  </svg>
);

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors duration-200 ${
    isActive
      ? "text-[#34E7B4]"
      : "text-[var(--color-muted-foreground)] hover:text-[#34E7B4]"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-[#34E7B4]/10 font-bold text-[#34E7B4]"
      : "text-[var(--color-foreground)] hover:bg-[#34E7B4]/10 hover:text-[#34E7B4]"
  }`;

const CustomerLayout = () => {
  const { logout, isLoggingOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (isLoggingOut) {
    return <FullScreenLoader text="Logging out..." />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card,var(--color-background))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-md p-1 text-[var(--color-foreground)] transition-colors hover:text-[#34E7B4] md:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="inline-flex items-center gap-2"
            >
              <SignalMark className="h-4 w-6" />
              <span className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-foreground)]">
                PAY<span className="text-[#34E7B4]">VI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-7 md:flex">
              <NavLink to="/dashboard" end className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/dashboard/transactions" className={navLinkClass}>
                Transactions
              </NavLink>

              <NavLink to="/dashboard/referrals" className={navLinkClass}>
                Referrals
              </NavLink>

              <NavLink to="/dashboard/account" className={navLinkClass}>
                Profile
              </NavLink>

              <button
                type="button"
                onClick={() => logout()}
                className="text-sm font-medium text-[var(--color-muted-foreground)] transition-colors duration-200 hover:text-[#34E7B4]"
              >
                Logout
              </button>
            </nav>

            {/* Notifications — swap for a real unread-count once the notifications hook exists */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-md p-1 text-[var(--color-foreground)] transition-colors duration-200 hover:text-[#34E7B4]"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#5B4FE9]" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-[var(--color-card,var(--color-background))] shadow-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
            >
              <div className="border-b border-[var(--color-border)] px-6 py-6">
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2"
                >
                  <SignalMark className="h-5 w-7" />
                  <span className="font-[var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                    PAY<span className="text-[#34E7B4]">VI</span>
                  </span>
                </Link>
              </div>

              <nav className="flex flex-1 flex-col p-4">
                <NavLink to="/dashboard" end onClick={closeMenu} className={mobileNavLinkClass}>
                  Home
                </NavLink>

                <NavLink
                  to="/dashboard/transactions"
                  onClick={closeMenu}
                  className={({ isActive }) => `mt-2 ${mobileNavLinkClass({ isActive })}`}
                >
                  Transactions
                </NavLink>

                <NavLink
                  to="/dashboard/referrals"
                  onClick={closeMenu}
                  className={({ isActive }) => `mt-2 ${mobileNavLinkClass({ isActive })}`}
                >
                  Referrals
                </NavLink>

                <NavLink
                  to="/dashboard/account"
                  onClick={closeMenu}
                  className={({ isActive }) => `mt-2 ${mobileNavLinkClass({ isActive })}`}
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="mt-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-[var(--color-foreground)] transition-all duration-200 hover:bg-[#34E7B4]/10 hover:text-[#34E7B4]"
                >
                  Logout
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;