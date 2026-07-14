'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { authService } from '../lib/supabase';
import { Menu, X, Globe, User, LogOut, Shield, Award } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLanguage, t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    
    checkUser();
    
    // Check session on route change/render
    const interval = setInterval(checkUser, 2000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), authRequired: true },
    { href: '/guide', label: t('about'), authRequired: false },
    { href: '/tests', label: t('tests'), authRequired: true },
    { href: '/psychological', label: t('psych'), authRequired: true },
    { href: '/interview', label: t('interview'), authRequired: true },
    { href: '/physical', label: t('physical'), authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-[rgba(212,175,55,0.15)] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-olive-primary to-olive-light border border-gold flex items-center justify-center font-bold text-gold text-lg military-crosshair shadow-inner group-hover:scale-105 transition-all">
            N
          </div>
          <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#f0d173] group-hover:text-gold-hover transition-colors">
            {t('appName')}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-md hover:bg-olive-primary/40 hover:text-gold ${
                  isActive 
                    ? 'text-gold bg-olive-primary/50 border-b-2 border-gold font-bold shadow-sm' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Admin Panel Access Link */}
          {user && user.role === 'admin' && (
            <Link
              href="/admin"
              className={`px-4 py-2 text-sm font-bold tracking-wide transition-all rounded-md flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'text-red-400 bg-red-950/40 border-b-2 border-red-500 shadow-sm'
                  : 'text-red-300 hover:text-red-400 hover:bg-red-950/20'
              }`}
            >
              <Shield className="w-4 h-4 text-red-400" />
              {t('admin')}
            </Link>
          )}
        </div>

        {/* Global Controls: Language, Profile, Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md hover:bg-olive-primary/40 border border-transparent hover:border-gold/30 text-gray-300 hover:text-gold flex items-center gap-1.5 transition-all text-xs font-semibold"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 border-l border-gold/20 pl-3">
              {/* Profile Card Summary */}
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-gray-100">{user.name}</span>
                <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
                  {user.role === 'admin' ? 'Officer / Admin' : 'Candidate'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-md bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 hover:border-red-600/40 text-red-400 hover:text-red-200 transition-all cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-gold/20 pl-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black rounded-md transition-all shadow-md active:scale-95"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls & toggle button */}
        <div className="flex items-center lg:hidden gap-2">
          {/* Quick Language Toggle Mobile */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md hover:bg-olive-primary/40 text-gray-300 hover:text-gold transition-colors"
          >
            <Globe className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-gold hover:bg-olive-primary/30 transition-all border border-transparent hover:border-gold/20"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Menu Overlay) */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-panel border-b border-[rgba(212,175,55,0.2)] py-4 px-6 flex flex-col gap-3 shadow-2xl animate-slide-in">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-gold bg-olive-primary/50 border-l-4 border-gold pl-3' 
                    : 'text-gray-300 hover:bg-olive-primary/20 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Admin Mobile Link */}
          {user && user.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                pathname.startsWith('/admin')
                  ? 'text-red-400 bg-red-950/40 border-l-4 border-red-500 pl-3'
                  : 'text-red-300 hover:bg-red-950/20'
              }`}
            >
              <Shield className="w-4.5 h-4.5 text-red-400" />
              {t('admin')}
            </Link>
          )}

          <hr className="border-gold/15 my-1" />

          {/* Mobile Profile / Auth Section */}
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="px-4 py-2 bg-olive-primary/20 rounded-md border border-gold/10">
                <p className="text-[10px] text-gold uppercase tracking-wider font-mono">Candidate</p>
                <p className="text-sm font-bold text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{user.cnic}</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-md bg-red-950/40 hover:bg-red-900/50 border border-red-900/30 text-red-400 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-gray-300 hover:text-white bg-olive-primary/20 rounded-md border border-gold/10 hover:border-gold/30 transition-all"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold bg-gradient-to-r from-gold to-[#c59f27] text-black rounded-md shadow-md transition-all active:scale-95"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
