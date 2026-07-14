import { BrowserRouter, Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import GlobalNotifications from './components/GlobalNotifications';

// Import new dashboard pages
import MarketsPage from './pages/MarketsPage';
import TradePage from './pages/TradePage';
import FundAccountPage from './pages/FundAccountPage';
import WithdrawFundsPage from './pages/WithdrawFundsPage';
import CheckTradePage from './pages/CheckTradePage';
import SignalPurchasePage from './pages/SignalPurchasePage';
import CopyTradingPage from './pages/CopyTradingPage';
import MyPurchasedPage from './pages/MyPurchasedPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordDashboardPage from './pages/ResetPasswordDashboardPage';
import SupportPage from './pages/SupportPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  return (
    <BrowserRouter>
      {/* Only show notifications on home page */}
      {location.pathname === "/" && <GlobalNotifications />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
        <Route path="/user-verify/:token" element={<VerifyEmailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} /> {/* Default dashboard view */}
          <Route path="markets" element={<MarketsPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="fund-account" element={<FundAccountPage />} />
          <Route path="withdraw-funds" element={<WithdrawFundsPage />} />
          <Route path="check-trade" element={<CheckTradePage />} />
          <Route path="signal-purchase" element={<SignalPurchasePage />} />
          <Route path="copy-trading" element={<CopyTradingPage />} />
          <Route path="my-purchased" element={<MyPurchasedPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="reset-password" element={<ResetPasswordDashboardPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App