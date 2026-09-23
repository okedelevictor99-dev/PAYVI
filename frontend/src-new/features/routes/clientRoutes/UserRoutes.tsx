import { Routes, Route } from "react-router-dom";

import Welcome from "@/components/common/Welcome";
import Login from "@/features/client/auth/auth.pages/Login";
import Signup from "@/features/client/auth/auth.pages/Signup";
import VerifyEmail from "@/features/client/auth/auth.pages/VerifyEmail";
import ForgotPassword from "@/features/client/auth/auth.pages/ForgotPassword";
import ResetPassword from "@/features/client/auth/auth.pages/ResetPassword";

import CustomerLayout from "@/components/layout/customerLayout";
import Home from "@/components/common/Home";
import { RequireAuth } from "./RequireAuth";
import VerifyResetOtp from "@/features/client/auth/auth.pages/VerifyResetOtp";
import Profile from "@/features/client/profile/profile.pages/profile";
import Data from "@/features/client/data/data.pages/Data";
import Airtime from "@/features/client/airtime/airtime.pages/Airtime";
import Electricity from "@/features/client/electricity/electricity.pages/electricity";
import Transaction from "@/features/client/transaction/transaction.pages/transaction";
import Referral from "@/features/client/referral/referral.pages/referral";
import FundWallet from "@/features/client/fund-wallet/fund-wallet.pages/fund-wallet";

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
      


      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/account" element={<Profile/>}/>
          <Route path="/dashboard/airtime" element={<Airtime/>}/>
          <Route path="/dashboard/data" element={<Data/>}/>
          <Route path="/dashboard/electricity" element={<Electricity/>}/>
          <Route path="/dashboard/transactions" element={<Transaction/>}/>
          <Route path="/dashboard/referrals" element={<Referral/>}/>
          <Route path="/dashboard/fund-wallet" element={<FundWallet/>}/>

        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;