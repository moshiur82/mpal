import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import api from '../api/axios';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  created_at: string;
  is_fraud?: boolean;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get('/transactions/');
        setTransactions(data);
      } catch (err: any) {
        console.error('Transaction fetch error:', err);

        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view transactions.');
        } else {
          setError('Failed to load transactions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Search filter
  const filteredTransactions = transactions.filter((t) =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Transaction History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-apple overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
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
                      <p className="text-sm font-medium text-slate-900">
                        {t.description || '—'}
                      </p>
                      {t.is_fraud && (
                        <p className="text-xs text-rose-600 font-medium">⚠️ Flagged as fraud</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      t.transaction_type === 'DEPOSIT'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {t.transaction_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-bold text-right ${
                    t.transaction_type === 'DEPOSIT'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {t.transaction_type === 'DEPOSIT' ? '+' : '-'}$
                  {parseFloat(t.amount.toString()).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && !error && (
          <div className="p-12 text-center text-slate-500">
            {transactions.length === 0
              ? 'No transactions found.'
              : 'No matching transactions.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;