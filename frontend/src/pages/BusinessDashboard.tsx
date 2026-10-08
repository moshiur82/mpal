import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PaymentLinkModal from '../components/PaymentLinkModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BusinessDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // পেজ লোডে আগের লিংকগুলো আনা
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const response = await axios.get('http://127.0.0.1:8000/api/payment-links/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLinks(response.data);
      } catch (err) {
        console.error('Failed to fetch payment links:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // Modal থেকে ডাটা এলে শুধু লিস্টে যোগ — আবার POST নয়
  const handleCreateLink = (data: any) => {
    setLinks((prev) => [data, ...prev]);
    setIsModalOpen(false);
    toast.success('Payment Link Created Successfully!');
  };

  const handleCopy = (code: string) => {
    const url = `http://localhost:5173/pay/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Business Overview
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back. Create and manage your payment links.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Create Payment Link
        </button>
      </div>

      {/* Payment Links Section */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-apple">
        <h3 className="text-lg font-semibold mb-6 text-slate-900">Your Payment Links</h3>

        {loading ? (
          <p className="text-sm text-slate-500 text-center py-4">Loading...</p>
        ) : links.length > 0 ? (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{link.product_name}</p>
                  <p className="text-xs text-slate-500">${link.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                    /pay/{link.unique_code}
                  </code>
                  <button
                    onClick={() => handleCopy(link.unique_code)}
                    className="text-blue-600 text-xs font-medium hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">
            No payment links created yet.
          </p>
        )}
      </div>

      <PaymentLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateLink}
      />
    </div>
  );
};

export default BusinessDashboard;