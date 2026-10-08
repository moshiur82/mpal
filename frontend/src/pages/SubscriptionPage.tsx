import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

interface Plan {
  name: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'FREE',
    price: 0,
    features: ['Basic Wallet', 'Send/Receive', 'Standard Support'],
    icon: <Zap size={24} />,
  },
  {
    name: 'PRO',
    price: 19,
    features: ['Everything in Free', 'Advanced API', 'Webhooks'],
    icon: <Star size={24} />,
    popular: true,
  },
  {
    name: 'BUSINESS',
    price: 79,
    features: ['Everything in Pro', 'AI Risk Engine', 'Team Access'],
    icon: <ShieldCheck size={24} />,
  },
];

const SubscriptionPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    setLoading(planName);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/subscriptions/', {
        plan_type: planName,
      });

      setSuccess(`Successfully upgraded to ${planName} plan!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.plan_type?.[0] ||
        'Failed to upgrade plan.'
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Upgrade Your Plan</h1>
        <p className="text-slate-500">
          Choose the perfect-fit plan for your business needs.
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-100 text-center">
          ✅ {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ y: -10 }}
            className={`bg-white p-8 rounded-[32px] border shadow-apple flex flex-col relative ${
              plan.popular
                ? 'border-blue-500 border-2'
                : 'border-slate-100'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Popular
              </span>
            )}

            <div className="mb-6 text-blue-600">{plan.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.name)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {loading === plan.name ? 'Processing...' : 'Choose Plan'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;