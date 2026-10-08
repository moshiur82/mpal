import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginView from './pages/LoginView';
import Overview from './pages/Overview';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Invoices from './pages/Invoices';
import BusinessDashboard from './pages/BusinessDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Verify from './pages/Verify';
import PaymentLinks from './pages/PaymentLinks';
function AppRoutes() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          !isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginView onLogin={login} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
        }
      />
      {/* Verify needs token — allow if authenticated, else login */}
      <Route
        path="/verify"
        element={
          isAuthenticated ? <Verify /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Overview />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="payments" element={<Transactions />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="business" element={<BusinessDashboard />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payment-links" element={<PaymentLinks />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;