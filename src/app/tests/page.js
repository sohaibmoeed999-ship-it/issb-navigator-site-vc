'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService } from '../../lib/supabase';
import { Compass, BookOpen, Clock, HelpCircle, Award, Target, HelpCircle as HelpIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TestsList() {
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

  const verbalTopics = [
    { id: 'verbal-analogies', label: 'Analogies', urduLabel: 'مماثلتیں', qCount: 10, time: 5 },
    { id: 'verbal-series', label: 'Number & Letter Series', urduLabel: 'ہندسی اور حرفی تسلسل', qCount: 10, time: 5 },
    { id: 'verbal-coding', label: 'Coding / Decoding', urduLabel: 'کوڈنگ اور ڈی کوڈنگ', qCount: 8, time: 4 },
    { id: 'verbal-relations', label: 'Blood Relations', urduLabel: 'خونی رشتے', qCount: 8, time: 4 },
    { id: 'verbal-odd', label: 'Odd One Out', urduLabel: 'مختلف لفظ تلاش کریں', qCount: 10, time: 5 },
    { id: 'verbal-vocabulary', label: 'Synonyms & Antonyms', urduLabel: 'ہم معنی اور الٹ الفاظ', qCount: 10, time: 5 }
  ];

  const nonVerbalTopics = [
    { id: 'non-verbal-pattern', label: 'Pattern Recognition', urduLabel: 'اشکال کی پہچان', qCount: 8, time: 5 },
    { id: 'non-verbal-series', label: 'Figure Series & Rotation', urduLabel: 'خاکوں کا تسلسل اور گھماؤ', qCount: 8, time: 5 },
    { id: 'non-verbal-completion', label: 'Figure Completion', urduLabel: 'نامکمل اشکال مکمل کرنا', qCount: 8, time: 5 }
  ];

  const academicTopics = [
    { id: 'academic-pakstudies', label: 'Pakistan Studies', urduLabel: 'مطالعہ پاکستان', qCount: 15, time: 10 },
    { id: 'academic-islamic', label: 'Islamic Studies', urduLabel: 'اسلامیات', qCount: 15, time: 10 },
    { id: 'academic-military', label: 'Military & Defense Knowledge', urduLabel: 'فوجی اور دفاعی معلومات', qCount: 15, time: 8 },
    { id: 'academic-science', label: 'Everyday Science', urduLabel: 'روزمرہ سائنس', qCount: 15, time: 10 },
    { id: 'academic-current', label: 'Current Affairs', urduLabel: 'حالیہ ملکی و بین الاقوامی حالات', qCount: 15, time: 10 }
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
          {lang === 'en' ? 'ISSB Practice Tests' : 'آئی ایس ایس بی امتحانی مشقیں'}
        </h1>
        <div className="w-20 h-1 bg-gold mx-auto mt-3 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-3.5 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Select a test category to begin timed practice. Progress and scores will be updated on your personal dashboard.'
            : 'ٹائمر مشق شروع کرنے کے لیے کسی بھی زمرے کا انتخاب کریں۔ حاصل کردہ نمبر آپ کے ڈیش بورڈ میں شامل کیے جائیں گے۔'
          }
        </p>
      </div>

      <div className="space-y-12">
        {/* Category 1: Verbal Intelligence */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gold/10 pb-3">
            <Compass className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-white tracking-wider">
              {lang === 'en' ? 'Verbal Intelligence Tests' : 'زبانی ذہانت کے ٹیسٹ'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verbalTopics.map((topic) => (
              <div key={topic.id} className="glass-panel p-5 rounded-xl border border-gold/15 flex flex-col justify-between hover:border-gold/30 transition-all">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {lang === 'en' ? topic.label : topic.urduLabel}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <HelpIcon className="w-3.5 h-3.5 text-gold" />
                      {topic.qCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {topic.time} Mins
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-gold/5 flex justify-end">
                  <Link
                    href={`/tests/run?category=${topic.id}`}
                    className="px-4 py-2 bg-olive-primary hover:bg-olive-light border border-gold/20 text-gold hover:text-white text-xs font-bold rounded tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{t('startTest')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category 2: Non-Verbal Intelligence */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gold/10 pb-3">
            <Target className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-white tracking-wider">
              {lang === 'en' ? 'Non-Verbal Intelligence Tests' : 'تصویری ذہانت کے ٹیسٹ'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nonVerbalTopics.map((topic) => (
              <div key={topic.id} className="glass-panel p-5 rounded-xl border border-gold/15 flex flex-col justify-between hover:border-gold/30 transition-all">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {lang === 'en' ? topic.label : topic.urduLabel}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <HelpIcon className="w-3.5 h-3.5 text-gold" />
                      {topic.qCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {topic.time} Mins
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-gold/5 flex justify-end">
                  <Link
                    href={`/tests/run?category=${topic.id}`}
                    className="px-4 py-2 bg-olive-primary hover:bg-olive-light border border-gold/20 text-gold hover:text-white text-xs font-bold rounded tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{t('startTest')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category 3: Academic Quizzes */}
        <div>
          <div className="flex items-center gap-3 mb-6 border-b border-gold/10 pb-3">
            <BookOpen className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-white tracking-wider">
              {lang === 'en' ? 'Academic & General Knowledge Quizzes' : 'تعلیمی جنرل نالج ٹیسٹ'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {academicTopics.map((topic) => (
              <div key={topic.id} className="glass-panel p-5 rounded-xl border border-gold/15 flex flex-col justify-between hover:border-gold/30 transition-all">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {lang === 'en' ? topic.label : topic.urduLabel}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <HelpIcon className="w-3.5 h-3.5 text-gold" />
                      {topic.qCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {topic.time} Mins
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-gold/5 flex justify-end">
                  <Link
                    href={`/tests/run?category=${topic.id}`}
                    className="px-4 py-2 bg-olive-primary hover:bg-olive-light border border-gold/20 text-gold hover:text-white text-xs font-bold rounded tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{t('startTest')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
