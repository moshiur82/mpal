import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import AddMoneyModal from '../components/AddMoneyModal';

interface WalletData {
  balance: number;
  updated_at: string;
}

const Wallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/wallet/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWallet(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching wallet:', err);

        if (err.response?.status === 401) {
          setError('Session expired or invalid token. Please login again.');
          localStorage.removeItem('access_token');
        } else {
          setError(err.response?.data?.error || 'Failed to load wallet data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleSuccess = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
        <p className="font-medium">{error}</p>
        <p className="text-sm mt-2 text-red-500">
          Browser Console-এ <code>localStorage.getItem('access_token')</code> চেক করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">My Digital Wallet</h1>

      {/* Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <WalletIcon size={32} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-400">MPal Premium</span>
          </div>

          <p className="text-slate-400 text-sm mb-1">Available Balance</p>
          <h2 className="text-4xl font-bold mb-8">
            $
            {wallet?.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="opacity-50">Card Number:</span> **** **** **** 4242
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-100 p-4 rounded-2xl text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowUpRight size={18} /> Add Money
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 p-4 rounded-2xl text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
          <ArrowDownRight size={18} /> Withdraw
        </button>
      </div>

      <AddMoneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Wallet;