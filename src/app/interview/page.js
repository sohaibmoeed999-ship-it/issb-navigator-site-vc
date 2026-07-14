'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService, databaseService } from '../../lib/supabase';
import { interviewQuestionsList } from '../../lib/seedQuestions';
import { ShieldAlert, CheckCircle2, Award, UserCheck, MessageSquare, ChevronLeft, ChevronRight, HelpCircle, Eye, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InterviewPrep() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Category: 'personal', 'academic', 'army'
  const [activeCategory, setActiveCategory] = useState('personal');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Custom Draft states
  const [drafts, setDrafts] = useState({});
  const [savedStatus, setSavedStatus] = useState(false);

  // Reveal switches
  const [showSample, setShowSample] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    // Load saved drafts from LocalStorage
    if (typeof window !== 'undefined') {
      const savedDrafts = localStorage.getItem('issb_interview_drafts');
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      }
    }
  }, [router]);

  // Filter questions by active category
  const filteredQuestions = interviewQuestionsList.filter(q => q.category === activeCategory);

  // Reset index and reveals on category switch
  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
    setShowSample(false);
    setShowMistakes(false);
    setSavedStatus(false);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowSample(false);
      setShowMistakes(false);
      setSavedStatus(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowSample(false);
      setShowMistakes(false);
      setSavedStatus(false);
    }
  };

  const handleSaveDraft = () => {
    const activeQ = filteredQuestions[currentIndex];
    const updatedDrafts = {
      ...drafts,
      [activeQ.question]: drafts[activeQ.question] || ''
    };
    
    setDrafts(updatedDrafts);
    localStorage.setItem('issb_interview_drafts', JSON.stringify(updatedDrafts));
    
    // Quick success toast simulation
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);

    // Dynamic result save to increase dashboard completed tests count
    databaseService.saveResult({
      userId: user.id,
      testName: `${activeCategory.toUpperCase()} Interview Prep`,
      category: `interview-${activeCategory}`,
      score: 1,
      totalQuestions: 1,
      suggestions: [
        lang === 'en' ? 'Review your drafted answers for clarity.' : 'اپنے تیار کردہ جوابات پر نظر ثانی کریں۔',
        lang === 'en' ? 'Practice delivering them in front of a mirror.' : 'شیشے کے سامنے بولنے کی مشق کریں۔'
      ]
    });

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeQ = filteredQuestions[currentIndex];
  const activeDraft = drafts[activeQ?.question] || '';

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide">
          {lang === 'en' ? 'Officer Interview Simulator' : 'انٹرویو سمولیٹر گائیڈ'}
        </h1>
        <div className="w-24 h-1.5 bg-gold mx-auto mt-4 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-3.5 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Draft answers, avoid common pitfalls, and study military-approved answers for your Deputy President board interview.'
            : 'ڈپٹی پریزیڈنٹ انٹرویو کی تیاری کریں۔ اہم سوالات، نمونہ جوابات اور گریز کرنے والے جملے سیکھیں۔'
          }
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gold/10 mb-8 max-w-md mx-auto w-full">
        {['personal', 'academic', 'army'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySwitch(cat)}
            className={`flex-1 py-3.5 text-xs font-bold tracking-wide uppercase transition-colors text-center ${
              activeCategory === cat 
                ? 'text-gold border-b-2 border-gold font-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat === 'personal' ? (lang === 'en' ? 'Personal' : 'شخصی') :
             cat === 'academic' ? (lang === 'en' ? 'Academic' : 'تعلیمی') :
             (lang === 'en' ? 'Military' : 'فوجی')}
          </button>
        ))}
      </div>

      {activeQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Question Screen & Simulator */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Question Card */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-gold/20 shadow-xl relative min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-mono">
                    Board Simulator Phase
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    Q: {currentIndex + 1} / {filteredQuestions.length}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-olive-primary/40 border border-gold/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-gold" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed pr-6">
                    "{activeQ.question}"
                  </h2>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gold/10">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-black/40 hover:bg-black/60 disabled:opacity-30 border border-gold/15 text-gray-300 disabled:text-gray-600 font-bold text-xs rounded transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('previous')}</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="px-4 py-2 bg-black/40 hover:bg-black/60 disabled:opacity-30 border border-gold/15 text-gray-300 disabled:text-gray-600 font-bold text-xs rounded transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('next')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Strategic Sample & Mistakes Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Answer Box */}
              <div className="glass-panel p-5 rounded-xl border border-gold/15">
                <button
                  onClick={() => setShowSample(!showSample)}
                  className="w-full flex items-center justify-between font-bold text-sm text-white"
                >
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    {lang === 'en' ? 'Strategic Sample Answer' : 'تزویراتی نمونہ جواب'}
                  </span>
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                {showSample && (
                  <p className="mt-3.5 text-xs text-gray-300 leading-relaxed bg-black/20 p-3 rounded border border-emerald-900/20 animate-slide-in">
                    {activeQ.sampleAnswer}
                  </p>
                )}
              </div>

              {/* Common Mistakes Box */}
              <div className="glass-panel p-5 rounded-xl border border-gold/15">
                <button
                  onClick={() => setShowMistakes(!showMistakes)}
                  className="w-full flex items-center justify-between font-bold text-sm text-white"
                >
                  <span className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert className="w-4.5 h-4.5" />
                    {lang === 'en' ? 'Common Mistakes' : 'عام غلطیاں جن سے بچیں'}
                  </span>
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                {showMistakes && (
                  <p className="mt-3.5 text-xs text-gray-300 leading-relaxed bg-black/20 p-3 rounded border border-rose-900/20 animate-slide-in">
                    {activeQ.mistakes}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Draft response box */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/20 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gold/10 pb-3">
              <UserCheck className="w-5 h-5 text-gold" />
              <span>{lang === 'en' ? 'Draft Your Answer' : 'اپنا جواب تحریر کریں'}</span>
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'en'
                ? 'Type and save your response below. Reviewing and writing your thoughts builds immediate confidence during the actual selection panel.'
                : 'ذیل میں اپنا جواب ٹائپ کر کے محفوظ کریں۔ تحریر کرنے سے انٹرویو کے وقت اعتماد بڑھتا ہے۔'
              }
            </p>

            <textarea
              value={activeDraft}
              onChange={(e) => {
                const updated = { ...drafts, [activeQ.question]: e.target.value };
                setDrafts(updated);
              }}
              placeholder={lang === 'en' ? 'Type your draft response here...' : 'یہاں اپنا جواب ٹائپ کریں...'}
              className="w-full h-48 px-3.5 py-3 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all leading-relaxed"
            />

            <button
              onClick={handleSaveDraft}
              className="w-full py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded tracking-wider uppercase transition-all active:scale-95 shadow-md cursor-pointer"
            >
              {lang === 'en' ? 'Save Response Draft' : 'جواب محفوظ کریں'}
            </button>

            {savedStatus && (
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/40 text-center text-xs font-bold text-emerald-400 animate-pulse">
                {lang === 'en' ? 'Dossier Draft Saved Successfully!' : 'جواب کامیابی سے محفوظ کر لیا گیا!'}
              </div>
            )}
          </div>

        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-12">No questions available in this category.</p>
      )}

    </div>
  );
}
