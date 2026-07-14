'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService } from '../../lib/supabase';
import { BrainCircuit, BookOpen, Clock, Heart, ShieldAlert, Award, ArrowRight } from 'lucide-react';

export default function PsychList() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const psychTests = [
    {
      id: 'wat',
      title: 'Word Association Test (WAT)',
      urduTitle: 'لفظی وابستگی کا ٹیسٹ (WAT)',
      desc: 'Evaluate subconscious thoughts under pressure. Words are shown for 10 seconds each; you must write a complete sentence immediately.',
      urduDesc: 'لاشعوری سوچ کی جانچ۔ ہر لفظ صرف 10 سیکنڈ کے لیے نظر آئے گا جس پر آپ کو فوراً جملہ بنانا ہوگا۔',
      qCount: 15,
      time: '10 Seconds per word',
      link: '/psychological/wat'
    },
    {
      id: 'sentence',
      title: 'Sentence Completion Test',
      urduTitle: 'نامکمل جملے مکمل کرنا',
      desc: 'Complete Urdu and English sentence starters. Tests social behavior, alignment, optimism, and reaction to failures.',
      urduDesc: 'اردو اور انگریزی کے نامکمل جملے مکمل کریں۔ یہ آپ کی مثبت سوچ، سماجی تعلقات اور ناکامی پر ردعمل کو جانچتا ہے۔',
      qCount: 10,
      time: 'Self-Paced / Practice Mode',
      link: '/psychological/sentence'
    },
    {
      id: 'tat',
      title: 'Thematic Apperception Test (TAT)',
      urduTitle: 'تصویری کہانی لکھنے کا ٹیسٹ (TAT)',
      desc: 'Write stories based on random picture prompts. Teaches GTO/Psychologist-aligned storytelling with hurdle solving.',
      urduDesc: 'مختلف تصاویر دیکھ کر کہانیاں لکھیں۔ یہ ٹیسٹ آپ کو مثبت کردار سازی اور مسائل حل کرنے کی صلاحیت سکھاتا ہے۔',
      qCount: 3,
      time: '3.5 Minutes per story',
      link: '/psychological/tat'
    }
  ];

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide">
          {lang === 'en' ? 'Psychological Assessments' : 'نفسیاتی تحریری مشقیں'}
        </h1>
        <div className="w-20 h-1 bg-gold mx-auto mt-3 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-3.5 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Unlike intelligence tests, psychological tests analyze your personality, authenticity, and leadership instincts. Choose a simulator to start.'
            : 'ذہانت کے برعکس، نفسیاتی ٹیسٹ آپ کی شخصیت، دیانت اور قائدانہ صلاحیتوں کا جائزہ لیتے ہیں۔ مشق کے لیے ٹیسٹ منتخب کریں۔'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {psychTests.map((test) => (
          <div key={test.id} className="glass-panel p-6 rounded-xl border border-gold/15 flex flex-col justify-between hover:border-gold/30 hover:-translate-y-0.5 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-lg bg-olive-primary/30 flex items-center justify-center border border-gold/25 group-hover:bg-olive-primary/50 group-hover:border-gold/50 transition-all mb-5">
                <BrainCircuit className="w-6 h-6 text-gold" />
              </div>
              
              <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-gold transition-colors">
                {lang === 'en' ? test.title : test.urduTitle}
              </h3>
              
              <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                {lang === 'en' ? test.desc : test.urduDesc}
              </p>

              <div className="mt-4 flex flex-col gap-1.5 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  {test.qCount} Exercises
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  {test.time}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold/5 flex justify-end">
              <Link
                href={test.link}
                className="px-5 py-2.5 bg-gradient-to-r from-gold to-[#c59f27] hover:from-gold-hover hover:to-gold text-black text-xs font-extrabold rounded tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow"
              >
                <span>{lang === 'en' ? 'Start Simulator' : 'ٹیسٹ شروع کریں'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
