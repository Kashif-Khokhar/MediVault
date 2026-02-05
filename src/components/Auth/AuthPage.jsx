import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Mail, Lock, Loader2, Cloud, ArrowRight, ShieldCheck, Zap, Globe, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import authBg from '../../assets/auth-bg.png';

const AuthPage = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <ShieldCheck className="text-medical-500" />, title: "Zero-Knowledge", desc: "Data is encrypted client-side. We never see your records." },
    { icon: <Zap className="text-medical-500" />, title: "Instant Sync", desc: "Seamlessly backup your vault across multiple devices." },
    { icon: <Globe className="text-medical-500" />, title: "Secure Cloud", desc: "Military-grade encryption for your peace of mind." }
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
      {/* Left Side: Immersive Visuals */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <img 
          src={authBg} 
          alt="Medical Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-medical-900/40 to-slate-900/80" />
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-6">
              <Cloud size={16} className="text-medical-400" />
              <span>Next Generation Health Vault</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              Your Health, <br /> 
              <span className="text-medical-400">Securely Synced.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              MediVault uses military-grade encryption to ensure your medical history remains private, even when synced to the cloud.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <div className="w-12 h-12 bg-medical-500/20 rounded-xl flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-col relative justify-center">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-medical-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-medical-200 rotate-3">
                <Cloud size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Your Cloud Vault'}
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                {isLogin ? 'Sync your health records across devices' : 'Start your secure health journey today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-medical-500 focus:bg-white outline-none transition-all text-slate-800 font-medium"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-medical-500 focus:bg-white outline-none transition-all text-slate-800 font-medium"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-medical-600 text-white rounded-2xl font-black text-lg hover:bg-medical-700 hover:shadow-2xl hover:shadow-medical-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 font-bold">
                {isLogin ? "New to MediVault Sync?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-medical-600 hover:text-medical-700 transition-colors"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>

        <div className="p-8 text-center bg-slate-50/50 mt-auto border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
            End-to-End Encrypted • HIPAA Compliant Approach • 256-bit AES
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
