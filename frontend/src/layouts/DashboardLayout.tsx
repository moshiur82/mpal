import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, Settings, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout = ({ onLogout }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">MPal</div>
        <nav className="flex-1 px-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
          >
            <Wallet size={20} /> Wallet
          </Link>
          <Link
            to="/payments"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
          >
            <CreditCard size={20} /> Payments
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
          >
            <Settings size={20} /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm text-slate-500 hover:text-slate-900 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div className="text-slate-500 text-sm">Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
              M
            </div>
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