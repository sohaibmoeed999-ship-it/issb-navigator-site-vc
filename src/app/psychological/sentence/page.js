'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/LanguageContext';
import { authService, databaseService } from '../../../lib/supabase';
import { sentenceStartersList } from '../../../lib/seedQuestions';
import { Award, ShieldAlert, ArrowLeft, ArrowRight, ShieldCheck, Heart, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SentenceCompletion() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [starters, setStarters] = useState([]);
  const [responses, setResponses] = useState({});
  const [testFinished, setTestFinished] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    setStarters(sentenceStartersList);
  }, [router]);

  const handleInputChange = (idx, text) => {
    setResponses({
      ...responses,
      [idx]: text
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least 5 lines completed
    const completedCount = Object.keys(responses).filter(k => responses[k].trim().length > 0).length;
    if (completedCount < 5) {
      alert(lang === 'en' ? 'Please complete at least 5 sentences before submitting.' : 'براہ کرم جمع کرنے سے پہلے کم از کم 5 جملے مکمل کریں۔');
      return;
    }

    setTestFinished(true);

    try {
      await databaseService.saveResult({
        userId: user.id,
        testName: 'Sentence Completion Test',
        category: 'psych-sentence',
        score: completedCount,
        totalQuestions: starters.length,
        suggestions: [
          lang === 'en' ? 'Aim for active, non-evasive sentences.' : 'تعمیری اور بہادری ظاہر کرنے والے جملے لکھیں۔',
          lang === 'en' ? 'Avoid writing double-clause complex defenses. Keep it simple.' : 'پیچیدہ یا مبہم جملوں سے گریز کریں۔'
        ]
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error saving sentence completions:', err);
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
      
      {!testFinished ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">{t('sentenceTitle')}</h1>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">PSYCHOLOGICAL PREPARATION</p>
          </div>

          {/* Guidelines Box */}
          <div className="glass-panel p-5 rounded-xl border border-gold/15 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'en' ? 'Constructive Examples' : 'مثبت جملے'}</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'en'
                  ? '• Starter: "When he failed, he..." -> "...analyzed his mistakes and tried again." (Resilience)\n• Starter: "A true leader always..." -> "...supports his team in hard times." (Cooperation)'
                  : '• جملہ: "جب وہ ناکام ہوا تو..." -> "...اس نے اپنی غلطیوں سے سیکھا اور دوبارہ کوشش کی۔"\n• جملہ: "سچا لیڈر ہمیشہ..." -> "...مشکل وقت میں اپنی ٹیم کا ساتھ دیتا ہے۔"'
                }
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" />
                <span>{lang === 'en' ? 'Avoid Defeatist Examples' : 'منفی جملے جن سے بچنا ہے'}</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'en'
                  ? '• Starter: "When he failed, he..." -> "...cried and gave up." (Weakness)\n• Starter: "In the face of danger he..." -> "...ran away to save his life." (Cowardice)'
                  : '• جملہ: "جب وہ ناکام ہوا تو..." -> "...وہ ہمت ہار گیا اور رونے لگا۔"\n• جملہ: "خطرے کے وقت اس نے..." -> "...اپنی جان بچا کر بھاگ گیا۔"'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {starters.map((starter, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-xl border border-gold/10 hover:border-gold/20 transition-all flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/3 text-sm font-bold text-gold tracking-wide">
                  {idx + 1}. {starter}
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Complete the sentence starter...' : 'جملہ مکمل کریں...'}
                    value={responses[idx] || ''}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md"
              >
                {t('submit')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Completion review Screen
        <div className="glass-panel p-8 rounded-xl border border-gold/20 shadow-2xl animate-slide-in space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-olive-primary/30 border border-gold/40 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-gold" />
          </div>
          
          <h1 className="text-2xl font-black text-white tracking-wide uppercase">
            {lang === 'en' ? 'Sentence Completion Done' : 'مشق مکمل ہو گئی'}
          </h1>
          
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Your completed sentence registry has been saved to your dossier. Here is what you wrote:'
              : 'جملے مکمل کرنے کا ریکارڈ محفوظ کر لیا گیا ہے۔ آپ کے تحریر کردہ جملے مندرجہ ذیل ہیں:'
            }
          </p>

          <div className="max-w-xl mx-auto text-left border border-gold/10 rounded-lg overflow-hidden divide-y divide-gold/5 max-h-80 overflow-y-auto pr-1">
            {starters.map((starter, idx) => (
              <div key={idx} className="p-3.5 bg-black/25 flex flex-col gap-1 text-xs">
                <span className="font-bold text-gold">{idx + 1}. {starter}</span>
                <span className="text-gray-200 italic ml-4">
                  {responses[idx] ? `...${responses[idx]}` : <span className="text-red-400">[ Left Unanswered ]</span>}
                </span>
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
