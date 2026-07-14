'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService } from '../../lib/supabase';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-format CNIC as XXXXX-XXXXXXX-X as the candidate types
  const handleCnicChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Numbers only
    let formatted = rawVal;
    
    if (rawVal.length > 5) {
      formatted = rawVal.slice(0, 5) + '-' + rawVal.slice(5);
    }
    if (rawVal.length > 12) {
      formatted = formatted.slice(0, 13) + '-' + rawVal.slice(12, 13);
    }
    
    setCnic(formatted.slice(0, 15)); // Limit to 15 chars (13 numbers + 2 hyphens)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name || !cnic || !email || !password) {
      setError(lang === 'en' ? 'Please fill in all required fields.' : 'براہ کرم تمام لازمی خانے پُر کریں۔');
      return;
    }

    if (cnic.length !== 15) {
      setError(lang === 'en' ? 'CNIC number must be exactly 15 characters (e.g., 12345-1234567-1).' : 'شناختی کارڈ نمبر کا درست فارمیٹ ہونا ضروری ہے (1-1234567-12345)');
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({ name, cnic, email, password, phone });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
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
            <UserPlus className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            {t('registerTitle')}
          </h2>
          <p className="text-gray-400 text-xs mt-2">
            {lang === 'en' ? 'Enter official details for candidate registry' : 'امیدوار لسٹ میں اندراج کے لیے آفیشل معلومات درج کریں'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-md bg-red-950/20 border border-red-900/30 flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('fullName')} *
            </label>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Muhammad Ali' : 'پورا نام درج کریں'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('cnic')} *
            </label>
            <input
              type="text"
              placeholder="37405-1234567-1"
              value={cnic}
              onChange={handleCnicChange}
              className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded-md text-sm text-white font-mono focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('email')} *
            </label>
            <input
              type="email"
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('phone')}
            </label>
            <input
              type="tel"
              placeholder="+923001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">
              {t('password')} *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-sm rounded-md tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>{lang === 'en' ? 'Registering...' : 'رجسٹریشن ہو رہی ہے...'}</span>
              </span>
            ) : (
              t('register')
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gold/10 pt-4">
          <Link
            href="/login"
            className="text-xs font-bold text-gold hover:text-gold-hover transition-colors"
          >
            {t('hasAccount')}
          </Link>
        </div>

      </div>
    </div>
  );
}
