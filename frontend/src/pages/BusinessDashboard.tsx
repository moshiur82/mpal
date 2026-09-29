import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, CreditCard, Zap, ShoppingBag, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PaymentLinkModal from '../components/PaymentLinkModal';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const BusinessDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Business Overview
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back, Acme Corporation. Here is your performance.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg"
            >
              <Plus size={16} />
              Create Payment Link
            </button>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$184,920" change="+12%" icon={TrendingUp} isPositive={true} />
          <StatCard title="Customers" value="1,240" change="+5.4%" icon={Users} isPositive={true} />
          <StatCard title="Payments" value="8,432" change="-2.1%" icon={CreditCard} isPositive={false} />
          <StatCard title="AI Risk Score" value="Low" change="+0.1%" icon={Zap} isPositive={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[28px] border border-slate-100 shadow-apple">
            <h3 className="text-lg font-semibold mb-6 text-slate-900">Revenue Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="sales" fill="#0071e3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-apple">
            <h3 className="text-lg font-semibold mb-6 text-slate-900">Recent Payments</h3>
            <div className="space-y-6">
              {[
                { name: 'Customer A', amount: '$450', type: 'Success', color: 'text-emerald-600' },
                { name: 'Customer B', amount: '$820', type: 'Review', color: 'text-amber-600' },
                { name: 'Customer C', amount: '$120', type: 'Failed', color: 'text-rose-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <ShoppingBag size={18} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">Payment received</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.amount}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:underline">
              View All Payments
            </button>
          </div>
        </div>
      </div>

      {/* Payment Link Modal */}
      <PaymentLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log('Payment link created successfully');
        }}
      />
    </>
  );
};

const StatCard = ({ title, value, change, icon: Icon, isPositive }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <div className="p-2 bg-slate-50 rounded-xl">
        <Icon size={24} strokeWidth={1.5} className="text-slate-900" />
      </div>
      <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? '+' : '-'}{change}%
      </span>
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
    </div>
  </motion.div>
);

export default BusinessDashboard;