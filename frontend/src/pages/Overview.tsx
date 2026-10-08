import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet as WalletIcon,
  CreditCard,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/axios';

interface WalletData {
  balance: number;
  updated_at: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  created_at: string;
  is_fraud?: boolean;
}

const Overview = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          api.get('/wallet/'),
          api.get('/transactions/'),
        ]);
        setWallet(walletRes.data);
        // সর্বশেষ ৫টা
        const list = Array.isArray(txRes.data) ? txRes.data : txRes.data?.results || [];
        setTransactions(list.slice(0, 5));
      } catch (err: any) {
        console.error('Overview fetch error:', err);
        setError(err.response?.data?.detail || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fraudCount = transactions.filter((t) => t.is_fraud).length;
  const hasFraud = fraudCount > 0;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500">Welcome back! Here's your financial summary.</p>
      </div>

      {/* API error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* AI Security Status */}
      {hasFraud ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600"
        >
          <AlertCircle size={20} />
          <span className="text-sm font-medium">
            Security Alert: {fraudCount} suspicious transaction(s) detected by AI!
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700"
        >
          <ShieldCheck size={20} />
          <span className="text-sm font-medium">AI Security Status: All clear — no fraud detected.</span>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-xl">
              <WalletIcon size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Balance</p>
          <h3 className="text-2xl font-semibold text-slate-900">
            ${wallet?.balance?.toLocaleString() || '0.00'}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">Total Transactions</p>
          <h3 className="text-2xl font-semibold text-slate-900">{transactions.length}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-xl">
              <CreditCard size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">AI Risk Score</p>
          <h3 className={`text-2xl font-semibold ${hasFraud ? 'text-rose-600' : 'text-slate-900'}`}>
            {hasFraud ? 'High' : 'Low'}
          </h3>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-apple overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No transactions yet.</div>
          ) : (
            transactions.map((t) => (
              <div
                key={t.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      t.transaction_type === 'DEPOSIT'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {t.transaction_type === 'DEPOSIT' ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {t.description || 'Transaction'}
                      </p>
                      {t.is_fraud && (
                        <span className="text-[10px] font-semibold uppercase bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                          Fraud
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm font-bold ${
                    t.transaction_type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.transaction_type === 'DEPOSIT' ? '+' : '-'}$
                  {parseFloat(t.amount.toString()).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;