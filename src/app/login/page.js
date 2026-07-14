'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService } from '../../lib/supabase';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [identifier, setIdentifier] = useState(''); // Email or CNIC
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier || !password) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'براہ کرم تمام خانے پُر کریں۔');
      return;
    }

    setLoading(true);
    try {
      await authService.signIn(identifier, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 relative">
      {/* Background glow */}
      <div className="absolute w-80 h-80 bg-olive-primary/10 rounded-full blur-[100px] ambient-glow"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-xl border border-gold/20 shadow-2xl relative z-10 animate-slide-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-olive-primary/30 border border-gold/30 flex items-center justify-center mx-auto mb-4 float-animation">
            <Shield className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            {t('loginTitle')}
          </h2>
          <p className="text-gray-400 text-xs mt-2">
            {lang === 'en' ? 'Authenticate your profile to access tests' : 'ٹیسٹ اور ڈیش بورڈ تک رسائی کے لیے لاگ ان کریں'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-md bg-red-950/20 border border-red-900/30 flex items-center gap-2.5 text-xs text-red-400 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {lang === 'en' ? 'Email Address or CNIC Number' : 'ای میل پتہ یا شناختی کارڈ نمبر'}
            </label>
            <input
              type="text"
              placeholder={lang === 'en' ? 'candidate@example.com or 11111-1111111-1' : 'ای میل یا 1-1111111-11111'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-sm rounded-md tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>{lang === 'en' ? 'Verifying...' : 'تصدیق ہو رہی ہے...'}</span>
              </span>
            ) : (
              t('login')
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gold/10 pt-6">
          <Link
            href="/register"
            className="text-xs font-bold text-gold hover:text-gold-hover transition-colors"
          >
            {t('noAccount')}
          </Link>
        </div>

      </div>
    </div>
  );
}
