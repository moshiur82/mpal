import { useEffect, useState } from 'react';
import { Plus, MoreVertical, Loader2 } from 'lucide-react';
import axios from 'axios';
import CreateInvoiceModal from '../components/CreateInvoiceModal';

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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/invoices/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setInvoices(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchInvoices();
  };

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-sm text-slate-500">Manage and track your client billings.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-apple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">Invoice No.</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-blue-600" />
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{inv.client_email}</td>
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
                      <button type="button" className="text-slate-400 hover:text-slate-900">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {invoices.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Invoices;