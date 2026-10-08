import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'FREE',
    price: 0,
    features: ['Basic Wallet', 'Send/Receive', 'Standard Support'],
    popular: false,
  },
  {
    name: 'PRO',
    price: 19,
    features: ['Everything in Free', 'Advanced API', 'Webhooks', 'Priority Support'],
    popular: true,
  },
  {
    name: 'BUSINESS',
    price: 79,
    features: ['Everything in Pro', 'AI Risk Engine', 'Team Access', 'Custom Integrations'],
    popular: false,
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-blue-600">MPal</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-all">
            Product
          </a>
          <a href="#solutions" className="hover:text-slate-900 transition-all">
            Solutions
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-all">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 md:py-32 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            The Intelligent <span className="text-blue-600">Payment</span> Platform
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Payments powered by AI. Security powered by intelligence. Automate your
            business and detect risk before it becomes a problem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              Start Building <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition-all"
            >
              Explore Platform
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to scale
            </h2>
            <p className="text-slate-500">
              Powerful tools for personal and business-grade finance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="text-blue-600" size={28} />}
              title="AI Risk Engine"
              desc="Real-time fraud detection using deep learning to protect every transaction."
            />
            <FeatureCard
              icon={<Zap className="text-amber-500" size={28} />}
              title="Instant Payments"
              desc="Send and receive money globally with sub-second latency."
            />
            <FeatureCard
              icon={<Globe className="text-emerald-500" size={28} />}
              title="Developer First"
              desc="Robust APIs, Webhooks, and SDKs to integrate MPal into your own apps."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-lg">
              Choose the perfect plan for your business needs. Upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -8 }}
                className={`relative bg-white p-8 rounded-[32px] border shadow-sm flex flex-col ${
                  plan.popular
                    ? 'border-blue-500 border-2 shadow-xl shadow-blue-100'
                    : 'border-slate-100'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Star size={12} /> Popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 MPal Intelligence Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-apple flex flex-col items-start gap-4"
  >
    <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </motion.div>
);

export default LandingPage;