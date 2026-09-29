import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Search, Filter } from 'lucide-react';
import api from '../api/axios';

interface Invoice {
  id: number;
  invoice_number: string;
  client_email: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await api.get('/invoices/');
        setInvoices(data);
      } catch (err: any) {
        console.error('Invoice fetch error:', err);

        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view invoices.');
        } else {
          setError('Failed to load invoices. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-600';
      case 'PENDING':
        return 'bg-amber-50 text-amber-600';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  // Search filter
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="tracking-tight text-2xl font-semibold text-slate-900">
          Invoices
        </h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all">
          + New Invoice
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-apple overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
            <Filter size={18} />
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="px-6 py-4 font-medium">Invoice No.</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {inv.invoice_number}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {inv.client_email}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  ${parseFloat(inv.amount.toString()).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(
                      inv.status
                    )}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(inv.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-900">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && !error && (
          <div className="p-12 text-center text-slate-500">
            {invoices.length === 0
              ? 'No invoices found.'
              : 'No matching invoices.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;