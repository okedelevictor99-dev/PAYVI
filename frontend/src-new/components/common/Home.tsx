import { Link } from "react-router-dom";
import { useAuth } from "@/features/client/auth/auth.hook";
import { useContext } from "react";
import { useAuthContext } from "@/context/authContext";

// ── Icons ──────────────────────────────────────────────
const PhoneIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>
);

const WifiIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
    />
  </svg>
);

const BoltIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
    />
  </svg>
);

const CopyIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25"
    />
  </svg>
);

// ── Quick action data ──────────────────────────────────
const quickActions = [
  {
    label: "Buy Airtime",
    description: "Top up any network instantly",
    icon: PhoneIcon,
    to: "/dashboard/airtime",
  },
  {
    label: "Buy Data",
    description: "Data bundles at the best rates",
    icon: WifiIcon,
    to: "/dashboard/data",
  },
  {
    label: "Pay Electricity",
    description: "Settle prepaid & postpaid bills",
    icon: BoltIcon,
    to: "/dashboard/electricity",
  },
];

const Home = () => {
  const { user } = useAuthContext();

  // Placeholder — replace with useWallet() once the hook exists
  const walletBalance = 0;
  const referralCode =  "PAYVI-XXXXXX";

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Greeting */}
      <h1 className="font-[var(--font-display)] text-2xl font-medium text-[var(--color-foreground)]">
        Welcome back{user?.lastName ? `, ${user.lastName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
        Manage your airtime, data and bills in one place.
      </p>

      {/* Wallet card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#5B4FE9] to-[#34E7B4] p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-white/80">Wallet Balance</p>
        <p className="mt-1 font-[var(--font-display)] text-3xl font-semibold">
          ₦{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <Link
          to="/dashboard/fund-wallet"
          className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-medium text-[#14151A] transition hover:bg-white/90"
        >
          Fund Wallet
        </Link>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-[var(--color-muted-foreground)]">Quick actions</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickActions.map(({ label, description, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card,var(--color-background))] p-5 transition hover:border-[#34E7B4]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34E7B4]/10 text-[#34E7B4] transition group-hover:bg-[#34E7B4]/20">
                <Icon />
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--color-foreground)]">{label}</p>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Referral banner */}
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-xl border border-[#5B4FE9]/30 bg-[#5B4FE9]/10 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Invite friends, earn rewards</p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Share your code — you both get a bonus when they make their first transaction.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)]">
            {referralCode}
          </span>
          <button
            type="button"
            onClick={handleCopyReferral}
            aria-label="Copy referral code"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] transition hover:border-[#34E7B4] hover:text-[#34E7B4]"
          >
            <CopyIcon />
          </button>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--color-muted-foreground)]">Recent transactions</h2>
          <Link to="/dashboard/transactions" className="text-xs font-medium text-[#34E7B4] hover:underline">
            View all
          </Link>
        </div>

        {/* Placeholder empty state — swap for a real list once transactions are wired up */}
        <div className="mt-3 rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">No transactions yet</p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Your airtime, data and bill payments will show up here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;