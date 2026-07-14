'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../components/LanguageContext';
import { authService, databaseService } from '../../lib/supabase';
import { Award, Compass, BookOpen, BrainCircuit, UserCheck, ShieldCheck, Dumbbell, Calendar, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({
    completed_tests: 0,
    strengths: ['Not analyzed yet'],
    weaknesses: ['Take first test'],
    improvement_areas: ['Attempt Verbal or Academic Quizzes to receive automated advice']
  });
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        // Fetch scores/results
        const userResults = await databaseService.getResults(currentUser.id);
        setResults(userResults);

        // Fetch aggregated progress
        const userProgress = await databaseService.getProgress(currentUser.id);
        if (userProgress) {
          setProgress(userProgress);
        } else {
          // If no progress entry exists, sync it
          await databaseService.syncProgress(currentUser.id);
          const freshProgress = await databaseService.getProgress(currentUser.id);
          if (freshProgress) setProgress(freshProgress);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  // Overall readiness calculation
  // Base readiness starts at 10% for profile registration, +15% per unique category attempted, max 100%
  const uniqueCategories = new Set(results.map(r => r.category));
  const readinessPercent = Math.min(15 + uniqueCategories.size * 17 + Math.min(results.length * 3, 15), 100);

  // Trigger celebration confetti when 100% readiness is hit
  useEffect(() => {
    if (readinessPercent >= 100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#1b3d18', '#ffffff']
      });
    }
  }, [readinessPercent]);

  // Render Certificate to canvas for downloading
  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !user) return;
    const ctx = canvas.getContext('2d');
    
    // Set Dimensions (A4 Ratio)
    canvas.width = 1120;
    canvas.height = 792;

    // 1. Draw Background (Dark Forest Green Theme)
    ctx.fillStyle = '#060905';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Golden Border Lines
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#34632f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // 3. Draw Corner Accents
    ctx.fillStyle = '#d4af37';
    // Top-Left corner
    ctx.fillRect(30, 30, 40, 6);
    ctx.fillRect(30, 30, 6, 40);
    // Top-Right corner
    ctx.fillRect(canvas.width - 70, 30, 40, 6);
    ctx.fillRect(canvas.width - 36, 30, 6, 40);
    // Bottom-Left corner
    ctx.fillRect(30, canvas.height - 36, 40, 6);
    ctx.fillRect(30, canvas.height - 70, 6, 40);
    // Bottom-Right corner
    ctx.fillRect(canvas.width - 70, canvas.height - 36, 40, 6);
    ctx.fillRect(canvas.width - 36, canvas.height - 70, 6, 40);

    // 4. Header Titles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('PAKISTAN COMMISSION PREPARATION COUNCIL', canvas.width / 2, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Outfit", sans-serif';
    ctx.fillText('CERTIFICATE OF ISSB PREPARATION COMPLETION', canvas.width / 2, 175);

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 205);
    ctx.lineTo(770, 205);
    ctx.stroke();

    // 5. Body Text
    ctx.fillStyle = '#b0c4b0';
    ctx.font = 'italic 22px serif';
    ctx.fillText('This document proudly certifies that candidate', canvas.width / 2, 270);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Outfit", sans-serif';
    ctx.fillText(user.name.toUpperCase(), canvas.width / 2, 335);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`CNIC: ${user.cnic}`, canvas.width / 2, 375);

    ctx.fillStyle = '#b0c4b0';
    ctx.font = '20px "Outfit", sans-serif';
    ctx.fillText('has successfully undergone and completed all core simulated training modules on', canvas.width / 2, 435);
    ctx.fillText('the ISSB Navigator Prep platform, demonstrating standard competence in Cognitive reasoning,', canvas.width / 2, 465);
    ctx.fillText('Psychological association, Writing stamina, and Physical fitness preparation.', canvas.width / 2, 495);

    // 6. Signatures & Stamp
    // Stamp circle
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 600, 55, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('VERIFIED', canvas.width / 2, 595);
    ctx.fillText('PASS', canvas.width / 2, 615);

    // Left Signature: Director Academics
    ctx.strokeStyle = '#b0c4b0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 640);
    ctx.lineTo(370, 640);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('DIRECTOR ACADEMICS', 260, 665);
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText('ISSB Navigator Panel', 260, 685);

    // Right Signature: Chief Psychologist
    ctx.beginPath();
    ctx.moveTo(750, 640);
    ctx.lineTo(970, 640);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('CHIEF PSYCHOLOGIST', 860, 665);
    ctx.font = '12px "Outfit", sans-serif';
    ctx.fillText('Selection Board Simulator', 860, 685);

    // 7. Date
    ctx.fillStyle = '#8ea88e';
    ctx.font = '14px monospace';
    ctx.fillText(`DATE OF COMPILATION: ${new Date().toLocaleDateString()}`, canvas.width / 2, 725);

    // 8. Download Action
    const link = document.createElement('a');
    link.download = `ISSB_Preparation_Certificate_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Generate dynamic SVG path for historical score percentages
  const getSvgLinePath = () => {
    if (results.length < 2) return '';
    
    // We reverse the results so that they appear chronologically (oldest to newest)
    const sorted = [...results].reverse();
    const width = 500;
    const height = 150;
    const padding = 15;
    
    const points = sorted.map((res, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (sorted.length - 1);
      const percentage = (res.score / res.total_questions);
      const y = height - padding - percentage * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const getSvgDots = () => {
    if (results.length === 0) return [];
    const sorted = [...results].reverse();
    const width = 500;
    const height = 150;
    const padding = 15;
    
    return sorted.map((res, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (sorted.length - 1);
      const percentage = (res.score / res.total_questions);
      const y = height - padding - percentage * (height - padding * 2);
      return { x, y, score: Math.round(percentage * 100), name: res.test_name };
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm font-semibold tracking-wider">Loading Candidate Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Top Banner (Welcome & readiness percentage) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-10">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            {t('welcomeBack')}, <span className="text-gold">{user?.name}</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1.5 font-mono">
            {lang === 'en' ? 'CNIC REGISTRY:' : 'شناختی کارڈ نمبر:'} {user?.cnic} | {lang === 'en' ? 'ROLE:' : 'رول:'} {user?.role?.toUpperCase()}
          </p>
        </div>

        {/* Readiness Circular Ring Indicator */}
        <div className="glass-panel p-5 rounded-xl border border-gold/20 flex items-center gap-4">
          <div className="relative w-18 h-18 shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-olive-primary"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-gold transition-all duration-1000"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - readinessPercent / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white font-mono">
              {readinessPercent}%
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-200">{t('readinessProgress')}</h3>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">
              {readinessPercent >= 100 
                ? (lang === 'en' ? 'Fully Prepared for Selection!' : 'آئی ایس ایس بی ٹیسٹ کے لیے تیار!') 
                : (lang === 'en' ? 'Complete more tests to reach 100%' : 'تیاری مکمل کرنے کے لیے مزید ٹیسٹ دیں')}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-panel p-5 rounded-xl border border-gold/15 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/20">
            <Compass className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">{t('completedTests')}</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{results.length}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gold/15 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/20">
            <Activity className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">{lang === 'en' ? 'Avg Score Percentage' : 'اوسط کامیابی سکور'}</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">
              {results.length > 0 
                ? Math.round((results.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0) / results.length) * 100) + '%'
                : '0%'
              }
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gold/15 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/20">
            <Award className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">{lang === 'en' ? 'Rank Achievement' : 'حاصل کردہ فوجی رینک'}</p>
            <p className="text-xl font-bold text-white mt-0.5 font-sans">
              {results.length >= 8 ? 'Lieutenant' : results.length >= 4 ? 'Cadet Corporal' : 'GC Cadet'}
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gold/15 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/20">
            <Calendar className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">{lang === 'en' ? 'Last Activity' : 'آخری سرگرمی'}</p>
            <p className="text-xs font-medium text-white mt-1.5 font-mono">
              {progress?.last_active ? new Date(progress.last_active).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Graph + Recommendations) & Right (Strengths & Weaknesses + Certificate) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column (Graph and history) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Graph Card */}
          <div className="glass-panel p-6 rounded-xl border border-gold/15">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span>{lang === 'en' ? 'Performance Trend' : 'کارکردگی کا گراف'}</span>
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">
                {lang === 'en' ? 'Historical score percentages' : 'ٹیسٹ سکور فیصد'}
              </span>
            </div>

            {results.length > 0 ? (
              <div className="w-full">
                {/* SVG Graph Plot */}
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="15" x2="500" y2="15" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" />
                  <line x1="0" y1="85" x2="500" y2="85" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1" />
                  
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="500" height="135" fill="transparent" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1" />

                  {/* SVG path line */}
                  {results.length > 1 ? (
                    <path
                      d={getSvgLinePath()}
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : null}

                  {/* Node points */}
                  {getSvgDots().map((dot, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="4"
                        fill="#060905"
                        stroke="#d4af37"
                        strokeWidth="2"
                      />
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="8"
                        className="fill-gold opacity-0 hover:opacity-20 transition-all"
                      />
                      {/* Tooltip on hover */}
                      <title>{`${dot.name}: ${dot.score}%`}</title>
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-3 px-1">
                  <span>{lang === 'en' ? 'OLDEST TEST' : 'پہلا ٹیسٹ'}</span>
                  <span>{lang === 'en' ? 'CHRONOLOGICAL LOGS' : 'ٹیسٹ کی پیش رفت'}</span>
                  <span>{lang === 'en' ? 'LATEST TEST' : 'حالیہ ٹیسٹ'}</span>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-black/10 rounded-lg border border-dashed border-gold/10">
                <p className="text-gray-400 text-sm">{lang === 'en' ? 'No test performance registered yet.' : 'ابھی تک کوئی ٹیسٹ سکور درج نہیں کیا گیا ہے۔'}</p>
                <Link
                  href="/tests"
                  className="text-xs text-gold font-bold underline mt-2 hover:text-gold-hover"
                >
                  {lang === 'en' ? 'Take a practice quiz to generate analytical graph' : 'گراف بنانے کے لیے پہلا ٹیسٹ شروع کریں'}
                </Link>
              </div>
            )}
          </div>

          {/* Recommendations Area */}
          <div className="glass-panel p-6 rounded-xl border border-gold/15">
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">
              {t('improvements')}
            </h2>
            <div className="space-y-3">
              {progress?.improvement_areas?.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-olive-primary/10 border border-gold/10 rounded-lg text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2"></div>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strengths/Weaknesses & Certificate Generator */}
        <div className="space-y-8">
          
          {/* Strengths & Weaknesses Card */}
          <div className="glass-panel p-6 rounded-xl border border-gold/15">
            <h2 className="text-lg font-bold text-white tracking-wide mb-5">
              {lang === 'en' ? 'Skills Analysis' : 'امیدوار کا نفسیاتی جائزہ'}
            </h2>
            
            <div className="space-y-5">
              {/* Strengths */}
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{t('strengths')}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {progress?.strengths?.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-900/35 text-xs text-emerald-300 font-medium"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-gold/10" />

              {/* Weaknesses */}
              <div>
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{t('weaknesses')}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {progress?.weaknesses?.map((weak, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded bg-rose-950/30 border border-rose-900/35 text-xs text-rose-300 font-medium"
                    >
                      {weak}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Download Card */}
          <div className="glass-panel p-6 rounded-xl border border-gold/20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-400 to-amber-500"></div>
            
            <Award className="w-12 h-12 text-gold mx-auto mb-4 float-animation" />
            <h3 className="text-base font-extrabold text-white tracking-wide uppercase">
              {lang === 'en' ? 'ISSB Ready Certificate' : 'آئی ایس ایس بی سرٹیفکیٹ'}
            </h3>
            
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed px-2">
              {lang === 'en' 
                ? 'Generate and download your official preparation certificate once you have completed training. Required minimum 3 mock tests.'
                : 'آئی ایس ایس بی کی تیاری مکمل ہونے پر اپنا آفیشل سرٹیفکیٹ ڈاؤن لوڈ کریں۔ کم از کم 3 ٹیسٹ دینا ضروری ہیں۔'
              }
            </p>

            <button
              onClick={generateCertificate}
              disabled={results.length < 3}
              className="mt-6 w-full py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold disabled:from-gold/30 disabled:to-gold/20 text-black font-extrabold text-xs rounded-md shadow tracking-wider uppercase transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {results.length < 3 
                ? (lang === 'en' ? `Locked (${results.length}/3 tests)` : `بلاک ہے (${results.length}/3 ٹیسٹ)`) 
                : t('downloadCert')
              }
            </button>

            {/* Hidden Canvas for rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

        </div>

      </div>

      {/* Recent History Table */}
      <div className="glass-panel p-6 rounded-xl border border-gold/15">
        <h2 className="text-lg font-bold text-white tracking-wide mb-4">
          {lang === 'en' ? 'Recent Assessment Logs' : 'حالیہ ٹیسٹ لاگز'}
        </h2>
        
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase font-mono border-b border-gold/10 text-gold">
                <tr>
                  <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Test Name' : 'ٹیسٹ کا نام'}</th>
                  <th className="py-3 px-4 font-bold">{lang === 'en' ? 'Category' : 'شعبہ'}</th>
                  <th className="py-3 px-4 font-bold text-center">{lang === 'en' ? 'Result Score' : 'حاصل کردہ نمبر'}</th>
                  <th className="py-3 px-4 font-bold text-center">{lang === 'en' ? 'Percentage' : 'فیصد'}</th>
                  <th className="py-3 px-4 font-bold text-right">{lang === 'en' ? 'Date Taken' : 'تاریخ'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {results.map((res, i) => (
                  <tr key={i} className="hover:bg-olive-primary/10 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <span>{res.test_name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">{res.category}</td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">{res.score} / {res.total_questions}</td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={`px-2 py-1.5 rounded text-xs ${
                        (res.score / res.total_questions) >= 0.75 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                          : (res.score / res.total_questions) >= 0.5 
                            ? 'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                            : 'bg-rose-950/20 text-rose-400 border border-rose-900/30'
                      }`}>
                        {Math.round((res.score / res.total_questions) * 100)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-gray-500 font-mono">
                      {new Date(res.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-4 italic text-center">
            {lang === 'en' ? 'No recent assessment logs found. Start by taking tests.' : 'کوئی ٹیسٹ لاگ موجود نہیں ہے۔ مشق شروع کریں۔'}
          </p>
        )}
      </div>

    </div>
  );
}
