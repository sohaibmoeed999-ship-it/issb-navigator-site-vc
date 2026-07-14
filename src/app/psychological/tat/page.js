'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { authService, databaseService } from '../../../lib/supabase';
import { tatPicturesList } from '../../../lib/seedQuestions';
import { Clock, Image as ImageIcon, ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// Dynamic SVG Pictures for TAT Prompts
function TATPicturePrompt({ type }) {
  if (type === 'teamwork') {
    // 3 figures bridging a gap with wooden planks
    return (
      <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto bg-[#0a1109] rounded-lg border border-gold/25 p-2 shadow-inner">
        {/* Background Sky */}
        <rect width="400" height="240" fill="#0d1b0d" />
        <circle cx="200" cy="-20" r="150" fill="rgba(212,175,55,0.05)" />
        
        {/* Mountains / Ravine */}
        <path d="M 0,240 L 120,160 L 120,240 Z" fill="#1b2e1a" />
        <path d="M 280,240 L 280,160 L 400,240 Z" fill="#1b2e1a" />
        <rect x="120" y="220" width="160" height="20" fill="#060905" /> {/* Water/ditch bottom */}
        
        {/* Wooden Bridge Planks */}
        <rect x="110" y="152" width="180" height="8" rx="2" fill="#8b5a2b" stroke="#d4af37" strokeWidth="1" />
        
        {/* Figures (Candidates in olive uniforms) */}
        {/* Figure 1 (Holding plank on Left) */}
        <circle cx="80" cy="130" r="8" fill="#d4af37" />
        <path d="M 80,138 L 80,152 L 100,154" stroke="#34632f" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="152" x2="70" y2="160" stroke="#1b2e1a" strokeWidth="5" />
        
        {/* Figure 2 (Crawling / Crossing in middle) */}
        <circle cx="180" cy="138" r="8" fill="#d4af37" />
        <path d="M 172,142 L 200,146 L 210,152" stroke="#34632f" strokeWidth="6" strokeLinecap="round" fill="none" />
        
        {/* Figure 3 (Supporting on Right) */}
        <circle cx="310" cy="130" r="8" fill="#d4af37" />
        <path d="M 310,138 L 310,154 L 290,154" stroke="#34632f" strokeWidth="6" strokeLinecap="round" />
        <line x1="310" y1="154" x2="320" y2="160" stroke="#1b2e1a" strokeWidth="5" />
        
        {/* Details */}
        <text x="200" y="30" fill="rgba(212,175,55,0.3)" fontSize="10" fontFamily="monospace" textAnchor="middle">
          SCENE 01: TASK IN Ravine
        </text>
      </svg>
    );
  }

  if (type === 'hurdle') {
    // Figure standing on mountain top under sunrise
    return (
      <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto bg-[#0a1109] rounded-lg border border-gold/25 p-2 shadow-inner">
        <rect width="400" height="240" fill="#0e171b" />
        
        {/* Sunrise Glow */}
        <circle cx="200" cy="240" r="140" fill="rgba(212,175,55,0.15)" />
        <path d="M 120,240 Q 200,100 280,240 Z" fill="rgba(212,175,55,0.1)" />
        
        {/* Mountain Cliffs */}
        <path d="M 0,240 L 150,110 L 220,240 Z" fill="#142226" />
        <path d="M 180,240 L 300,90 L 400,240 Z" fill="#1b292e" />
        
        {/* Figure standing on Peak */}
        <circle cx="300" cy="74" r="6" fill="#d4af37" />
        <line x1="300" y1="80" x2="300" y2="92" stroke="#d4af37" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="300" y1="92" x2="295" y2="102" stroke="#d4af37" strokeWidth="3" />
        <line x1="300" y1="92" x2="305" y2="102" stroke="#d4af37" strokeWidth="3" />
        {/* Staff/Pole in hand */}
        <line x1="294" y1="70" x2="294" y2="98" stroke="#ffffff" strokeWidth="1.5" />
        
        <text x="200" y="30" fill="rgba(212,175,55,0.3)" fontSize="10" fontFamily="monospace" textAnchor="middle">
          SCENE 02: SUMMIT STAMINA
        </text>
      </svg>
    );
  }

  if (type === 'responsibility') {
    // Rescue worker pulling a child out of waters
    return (
      <svg viewBox="0 0 400 240" className="w-full max-w-md mx-auto bg-[#0a1109] rounded-lg border border-gold/25 p-2 shadow-inner">
        <rect width="400" height="240" fill="#0d141f" />
        
        {/* Rain clouds */}
        <path d="M 30,10 C 70,-10 110,10 140,0 C 170,10 220,-10 260,10 C 310,-10 350,10 390,0" stroke="#1d2736" strokeWidth="20" strokeLinecap="round" fill="none" />
        
        {/* Waves */}
        <path d="M 0,220 Q 50,210 100,220 T 200,220 T 300,220 T 400,220 L 400,240 L 0,240 Z" fill="#0b2447" />
        <path d="M 0,195 Q 50,185 100,195 T 200,195 T 300,195 T 400,195 L 400,240 L 0,240 Z" fill="rgba(11,36,71,0.7)" />

        {/* Rescue boat hull or ledge */}
        <path d="M 0,160 L 160,165 L 140,240 L 0,240 Z" fill="#253237" />

        {/* Rescue Officer (Left, reaching out) */}
        <circle cx="150" cy="125" r="7" fill="#d4af37" />
        {/* Life vest */}
        <path d="M 150,132 L 150,150 L 175,162" stroke="#ff5722" strokeWidth="7.5" strokeLinecap="round" fill="none" />
        <path d="M 150,132 L 132,150" stroke="#34632f" strokeWidth="5.5" strokeLinecap="round" />

        {/* Child in waves (Right) */}
        <circle cx="210" cy="178" r="5" fill="#f5c782" />
        <path d="M 210,183 L 205,195" stroke="#1e88e5" strokeWidth="4" strokeLinecap="round" />
        {/* Reaching arm */}
        <line x1="210" y1="183" x2="182" y2="164" stroke="#f5c782" strokeWidth="2.5" strokeLinecap="round" />

        <text x="200" y="30" fill="rgba(212,175,55,0.3)" fontSize="10" fontFamily="monospace" textAnchor="middle">
          SCENE 03: EMERGENCY ENGAGEMENT
        </text>
      </svg>
    );
  }

  return null;
}

export default function TATSimulator() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Test states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStory, setActiveStory] = useState('');
  const [savedStories, setSavedStories] = useState({});
  
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  
  // Timer: 3.5 minutes (210 seconds) per story
  const [timeLeft, setTimeLeft] = useState(210);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
  }, [router]);

  // Countdown timer logic
  useEffect(() => {
    if (!testStarted || testFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextStory(true); // Auto-advance on timeout
          return 210;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testFinished, timeLeft, currentIndex]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(210);
  };

  const handleNextStory = (autoAdvance = false) => {
    const activePic = tatPicturesList[currentIndex];
    
    // Save draft story
    setSavedStories(prev => ({
      ...prev,
      [activePic.title]: activeStory.trim()
    }));

    // Clear input
    setActiveStory('');

    // Advance
    if (currentIndex < tatPicturesList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(210); // Reset timer
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setTestFinished(true);
    setTestStarted(false);

    try {
      await databaseService.saveResult({
        userId: user.id,
        testName: 'Thematic Apperception Test (TAT)',
        category: 'psych-tat',
        score: tatPicturesList.length, // Completed count
        totalQuestions: tatPicturesList.length,
        suggestions: [
          lang === 'en' ? 'Review story resolutions. They must be constructive and realistic.' : 'کہانیوں کے نتائج کا جائزہ لیں، وہ حقیقت پسندانہ اور تعمیری ہونے چاہئیں۔',
          lang === 'en' ? 'Avoid magical helper endings (e.g. winning lottery, sudden rain stopping).' : 'غیر حقیقی غیبی مدد والے اختتام لکھنے سے پرہیز کریں۔'
        ]
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error saving TAT results:', err);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activePic = tatPicturesList[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* 1. Instruction Screen */}
      {!testStarted && !testFinished && (
        <div className="glass-panel p-8 rounded-xl border border-gold/15 space-y-6 max-w-2xl mx-auto animate-slide-in">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gold mx-auto mb-3 float-animation" />
            <h1 className="text-2xl font-black text-white tracking-wide">{t('tatTitle')}</h1>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">THEMATIC APPERCEPTION TEST SIMULATION</p>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <p>
              {lang === 'en'
                ? 'In the TAT, you are shown an ambiguous picture prompt representing basic life scenes. You have exactly 30 seconds to observe it, followed by 3.5 minutes to write a story about it.'
                : 'اس ٹیسٹ (TAT) میں آپ کو ایک تصویر دکھائی جائے گی۔ آپ کو 30 سیکنڈ غور سے دیکھنا ہوگا اور پھر ساڑھے تین منٹ کے اندر ایک تعمیری کہانی لکھنی ہوگی۔'
              }
            </p>
            
            <div className="p-4 bg-olive-primary/10 border border-gold/15 rounded-lg space-y-2.5">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">How to structure your story:</h3>
              <ul className="space-y-1.5 text-xs">
                <li><strong>1. Main Character:</strong> Identify a positive hero of similar age to you.</li>
                <li><strong>2. Conflict:</strong> Explain what is happening and what led to this situation.</li>
                <li><strong>3. Action:</strong> Describe what the character and their group did to solve the problem (Focus on planning and hard work).</li>
                <li><strong>4. Resolution:</strong> End with a realistic, positive, and successful outcome.</li>
              </ul>
            </div>
            
            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
              <li>Write in English. Keep vocabulary clear and professional.</li>
              <li>Avoid writing stories depicting suicide, depression, crime, or magic.</li>
              <li>Show constructive teamwork and physical resilience.</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3.5 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-sm rounded shadow tracking-wide uppercase transition-all cursor-pointer active:scale-95"
          >
            {lang === 'en' ? 'Start Story writing' : 'کہانی لکھنا شروع کریں'}
          </button>
        </div>
      )}

      {/* 2. Active Test Simulator */}
      {testStarted && !testFinished && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
          
          {/* Left: Picture prompt and timer */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-gold/15">
              <span className="text-xs font-mono text-gray-400">
                Picture: {currentIndex + 1} / {tatPicturesList.length}
              </span>
              
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm font-bold ${
                timeLeft <= 30 ? 'bg-red-950/20 border-red-500 text-red-400 animate-pulse' : 'border-gold/25 text-gold'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Custom Vector Drawing Prompt */}
            <TATPicturePrompt type={activePic.type} />
            
            <div className="glass-panel p-4 rounded-lg border border-gold/10 text-[10px] text-gray-400 leading-relaxed">
              <p className="font-bold text-gold mb-1">SCENE FOCUS:</p>
              <p>{activePic.description}</p>
            </div>
          </div>

          {/* Right: Story Input box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-gold/15">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-2.5">
                {lang === 'en' ? `Write story for "${activePic.title}"` : `کہانی تحریر کریں`}
              </label>
              <textarea
                value={activeStory}
                onChange={(e) => setActiveStory(e.target.value)}
                placeholder={lang === 'en' ? 'Type your story here (approx 100-150 words)...' : 'یہاں اپنی کہانی تحریر کریں...'}
                className="w-full h-72 px-4 py-3 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all leading-relaxed"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => handleNextStory()}
                className="px-6 py-2.5 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all cursor-pointer shadow active:scale-95"
              >
                {currentIndex === tatPicturesList.length - 1 ? t('finish') : t('next')}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. Review Summary Screen */}
      {testFinished && (
        <div className="glass-panel p-8 rounded-xl border border-gold/15 shadow-2xl animate-slide-in space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-olive-primary/30 border border-gold/40 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              {lang === 'en' ? 'TAT Portfolio Complete' : 'ٹیسٹ مکمل ہو گیا'}
            </h1>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">Dossier Story Responses</p>
          </div>

          <div className="p-4 bg-olive-primary/10 border border-gold/10 rounded-lg text-sm text-gray-300 max-w-xl mx-auto">
            <p className="font-bold flex items-center gap-1 text-gold text-xs uppercase mb-1">
              <ShieldAlert className="w-4 h-4 text-gold" />
              <span>Assessment Advice:</span>
            </p>
            <p className="text-xs leading-relaxed text-gray-300">
              Psychologists scan these stories to evaluate your emotional stability, initiative, planning capabilities, and response to setbacks. A healthy story must show hard work leading to a positive result. Verify if your heroes worked in teams, solved the crisis themselves, and achieved success through logical actions.
            </p>
          </div>

          {/* Response List */}
          <div className="max-w-3xl mx-auto mt-6 space-y-4">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Your Stories:</h3>
            {tatPicturesList.map((pic, i) => (
              <div key={i} className="p-4 bg-black/25 border border-gold/10 rounded-lg text-xs space-y-2">
                <h4 className="font-extrabold text-gold tracking-wide">{pic.title}</h4>
                <p className="text-gray-300 italic leading-relaxed whitespace-pre-wrap">
                  {savedStories[pic.title] || <span className="text-rose-500 font-bold">[ NO RESPONSE / TIMEOUT ]</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all active:scale-95 shadow cursor-pointer"
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
