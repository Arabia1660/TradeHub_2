import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useAuth } from "./providers/AuthProvider";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Investment from "./pages/Investment";
import Transactions from "./pages/Transactions";
import Trade from "./pages/Trade";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Social from "./pages/Social";
import AdmimShares from "./pages/AdmimShares";
import AdminDeposit from "./pages/AdminDeposit";
import AdminWithdraw from "./pages/AdminWithdraw";
import AdminBanks from "./pages/AdminBanks";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./LandingPage";
import Market from "./pages/Market";
import AdminMarket from "./pages/AdminMarket";
import Search from "./pages/Search";

const App = () => {
  const { user, login } = useAuth();

  return (
    <Router>
      {user?.isAdmin ? (
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="admin-shares" element={<AdmimShares />} />
            <Route path="admin-deposit" element={<AdminDeposit />} />
            <Route path="admin-withdraw" element={<AdminWithdraw />} />
            <Route path="admin-Banks" element={<AdminBanks />} />
            <Route path="/admin-market" element={<AdminMarket/>}/>
          </Routes>
        </AdminLayout>
      ) : user ? (
        <UserLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="social" element={<Social />} />
            <Route path="/market" element={<Market />} />
            <Route path="/search" element={<Search />} />
            
          </Routes>
        </UserLayout>
      ) : (
        <Routes>
        <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
