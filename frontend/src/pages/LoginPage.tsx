import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleQuickSelect = async (role: UserRole) => {
    setError(null);
    setIsLoading(true);
    try {
      await demoLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050D1A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
          Welcome to Meddoc Core
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to access pharmacy demand intelligence and surveillance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click SIH Demo Role Selector */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Quick Login
              </span>
              <span className="text-[10px] font-semibold text-teal-600 bg-teal-500/20 px-2 py-0.5 rounded-full">
                SIH Jury Ready
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('HEALTH_OFFICER')}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-teal-500/30 hover:border-teal-500 text-left text-xs transition-all hover:shadow-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white block">Health Officer</span>
                <span className="text-[10px] text-slate-400">Dr. Arjun (Surveillance)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('SUPPLY_CHAIN_MANAGER')}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-teal-500/30 hover:border-teal-500 text-left text-xs transition-all hover:shadow-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white block">Supply Chain</span>
                <span className="text-[10px] text-slate-400">Rajesh Kumar (TNMSC)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('PHARMACY_MANAGER')}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-teal-500/30 hover:border-teal-500 text-left text-xs transition-all hover:shadow-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white block">Pharmacy Manager</span>
                <span className="text-[10px] text-slate-400">Priya Sundaram (Retail)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('ADMIN')}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0A192F] border border-teal-500/30 hover:border-teal-500 text-left text-xs transition-all hover:shadow-xs group"
              >
                <span className="font-bold text-slate-900 dark:text-white block">System Admin</span>
                <span className="text-[10px] text-slate-400">Full Access Control</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or sign in with email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun.venkatesh@meddoc.health"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400 border-slate-300 dark:border-slate-700"
                />
                <span>Remember Me</span>
              </label>

              <a href="#" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-medical-600 to-teal-500 hover:from-medical-500 hover:to-teal-400 text-white font-bold text-sm shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Create an organization account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
