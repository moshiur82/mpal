import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, ShieldCheck, DollarSign, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  amount: number | string;
  description: string;
  transaction_type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  category: string;
  created_at: string;
}

const Overview = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch');
        setTransactions(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getDirection = (type: string) => (type === 'DEPOSIT' ? 'INCOME' : 'EXPENSE');

  const totalBalance = transactions.reduce((acc, curr) => {
    const amt = parseFloat(curr.amount.toString());
    return getDirection(curr.transaction_type) === 'INCOME' ? acc + amt : acc - amt;
  }, 0);

  const monthlyIncome = transactions
    .filter((t) => getDirection(t.transaction_type) === 'INCOME')
    .reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0);

  const totalExpenses = transactions
    .filter((t) => getDirection(t.transaction_type) === 'EXPENSE')
    .reduce((acc, curr) => acc + parseFloat(curr.amount.toString()), 0);

  const chartData = transactions
    .filter((t) => getDirection(t.transaction_type) === 'INCOME')
    .reduce((acc: any[], curr) => {
      const date = new Date(curr.created_at);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const existing = acc.find((item) => item.key === monthKey);
      if (existing) {
        existing.amount += parseFloat(curr.amount.toString());
      } else {
        acc.push({ name: monthName, amount: parseFloat(curr.amount.toString()), key: monthKey });
      }
      return acc;
    }, [])
    .sort((a, b) => a.key.localeCompare(b.key));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Financial Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={`$${totalBalance.toLocaleString()}`} icon={Wallet} isPositive={true} />
        <StatCard title="Monthly Income" value={`$${monthlyIncome.toLocaleString()}`} icon={DollarSign} isPositive={true} />
        <StatCard title="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} icon={Activity} isPositive={false} />
        <StatCard title="AI Risk Score" value="Low" icon={ShieldCheck} isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[28px] border border-slate-100 shadow-apple">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#0071e3" fillOpacity={1} fill="url(#colorAmount)" />
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-apple">
          <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
          <div className="space-y-6">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between">
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
                    <p className="text-sm font-medium text-slate-900">{t.description}</p>
                    <p className="text-xs text-slate-500">{t.category}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.transaction_type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.transaction_type === 'DEPOSIT' ? '+' : '-'}$
                  {parseFloat(t.amount.toString()).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  isPositive?: boolean;
}

const StatCard = ({ title, value, icon: Icon, isPositive }: StatCardProps) => (
  <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-apple">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-xl">
        <Icon size={24} className="text-slate-900" />
      </div>
      {isPositive !== undefined && (
        <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '↑' : '↓'}
        </span>
      )}
    </div>
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
  </div>
);

export default Overview;