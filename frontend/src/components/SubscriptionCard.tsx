import React from 'react';
import { Check } from 'lucide-react';

interface PlanProps {
  name: string;
  price: string;
  features: string[];
  isCurrent: boolean;
  onSelect: (plan: string) => void;
}

const SubscriptionCard = ({ name, price, features, isCurrent, onSelect }: PlanProps) => {
  return (
    <div className={`relative p-8 rounded-[32px] border transition-all ${
      isCurrent 
        ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' 
        : 'border-slate-100 bg-white shadow-apple'
    }`}>
      {isCurrent && (
        <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Current
        </span>
      )}
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-bold text-slate.900">${price}</span>
        <span className="text-slate-500 text-sm">/month</span>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
            <Check size={16} className="text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(name)}
        disabled={isCurrent}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          isCurrent 
            ? 'bg-slate-100 text-slate.500 cursor-not-allowed' 
            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
        }`}
      >
        {isCurrent ? 'Active Plan' : 'Upgrade Plan'}
      </button>
    </div>
  );
};

export default SubscriptionCard;