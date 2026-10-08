import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }: CreateInvoiceModalProps) => {
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setClientEmail('');
    setAmount('');
    setDescription('');
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://127.0.0.1:8000/api/invoices/',
        {
          client_email: clientEmail,
          amount: parseFloat(amount),
          description: description,
          status: 'PENDING',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Invoice creation error:', err);
      const data = err.response?.data;
      const msg =
        data?.error ||
        data?.client_email?.[0] ||
        data?.amount?.[0] ||
        data?.detail ||
        'Failed to create invoice.';
      setError(typeof msg === 'string' ? msg : 'Failed to create invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-xl font-semibold text-slate-900">Create Invoice</h2>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Client Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What is this for?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs">
                  <CheckCircle2 size={14} />
                  <span>Invoice created successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <FileText size={18} /> Create Invoice
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateInvoiceModal;