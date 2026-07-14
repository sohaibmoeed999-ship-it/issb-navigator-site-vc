'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { authService, databaseService } from '../../../lib/supabase';
import { Clock, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

// Non-Verbal SVG Renderer component
function NonVerbalVisuals({ qId }) {
  if (qId === 'nv-1') {
    // Square with increasing circles
    return (
      <div className="flex justify-center gap-4 py-4 bg-black/25 rounded-lg border border-gold/10 my-4">
        {[1, 2, 3, '?'].map((num, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 border border-gold/40 bg-olive-primary/10 rounded flex flex-wrap p-2 items-center justify-center relative">
              {num === '?' ? (
                <span className="text-xl font-bold text-gold">?</span>
              ) : (
                Array.from({ length: num }).map((_, cIdx) => (
                  <div key={cIdx} className="w-3.5 h-3.5 rounded-full bg-gold m-0.5" />
                ))
              )}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Box {i + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  if (qId === 'nv-2') {
    // Rotating lines: 0deg, 45deg, 90deg, ?
    return (
      <div className="flex justify-center gap-4 py-4 bg-black/25 rounded-lg border border-gold/10 my-4">
        {[0, 45, 90, '?'].map((angle, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 border border-gold/40 bg-olive-primary/10 rounded flex items-center justify-center relative">
              {angle === '?' ? (
                <span className="text-xl font-bold text-gold">?</span>
              ) : (
                <svg className="w-12 h-12">
                  <line
                    x1="24"
                    y1="24"
                    x2="24"
                    y2="4"
                    stroke="#d4af37"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${angle} 24 24)`}
                  />
                  <circle cx="24" cy="24" r="3" fill="#ffffff" />
                </svg>
              )}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Box {i + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  if (qId === 'nv-3') {
    // Shade quadrants: 1 shaded, 2 shaded, 3 shaded, ?
    return (
      <div className="flex justify-center gap-4 py-4 bg-black/25 rounded-lg border border-gold/10 my-4">
        {[1, 2, 3, '?'].map((shadedCount, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 border border-gold/40 bg-olive-primary/10 rounded flex items-center justify-center relative">
              {shadedCount === '?' ? (
                <span className="text-xl font-bold text-gold">?</span>
              ) : (
                <div className="w-10 h-10 rounded-full border border-gold/60 grid grid-cols-2 overflow-hidden">
                  <div className={`border-r border-b border-gold/40 ${shadedCount >= 1 ? 'bg-gold/80' : ''}`} />
                  <div className={`border-b border-gold/40 ${shadedCount >= 2 ? 'bg-gold/80' : ''}`} />
                  <div className={`border-r border-gold/40 ${shadedCount >= 3 ? 'bg-gold/80' : ''}`} />
                  <div className="" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Box {i + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Inner Quiz Player logic
function QuizPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();
  
  const category = searchParams.get('category') || 'verbal-analogies';
  
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins (300s)
  const [testFinished, setTestFinished] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);

  useEffect(() => {
    // Verify user session
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
    });

    // Load category questions
    databaseService.getQuestions(category).then(qs => {
      if (qs && qs.length > 0) {
        setQuestions(qs);
        // Time limit: let us set it based on questions count * 35s
        setTimeLeft(qs.length * 35);
      } else {
        // Fallback dummy questions if none seeded
        const fallbackQs = [
          {
            id: 'fallback-1',
            category: category,
            question: 'Sample Practice Question: Which of the following is associated with military leadership?',
            options: ['Indecisiveness', 'Responsibility', 'Procrastination', 'Apathy'],
            correct_answer: 'Responsibility',
            explanation: 'Responsibility is a key officer-like quality assessed in ISSB.'
          }
        ];
        setQuestions(fallbackQs);
        setTimeLeft(45);
      }
      setLoading(false);
    });
  }, [category, router]);

  // Countdown clock effect
  useEffect(() => {
    if (loading || testFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest(true); // Auto-finish when timer hits zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, testFinished, timeLeft]);

  const handleOptionSelect = (option) => {
    if (testFinished) return;
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: option
    });
  };

  const handleFinishTest = async (autoSubmit = false) => {
    if (testFinished) return;
    setTestFinished(true);

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    
    // Generate suggestions based on scores
    const finalSuggestions = [];
    if (percentage < 55) {
      finalSuggestions.push(lang === 'en' ? 'Improve reasoning speed' : 'سوچنے اور سمجھنے کی رفتار تیز کریں');
      finalSuggestions.push(lang === 'en' ? `Practice more questions in ${category}` : `${category} کے سوالات کی مزید مشق کریں`);
    } else if (percentage < 75) {
      finalSuggestions.push(lang === 'en' ? 'Work on time management' : 'ٹائم مینجمنٹ پر توجہ دیں');
      finalSuggestions.push(lang === 'en' ? 'Review incorrect explanations' : 'غلط جوابات کی وضاحت کا مطالعہ کریں');
    } else {
      finalSuggestions.push(lang === 'en' ? 'Excellent score. Keep practicing to maintain rhythm.' : 'شاندار سکور۔ تسلسل برقرار رکھنے کے لیے روزانہ ٹیسٹ دیں');
    }

    if (timeLeft < 10) {
      finalSuggestions.push(lang === 'en' ? 'Work on solving speed' : 'سوالات حل کرنے کی رفتار بڑھائیں');
    }

    const testTitle = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Practice';

    // Save to Database / LocalStorage
    try {
      const savedRes = await databaseService.saveResult({
        userId: user.id,
        testName: testTitle,
        category,
        score: correctCount,
        totalQuestions: questions.length,
        suggestions: finalSuggestions
      });

      setScoreReport({
        score: correctCount,
        total: questions.length,
        percentage,
        suggestions: finalSuggestions,
        autoSubmit
      });

      // Celebration confetti for passing score
      if (percentage >= 75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to save score:', err);
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm font-mono">LOADING ASSESSMENTS...</span>
        </div>
      </div>
    );
  }

  const activeQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Test Running layout */}
      {!testFinished ? (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-gold/15">
            <div>
              <span className="text-[10px] text-gold uppercase tracking-widest font-mono">Simulated Exam Mode</span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                {category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h2>
            </div>
            
            {/* Clock Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm font-bold ${
              timeLeft < 30 ? 'bg-red-950/20 border-red-500 text-red-400 animate-pulse' : 'border-gold/25 text-gold'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-gold/15 relative">
            <span className="absolute top-4 right-4 text-xs font-mono text-gray-500">
              Q: {currentIndex + 1} / {questions.length}
            </span>

            {/* Question Text */}
            <p className="text-white text-lg font-bold pr-16 leading-relaxed mb-6">
              {activeQ.question}
            </p>

            {/* Render custom Non-Verbal graphics if applicable */}
            <NonVerbalVisuals qId={activeQ.id} />

            {/* Options list */}
            <div className="space-y-3.5 mt-6">
              {activeQ.options.map((opt, idx) => {
                const isSelected = answers[activeQ.id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-olive-primary/50 border-gold text-gold font-bold shadow-md'
                        : 'bg-black/25 border-gold/15 text-gray-300 hover:bg-olive-primary/10 hover:border-gold/30'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-gold bg-gold' : 'border-gray-500'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 bg-black/40 hover:bg-black/60 disabled:opacity-30 border border-gold/15 hover:border-gold/30 text-gray-300 disabled:text-gray-600 font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('previous')}</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2.5 bg-black/40 hover:bg-black/60 border border-gold/15 hover:border-gold/30 text-gray-300 font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleFinishTest()}
                className="px-6 py-2.5 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md"
              >
                {t('finish')}
              </button>
            )}
          </div>
        </div>
      ) : (
        // Test Result Card Overlay
        <div className="glass-panel p-8 rounded-2xl border border-gold/30 shadow-2xl animate-slide-in space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-olive-primary/30 border border-gold/40 flex items-center justify-center mx-auto mb-2 float-animation">
            <ShieldCheck className="w-9 h-9 text-gold" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide uppercase">
            {t('testReport')}
          </h1>

          {scoreReport?.autoSubmit && (
            <p className="text-red-400 text-xs font-mono animate-pulse">
              [ TIME EXPIRED - AUTO SUBMITTED ]
            </p>
          )}

          {/* Giant Score Circle */}
          <div className="relative w-36 h-36 mx-auto my-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-olive-primary"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-gold"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - (scoreReport?.percentage || 0) / 100)}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white font-mono">{scoreReport?.score} / {scoreReport?.total}</span>
              <span className="text-[10px] text-gold font-bold tracking-widest uppercase font-mono mt-0.5">{scoreReport?.percentage}% Score</span>
            </div>
          </div>

          <div className="max-w-md mx-auto text-center">
            <p className="text-gray-300 text-sm leading-relaxed">
              {lang === 'en' 
                ? 'Your scores have been locked in your profile dossier. Based on your answering speed and choices, selectors recommend:'
                : 'آپ کے مارکس کامیابی سے محفوظ کر لیے گئے ہیں۔ آپ کی کارکردگی کی بنیاد پر مندرجہ ذیل مشورہ دیا جاتا ہے:'
              }
            </p>
            
            {/* Automatic Action suggestions */}
            <div className="mt-4 space-y-2.5 text-left">
              {scoreReport?.suggestions.map((sug, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-black/30 border border-gold/10 rounded text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                  <p>{sug}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all active:scale-95 shadow-md cursor-pointer"
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function QuizPlayer() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <QuizPlayerContent />
    </Suspense>
  );
}
