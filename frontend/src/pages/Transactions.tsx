import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

const Transactions = () => {
  // ডামি ডাটা
  const transactions: Transaction[] = [
    { id: 1, description: 'Netflix Subscription', amount: 18.00, type: 'EXPENSE', date: 'Sep 24, 2026' },
    { id: 2, description: 'Client Payment', amount: 850.00, type: 'INCOME', date: 'Sep 23, 2026' },
    { id: 3, description: 'Amazon Purchase', amount: 120.00, type: 'EXPENSE', date: 'Sep 22, 2026' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Recent Transactions</h1>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-apple overflow-hidden">
        <div className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <motion.div 
              key={t.id}
              whileHover={{ backgroundColor: '#f8fafc' }}
              className="flex items-center justify-between p-6 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.type === 'INCOME' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.description}</p>
                  <p className="text-xs text-slate-500">{t.date}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;