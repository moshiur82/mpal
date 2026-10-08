import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Clock } from 'lucide-react';
import axios from 'axios';
import PaymentLinkModal from '../components/PaymentLinkModal';

interface PaymentLink {
  id: number;
  product_name: string;
  amount: number;
  description: string;
  unique_code: string;
  created_at: string;
}

const PaymentLinks = () => {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/payment-links/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(response.data);
    } catch (err) {
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`http://localhost:5173/pay/${code}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payment Links</h1>
          <p className="text-sm text-slate-500">Create links to receive payments instantly.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={18} /> Create New Link
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-900">{link.product_name}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                    Active
                  </span>
                </div>
                <p className="text-sm text-slate-500">{link.description}</p>
                <div className="text-2xl font-bold text-slate-900">
                  ${Number(link.amount).toLocaleString()}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={14} />
                  {new Date(link.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleCopy(link.unique_code)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600"
                >
                  <Copy size={14} /> Copy Link
                </button>
              </div>
            </motion.div>
          ))}
          {links.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No payment links created yet.
            </div>
          )}
        </div>
      )}

      <PaymentLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchLinks();
        }}
      />
    </div>
  );
};

export default PaymentLinks;