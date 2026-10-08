import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/verify/',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Verification failed', err);
      alert('Verification failed! Please login first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600">
            <CheckCircle2 size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Verify your Email</h1>
          <p className="text-slate-500">
            Click the button below to complete your setup. (Demo verification)
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-600 font-medium"
          >
            Verified successfully! Redirecting...
          </motion.div>
        ) : (
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Verify Email Address'}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Verify;