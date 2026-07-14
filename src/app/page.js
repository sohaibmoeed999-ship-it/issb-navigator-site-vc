'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../components/LanguageContext';
import { authService, databaseService } from '../lib/supabase';
import { Award, Compass, BookOpen, ShieldAlert, Target, Heart, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const motivationalQuotes = [
  "Character is the spine of leadership. Protect it at all costs.",
  "I will find a way or make one. — Motto of soldiers.",
  "It is not the size of the man in the fight, it is the size of the fight in the man.",
  "Valor is stability, not of legs and arms, but of courage and the soul.",
  "The more you sweat in peace, the less you bleed in war.",
  "Discipline is the bridge between goals and accomplishment."
];

export default function Home() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [activeQuote, setActiveQuote] = useState(0);
  
  // Daily Question state
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Check session
    authService.getCurrentUser().then(setUser);
    
    // Cycle quotes
    const quoteInterval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 6000);

    // Fetch random daily question
    databaseService.getQuestions().then(qs => {
      if (qs && qs.length > 0) {
        const randIndex = Math.floor(Math.random() * qs.length);
        setDailyQuestion(qs[randIndex]);
      }
    });

    return () => {
      clearInterval(quoteInterval);
    };
  }, []);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer || !dailyQuestion) return;
    
    const correct = selectedAnswer === dailyQuestion.correct_answer;
    setIsCorrect(correct);
    setSubmittedAnswer(true);
  };

  const featureCards = [
    {
      icon: <Compass className="w-8 h-8 text-gold" />,
      title: lang === 'en' ? 'Intelligence Tests' : 'مشقی ذہانت کے امتحانات',
      desc: lang === 'en' ? 'Verbal (analogies, relations) and Non-Verbal tests using responsive pattern geometry.' : 'زبانی اور تصویری ذہانت کے ٹیسٹ، پزل اور منطقی مشقیں جن میں تصویری خاکے شامل ہیں۔',
      link: '/tests'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gold" />,
      title: lang === 'en' ? 'Academic Quiz Module' : 'تعلیمی جنرل نالج کوئز',
      desc: lang === 'en' ? 'Timed quizzes on Pakistan Studies, Islamiat, Current Affairs, World GK & Military knowledge.' : 'پاکستان اسٹڈیز، اسلامیات، موجودہ ملکی حالات، اور فوجی معلومات پر مشتمل ٹائمر کوئز۔',
      link: '/tests'
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-gold" />,
      title: lang === 'en' ? 'Psychological Tests' : 'نفسیاتی تحریری ٹیسٹ',
      desc: lang === 'en' ? 'Timed Word Association Test (WAT), Sentence Completion, and TAT picture story builder.' : 'ورڈ ایسوسی ایشن ٹیسٹ (WAT)، جملے مکمل کرنا، اور تصویری کہانی لکھنے کی تحریری مشقیں۔',
      link: '/psychological'
    },
    {
      icon: <Target className="w-8 h-8 text-gold" />,
      title: lang === 'en' ? 'Interview Prep Simulator' : 'انٹرویو سمولیٹر گائیڈ',
      desc: lang === 'en' ? 'Sample answers, common mistakes, and feedback tracker for Deputy President interview.' : 'اہم انٹرویو سوالات، نمونہ جوابات، اور ڈپٹی پریزیڈنٹ انٹرویو کی مؤثر ترین تجاویز۔',
      link: '/interview'
    },
    {
      icon: <Heart className="w-8 h-8 text-gold" />,
      title: lang === 'en' ? 'Physical Fitness Planner' : 'جسمانی تندرستی پلان',
      desc: lang === 'en' ? 'Requirements, running drills, workout plan, and calorie target checklists for obstacles.' : 'فزیکل ٹیسٹ کے معیار، روزانہ ورزش کا شیڈول، اور دوڑنے کی رفتار بڑھانے کا پلان۔',
      link: '/physical'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-start">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-olive-primary/10 rounded-full blur-[120px] ambient-glow pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px] ambient-glow pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 w-full flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-primary/30 border border-gold/20 text-xs font-semibold text-gold tracking-wider uppercase mb-6 animate-pulse">
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'OFFICER SELECTION GUIDE' : 'فوجی افسران کے انتخاب کی گائیڈ'}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          {lang === 'en' ? 'Steer Your Path to' : 'اپنا راستہ منتخب کریں'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-amber-500 font-black">
            {lang === 'en' ? 'Commission' : 'آرمی کمیشن'}
          </span>
        </h1>
        
        <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
          {t('heroSubtitle')}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href={user ? "/dashboard" : "/register"}
            className="px-8 py-4 bg-gradient-to-r from-gold to-[#bfa026] hover:from-gold-hover hover:to-gold text-black font-extrabold rounded-md shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 text-base tracking-wide"
          >
            <span>{t('startPreparing')}</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </Link>
          <Link
            href="/guide"
            className="px-8 py-4 bg-olive-primary/20 hover:bg-olive-primary/40 border border-gold/30 hover:border-gold/60 text-white font-bold rounded-md transition-all flex items-center gap-2"
          >
            {lang === 'en' ? 'Learn Selection Procedure' : 'طریقہ کار سمجھیے'}
          </Link>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="w-full bg-black/40 border-y border-gold/10 py-3.5 px-4 overflow-hidden relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 text-center">
          <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 border border-gold/30 rounded text-gold">
            {t('quotesHeader')}
          </span>
          <span className="text-sm font-medium italic text-gray-200 transition-all duration-500 animate-slide-in">
            " {motivationalQuotes[activeQuote]} "
          </span>
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-wider text-white">
            {lang === 'en' ? 'Preparation Modules' : 'تیاری کے شعبہ جات'}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mt-3 rounded-full"></div>
          <p className="text-gray-400 text-sm mt-3">
            {lang === 'en' ? 'Step-by-step training for every evaluation checkpoint at the ISSB.' : 'آئی ایس ایس بی میں ہونے والے تمام امتحانات کی مکمل اور منظم گائیڈ۔'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <Link
              key={i}
              href={user ? card.link : "/register"}
              className="glass-panel gold-glow-hover p-6 rounded-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/25 group-hover:bg-olive-primary/50 group-hover:border-gold/50 transition-all mb-5">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-gold transition-colors">
                  {card.title}
                </h3>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-gold opacity-80 group-hover:opacity-100 transition-all">
                <span>{lang === 'en' ? 'Start Training' : 'مشق شروع کریں'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Practice Question Widget */}
      <section className="max-w-4xl mx-auto px-6 pb-20 w-full relative z-10">
        <div className="glass-panel-gold rounded-2xl p-6 md:p-8 border border-gold/45 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
          
          <div className="flex items-center gap-2 mb-4 text-gold">
            <Target className="w-5 h-5" />
            <span className="text-xs uppercase font-mono tracking-widest font-bold">
              {lang === 'en' ? 'Question of the Day' : 'آج کا اہم سوال'}
            </span>
          </div>

          {dailyQuestion ? (
            <div>
              <p className="text-white text-lg font-semibold mb-6">
                {dailyQuestion.question}
              </p>
              
              <form onSubmit={handleAnswerSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyQuestion.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-lg border text-sm font-medium transition-all cursor-pointer select-none ${
                        selectedAnswer === opt
                          ? 'bg-olive-primary/50 border-gold text-gold font-bold shadow-md'
                          : 'bg-black/20 border-gold/15 text-gray-300 hover:bg-olive-primary/10 hover:border-gold/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="daily-q"
                        value={opt}
                        checked={selectedAnswer === opt}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={submittedAnswer}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAnswer === opt ? 'border-gold bg-gold' : 'border-gray-500'}`}>
                        {selectedAnswer === opt && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {!submittedAnswer ? (
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={!selectedAnswer}
                      className="px-6 py-2.5 bg-gold hover:bg-gold-hover disabled:bg-gold/40 disabled:text-black/50 text-black font-extrabold text-xs rounded transition-all cursor-pointer active:scale-95"
                    >
                      {t('submit')}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 rounded-lg bg-olive-primary/20 border border-gold/20 animate-slide-in">
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-sm text-white">
                          {isCorrect 
                            ? (lang === 'en' ? 'Excellent! Your Answer is Correct.' : 'شاباش! آپ کا جواب بالکل درست ہے۔') 
                            : (lang === 'en' ? `Incorrect. The correct answer was "${dailyQuestion.correct_answer}".` : `غلط جواب۔ درست جواب "${dailyQuestion.correct_answer}" تھا۔`)
                          }
                        </p>
                        <p className="text-gray-400 text-xs mt-1.5 font-medium leading-relaxed">
                          <strong className="text-gold font-mono">{t('explanation')}:</strong> {dailyQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
