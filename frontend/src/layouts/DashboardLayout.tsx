import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass =
    'flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl';

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">MPal</div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link to="/dashboard" className={linkClass}>
            <LayoutDashboard size={20} /> Overview
          </Link>

          <Link to="/dashboard/wallet" className={linkClass}>
            <Wallet size={20} /> Wallet
          </Link>

          <Link to="/dashboard/transactions" className={linkClass}>
            <CreditCard size={20} /> Transactions
          </Link>

          <Link to="/dashboard/payment-links" className={linkClass}>
            <ExternalLink size={20} /> Payment Links
          </Link>

          <Link to="/dashboard/invoices" className={linkClass}>
            <FileText size={20} /> Invoices
          </Link>

          <Link to="/dashboard/business" className={linkClass}>
            <Briefcase size={20} /> Business
          </Link>

          {/* ⚠️ নতুন — Subscription */}
          <Link to="/dashboard/subscription" className={linkClass}>
            <Crown size={20} /> Subscription
          </Link>

          <Link to="/dashboard/profile" className={linkClass}>
            <Settings size={20} /> Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm text-slate-500 hover:text-slate-900 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div className="text-slate-500 text-sm">Dashboard</div>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
            M
          </div>
        </header>
        <div className="p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;