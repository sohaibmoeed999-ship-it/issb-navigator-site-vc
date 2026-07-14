'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { authService, databaseService } from '../../../lib/supabase';
import { watWordsList } from '../../../lib/seedQuestions';
import { Clock, Brain, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WATSimulator() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Test states
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeInput, setActiveInput] = useState('');
  const [writtenSentences, setWrittenSentences] = useState({});
  
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(10); // 10s per word

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    // Shuffle and pick 15 words
    const shuffled = [...watWordsList].sort(() => 0.5 - Math.random());
    setWordList(shuffled.slice(0, 15));
  }, [router]);

  // Timer loop for active test word
  useEffect(() => {
    if (!testStarted || testFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextWord(); // Auto advance on timeout
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testFinished, timeLeft, currentIndex]);

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(10);
  };

  const handleNextWord = () => {
    // Save current sentence
    const currentWord = wordList[currentIndex];
    setWrittenSentences(prev => ({
      ...prev,
      [currentWord]: activeInput.trim()
    }));

    // Clear input
    setActiveInput('');

    // Advance index
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(10); // Reset timer
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setTestFinished(true);
    setTestStarted(false);

    // Save psychological completion mark to DB
    try {
      await databaseService.saveResult({
        userId: user.id,
        testName: 'Word Association Test (WAT)',
        category: 'psych-wat',
        score: 15, // WAT checks completion, not binary correct/incorrect
        totalQuestions: 15,
        suggestions: [
          lang === 'en' ? 'Review your sentences. Focus on positive, action-oriented lines.' : 'اپنے جملوں پر نظر ثانی کریں۔ مثبت اور فعال جملوں پر توجہ دیں۔',
          lang === 'en' ? 'Avoid using negative terms like "cannot, failed, fear".' : 'ناامیدی ظاہر کرنے والے الفاظ سے گریز کریں۔'
        ]
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error saving WAT results:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* 1. Instruction Screen */}
      {!testStarted && !testFinished && (
        <div className="glass-panel p-8 rounded-xl border border-gold/15 space-y-6 max-w-2xl mx-auto animate-slide-in">
          <div className="text-center">
            <Brain className="w-12 h-12 text-gold mx-auto mb-3 float-animation" />
            <h1 className="text-2xl font-black text-white tracking-wide">{t('watTitle')}</h1>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">PSYCHOLOGICAL WORKSHOP</p>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <p>
              {lang === 'en'
                ? 'The WAT is one of the most critical psychological tests. You are shown a single word for exactly 10 seconds. You must quickly write the first sentence that enters your mind.'
                : 'ورڈ ایسوسی ایشن ٹیسٹ (WAT) ایک انتہائی اہم نفسیاتی ٹیسٹ ہے۔ آپ کو ہر لفظ صرف 10 سیکنڈ کے لیے دکھایا جائے گا اور آپ کو اس پر فوری جملہ بنانا ہوگا۔'
              }
            </p>
            
            <div className="p-4 bg-olive-primary/10 border border-gold/15 rounded-lg space-y-2">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Example:</h3>
              <p className="text-xs"><strong>Word:</strong> WEAPON</p>
              <p className="text-xs text-emerald-400"><strong>Constructive:</strong> Soldiers handle weapons with care. (Active, responsible)</p>
              <p className="text-xs text-rose-400"><strong>Negative:</strong> Weapons kill people. (Destructive, fear-oriented)</p>
            </div>
            
            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
              <li>Keep sentences short (3-5 words) to match the speed.</li>
              <li>Write complete sentences. Avoid simple word associations or definitions.</li>
              <li>Write clean, grammatical sentences representing hope, duty, and leadership.</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3.5 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-sm rounded shadow tracking-wide uppercase transition-all cursor-pointer active:scale-95"
          >
            {lang === 'en' ? 'Start 10s Timer' : 'ٹیسٹ شروع کریں'}
          </button>
        </div>
      )}

      {/* 2. Active Test Simulator */}
      {testStarted && !testFinished && (
        <div className="space-y-6 max-w-2xl mx-auto w-full">
          
          <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-gold/15">
            <span className="text-xs font-mono text-gray-400">
              Word: {currentIndex + 1} / {wordList.length}
            </span>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm font-bold ${
              timeLeft <= 3 ? 'bg-red-950/20 border-red-500 text-red-400 animate-pulse' : 'border-gold/25 text-gold'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Flashcard Box */}
          <div className="glass-panel p-12 rounded-2xl border border-gold/20 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Pulsing light */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none"></div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-white animate-pulse">
              {wordList[currentIndex]}
            </h1>
          </div>

          {/* Input text box */}
          <div className="space-y-3">
            <input
              type="text"
              value={activeInput}
              onChange={(e) => setActiveInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNextWord();
              }}
              placeholder={lang === 'en' ? 'Type your sentence and press Enter...' : 'جملہ لکھیں اور آگے بڑھیں...'}
              className="w-full px-4 py-3 bg-black/40 border border-gold/15 rounded-md text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-center"
              autoFocus
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleNextWord}
                className="px-5 py-2 bg-gold hover:bg-gold-hover text-black font-extrabold text-xs rounded transition-all cursor-pointer"
              >
                {currentIndex === wordList.length - 1 ? t('finish') : t('next')}
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
              {lang === 'en' ? 'WAT Practice Complete' : 'ٹیسٹ مکمل ہو گیا'}
            </h1>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">Dossier Response Sheet</p>
          </div>

          <div className="p-4 bg-olive-primary/10 border border-gold/10 rounded-lg text-sm text-gray-300 max-w-xl mx-auto">
            <p className="font-bold flex items-center gap-1 text-gold text-xs uppercase mb-1">
              <Heart className="w-4 h-4 text-gold" />
              <span>Psychological Insight:</span>
            </p>
            <p className="text-xs leading-relaxed text-gray-300">
              Your sentences display how your mind associates targets under stress. Re-read your lines. Are they showing active problem-solving (e.g. "We solve problems") rather than defensive anxiety (e.g. "He could not do it")? Aim for team dynamics, patriotism, and forward-looking determination.
            </p>
          </div>

          {/* Response Table */}
          <div className="max-w-2xl mx-auto mt-6">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Your Sentences:</h3>
            <div className="border border-gold/10 rounded-lg overflow-hidden divide-y divide-gold/5 max-h-80 overflow-y-auto pr-1">
              {wordList.map((word, i) => (
                <div key={i} className="p-3 bg-black/25 flex items-start gap-4 text-xs">
                  <span className="w-20 shrink-0 font-extrabold text-gold tracking-wider">{word}</span>
                  <span className="text-gray-200 italic">
                    {writtenSentences[word] || <span className="text-rose-500 font-bold">[ NO RESPONSE / TIMEOUT ]</span>}
                  </span>
                </div>
              ))}
            </div>
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
