'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../components/LanguageContext';
import { Compass, Calendar, Award, CheckCircle2, ChevronRight, HelpCircle, Shield, AlertTriangle } from 'lucide-react';

export default function Guide() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('intro');

  const daysInfo = [
    {
      day: 'Day 1: Arrival & Screening',
      urduDay: 'پہلا دن: آمد اور اسکریننگ',
      details: [
        'Reception at the railway station/bus terminal and transport to the ISSB center.',
        'Document verification, medical measurement checks, and allotment of chest numbers.',
        'Initial Intelligence Tests (Verbal & Non-Verbal). Candidates who fail are screened out and return home immediately.',
        'Filling out biographical questionnaires (Personal Information Blank - PIB).'
      ],
      urduDetails: [
        'ریلوے اسٹیشن / بس ٹرمینل سے استقبال اور آئی ایس ایس بی سینٹر منتقلی۔',
        'دستاویزات کی پڑتال، ابتدائی قد اور وزن کی پیمائش، اور چیسٹ نمبرز کا الاٹمنٹ۔',
        'ابتدائی ذہانت کے ٹیسٹ (زبانی اور تصویری)۔ فیل ہونے والے امیدواروں کو اسی وقت گھر بھیج دیا جاتا ہے۔',
        'سوانحی بائیو ڈیٹا فارمز (PIB) پُر کرنا۔'
      ]
    },
    {
      day: 'Day 2: Psychological Battery & GTO Intro',
      urduDay: 'دوسرا دن: نفسیاتی امتحانات',
      details: [
        'Written Psychological Tests early morning: Word Association Test (WAT), Sentence Completion, Picture Story writing, and Thematic Apperception Test (TAT).',
        'Group Testing Officer (GTO) briefing and grouping.',
        'Indoor tasks: Group discussions (English & Urdu) and Group Planning exercises.',
        'First batch of Deputy President interviews.'
      ],
      urduDetails: [
        'صبح سویرے تحریری نفسیاتی ٹیسٹ: ورڈ ایسوسی ایشن ٹیسٹ (WAT)، جملے مکمل کرنا، اور تصویری کہانیاں (TAT)۔',
        'گروپ ٹیسٹنگ آفیسر (GTO) کی طرف سے گروپ بندی اور بریفنگ۔',
        'انڈور سرگرمیاں: گروپ ڈسکشن (انگریزی اور اردو) اور گروپ پلاننگ کی مشقیں۔',
        'ڈپٹی پریزیڈنٹ انٹرویو کا پہلا مرحلہ۔'
      ]
    },
    {
      day: 'Day 3: Outdoor GTO & Interview Continued',
      urduDay: 'تیسرا دن: آؤٹ ڈور سرگرمیاں',
      details: [
        'Outdoor GTO tasks: Progressive Group Task (PGT) and Half Group Task (HGT).',
        'Individual Obstacles: 9 hurdles (running, jumping, high rope, ditch crossing).',
        'Command Task: Leading your team to bridge a mock obstacle under pressure.',
        'Remaining Deputy President interviews.'
      ],
      urduDetails: [
        'آؤٹ ڈور سرگرمیاں: پروگریسو گروپ ٹاسک (PGT) اور ہاف گروپ ٹاسک (HGT)۔',
        'انفرادی رکاوٹیں (Obstacles): 9 مختلف رکاوٹیں عبور کرنا (رسی چڑھنا، چھلانگ لگانا، گڑھا پار کرنا)۔',
        'کمانڈ ٹاسک (Command Task): دباؤ میں اپنے گروپ کی قیادت کرنا اور مسئلہ حل کرنا۔',
        'باقی امیدواروں کے ڈپٹی پریزیڈنٹ انٹرویوز۔'
      ]
    },
    {
      day: 'Day 4: Conference & Final Board Decision',
      urduDay: 'چوتھا دن: کانفرنس اور آخری فیصلہ',
      details: [
        'Final conference of all board selectors (President, Psychologist, and GTO).',
        'Brief interviews or re-interviews if the board requires further evaluation of a candidate.',
        'Preparation of final recommendation results.',
        'Departure of all candidates. Recommendations/Call letters are sent via post or online portal later.'
      ],
      urduDetails: [
        'بورڈ سلیکٹرز (صدر، ماہر نفسیات، اور GTO) کا حتمی اجلاس (کانفرنس)۔',
        'کسی امیدوار کی حتمی جانچ کے لیے دوبارہ مختصر انٹرویو (Re-interview)۔',
        'حتمی کامیابی اور سفارشات کی لسٹیں تیار کرنا۔',
        'امیدواروں کی واپسی۔ حتمی سفارشی لیٹرز بعد میں بذریعہ ڈاک یا پورٹل بھیجے جاتے ہیں۔'
      ]
    }
  ];

  const phaseTips = {
    intelligence: {
      title: 'Intelligence Tests',
      urduTitle: 'ذہانت کے امتحانات',
      desc: 'Screening phase containing Verbal (analogies, relations) and Non-verbal (rotating shapes, completed grids) questions.',
      urduDesc: 'پہلے دن ہونے والی اسکریننگ جس میں زبانی اور تصویری ذہانت کے سوالات شامل ہیں۔',
      tips: [
        'Speed is critical: You will have around 30 seconds per question.',
        'Do not spend too much time on a single tough question. Skip and move forward.',
        'Practice coding-decoding patterns and visual symmetry daily.'
      ],
      urduTips: [
        'وقت کا خیال رکھیں: ہر سوال کے لیے تقریباً 30 سیکنڈ ہوتے ہیں۔',
        'ایک مشکل سوال پر زیادہ وقت ضائع نہ کریں۔ اسے چھوڑ کر آگے بڑھیں۔',
        'کوڈنگ اور اشکال کی مماثلت کی روزانہ مشق کریں۔'
      ]
    },
    gto: {
      title: 'GTO Outdoor Tasks',
      urduTitle: 'جی ٹی او سرگرمیاں',
      desc: 'Assesses teamwork, resource management, logic under pressure, and spatial engineering.',
      urduDesc: 'امیدواروں میں ٹیم کے ساتھ مل کر کام کرنے کی صلاحیت، قائدانہ خصوصیات اور عقل کا جائزہ لیا جاتا ہے۔',
      tips: [
        'Be cooperative: GTO checks how you help others, not just how you shine alone.',
        'Participate actively but do not shout or cut off others during discussions.',
        'In Command Tasks, give clear instructions and maintain officer-like poise.'
      ],
      urduTips: [
        'ٹیم کا تعاون بنیں: جی ٹی او یہ دیکھتا ہے کہ آپ دوسروں کی کتنی مدد کرتے ہیں۔',
        'گروپ ڈسکشن میں حصہ لیں لیکن دوسروں کی بات مت کاٹیں اور نہ چیخیں۔',
        'کمانڈ ٹاسک میں واضح احکامات دیں اور اپنے غصے پر قابو رکھیں۔'
      ]
    },
    psychology: {
      title: 'Psychological Assessment',
      urduTitle: 'نفسیاتی تحریریں',
      desc: 'Evaluates your subconscious values, alignment of character (WAT, Sentence completion, Stories).',
      urduDesc: 'آپ کی لاشعوری سوچ، سچائی، حب الوطنی اور ذہنی توازن کا جائزہ۔',
      tips: [
        'Be authentic: Do not write pre-memorized positive responses. Psychologists catch fake consistency.',
        'Write complete, positive, and active sentences under the strict 10s timer in WAT.',
        'Ensure your stories depict a problem followed by a constructive, realistic effort and logical success.'
      ],
      urduTips: [
        'حقیقی سوچ لکھیں: پہلے سے رٹے رٹائے یا بناوٹی مثبت جملے لکھنے سے پرہیز کریں۔',
        'ورڈ ایسوسی ایشن ٹیسٹ (WAT) کے 10 سیکنڈ ٹائمر میں مکمل اور با مقصد جملے لکھیں۔',
        'کہانیوں میں کسی مسئلے کی نشاندہی، اس کے حل کی حقیقت پسندانہ کوشش اور منطقی کامیابی دکھائیں۔'
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide">
          {lang === 'en' ? 'ISSB Selection Procedure' : 'آئی ایس ایس بی کا مکمل طریقہ کار'}
        </h1>
        <div className="w-24 h-1.5 bg-gold mx-auto mt-4 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-3.5 max-w-xl mx-auto">
          {lang === 'en' 
            ? 'A complete guide to understanding the four-day evaluation at the Inter Services Selection Board.'
            : 'انٹر سروسز سلیکشن بورڈ کے چار روزہ امتحانات اور طریقہ کار کی تفصیلی گائیڈ۔'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gold/10 mb-8 max-w-lg mx-auto w-full">
        <button
          onClick={() => setActiveTab('intro')}
          className={`flex-1 py-3 text-sm font-bold tracking-wide uppercase transition-colors text-center ${
            activeTab === 'intro' 
              ? 'text-gold border-b-2 border-gold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Introduction' : 'تعارف'}
        </button>
        <button
          onClick={() => setActiveTab('days')}
          className={`flex-1 py-3 text-sm font-bold tracking-wide uppercase transition-colors text-center ${
            activeTab === 'days' 
              ? 'text-gold border-b-2 border-gold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Day-by-Day' : 'روزانہ کا شیڈول'}
        </button>
        <button
          onClick={() => setActiveTab('phases')}
          className={`flex-1 py-3 text-sm font-bold tracking-wide uppercase transition-colors text-center ${
            activeTab === 'phases' 
              ? 'text-gold border-b-2 border-gold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang === 'en' ? 'Test Tips' : 'ٹیسٹ تجاویز'}
        </button>
      </div>

      {/* Tab Content 1: Intro */}
      {activeTab === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-slide-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-gold/15">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold" />
                <span>{lang === 'en' ? 'What is ISSB?' : 'آئی ایس ایس بی کیا ہے؟'}</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {lang === 'en' 
                  ? 'The Inter Services Selection Board (ISSB) is the official organization responsible for selecting future officers for the Pakistan Armed Forces (Army, Navy, and Air Force). It acts as a comprehensive filter evaluating potential candidates on cognitive agility, emotional intelligence, leadership stamina, and physical fitness.'
                  : 'انٹر سروسز سلیکشن بورڈ (ISSB) وہ باقاعدہ ادارہ ہے جو پاکستان مسلح افواج (پاک فوج، بحریہ، اور فضائیہ) کے لیے مستقبل کے افسران کا انتخاب کرتا ہے۔ یہ امیدواروں کی ذہنی صلاحیتوں، نفسیاتی توازن، قائدانہ صلاحیتوں اور جسمانی تندرستی کی جانچ کرتا ہے۔'
                }
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-gold/15">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                <span>{lang === 'en' ? 'Purpose of Selection' : 'انتخاب کا مقصد'}</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {lang === 'en'
                  ? 'The selectors at ISSB look for "Officer Like Qualities" (OLQs) in candidates. Rather than checking how much academic knowledge you have, they analyze how you behave under stress, your social integration skills, integrity, logic, and physical courage.'
                  : 'آئی ایس ایس بی میں سلیکٹرز امیدواروں میں "افسرانہ خصوصیات" (OLQs) تلاش کرتے ہیں۔ وہ یہ دیکھنے کے بجائے کہ آپ کے پاس کتنا تعلیمی رٹا ہے، یہ جانچتے ہیں کہ آپ ذہنی دباؤ میں کیسا ردعمل دیتے ہیں، آپ کی سماجی صلاحیتیں اور ایمانداری کیسی ہے۔'
                }
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[
                  { en: 'Integrity', ur: 'دیانت داری' },
                  { en: 'Determination', ur: 'عزم مصمم' },
                  { en: 'Responsibility', ur: 'ذمہ داری' },
                  { en: 'Team Spirit', ur: 'ملی جذبہ' },
                  { en: 'Courage', ur: 'بہادری' },
                  { en: 'Mental Speed', ur: 'ذہنی رفتار' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-black/30 rounded border border-gold/10 text-center">
                    <p className="text-xs font-bold text-gold">{item.en}</p>
                    <p className="text-[10px] text-gray-400 font-urdu mt-0.5">{item.ur}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Rules & Instructions */}
          <div className="glass-panel p-6 rounded-xl border border-[rgba(212,175,55,0.25)] space-y-5">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gold/10 pb-3">
              <Shield className="w-5 h-5 text-gold" />
              <span>{lang === 'en' ? 'Instructions' : 'اہم ہدایات'}</span>
            </h3>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <p>{lang === 'en' ? 'Bring original educational certificates and attested photocopies.' : 'اپنے اصل تعلیمی اسناد اور تصدیق شدہ فوٹو کاپیاں ساتھ لائیں۔'}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <p>{lang === 'en' ? 'Strict punctuality is enforced. Late arrival means immediate disqualification.' : 'وقت کی پابندی لازمی ہے۔ دیر سے پہنچنے کا مطلب نااہلی ہے۔'}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <p>{lang === 'en' ? 'Bring sports shoes, white shorts, and white collared polo shirts for GTO tasks.' : 'کھیل کے جوتے، سفید شارٹس، اور آؤٹ ڈور ٹاسک کے لیے سفید کالر والی پولو شرٹ لائیں۔'}</p>
              </div>
              
              <div className="p-3.5 rounded bg-amber-950/20 border border-amber-900/30 text-amber-400 flex gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider">Prohibited Items</p>
                  <p className="mt-0.5 leading-tight text-[10px] text-gray-400">Mobile phones, smartwatches, cameras, and laptops must be deposited at the reception security counter upon arrival.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Day by Day Schedule */}
      {activeTab === 'days' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-slide-in">
          {daysInfo.map((dayObj, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-xl border border-gold/15 relative overflow-hidden">
              {/* Floating day indicator background */}
              <div className="absolute top-0 right-0 p-4 font-black text-6xl text-gold/5 font-mono select-none">
                0{idx + 1}
              </div>

              <h2 className="text-xl font-bold text-gold tracking-wide flex items-center gap-2 mb-4 border-b border-gold/10 pb-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>{lang === 'en' ? dayObj.day : dayObj.urduDay}</span>
              </h2>

              <ul className="space-y-3.5 pl-1">
                {(lang === 'en' ? dayObj.details : dayObj.urduDetails).map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-3 text-sm text-gray-300">
                    <ChevronRight className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Testing Phase Breakdown & Tips */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
          {Object.keys(phaseTips).map((key) => {
            const phase = phaseTips[key];
            return (
              <div key={key} className="glass-panel p-6 rounded-xl border border-gold/15 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-olive-primary/30 border border-gold/25 flex items-center justify-center mb-4">
                    <HelpCircle className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide border-b border-gold/10 pb-2">
                    {lang === 'en' ? phase.title : phase.urduTitle}
                  </h3>
                  <p className="mt-3 text-gray-400 text-xs leading-relaxed">
                    {lang === 'en' ? phase.desc : phase.urduDesc}
                  </p>

                  <hr className="border-gold/10 my-4" />

                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'Professional Tips:' : 'پیشہ ورانہ تجاویز:'}
                  </h4>
                  <ul className="space-y-2.5 pl-1">
                    {(lang === 'en' ? phase.tips : phase.urduTips).map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2 text-xs text-gray-300">
                        <div className="w-1 h-1 rounded-full bg-gold shrink-0 mt-1.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
