import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-get-8">
      <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[32px] shadow-apple border border-slate-100 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user?.username}</h2>
            <p className="text-slate.500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs text-slate.500 uppercase font-medium">Account Status</p>
            <div className="flex items-center gap-2 mt-1 text-emerald-600 font-semibold">
              <ShieldCheck size={16} />
              <span>Verified</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs text-slate.500 uppercase font-medium">Receive via Email</p>
            <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;