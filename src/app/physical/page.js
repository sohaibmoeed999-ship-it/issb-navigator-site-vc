'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService, databaseService } from '../../lib/supabase';
import { Award, Compass, Heart, ShieldAlert, CheckCircle2, Dumbbell, Clock, Compass as RunIcon, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhysicalFitness() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User input stats
  const [runTime, setRunTime] = useState('');
  const [pushups, setPushups] = useState('');
  const [situps, setSitups] = useState('');
  const [pullups, setPullups] = useState('');
  
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });

    // Load saved stats
    if (typeof window !== 'undefined') {
      const stats = localStorage.getItem('issb_fitness_stats');
      if (stats) {
        const parsed = JSON.parse(stats);
        setRunTime(parsed.runTime || '');
        setPushups(parsed.pushups || '');
        setSitups(parsed.situps || '');
        setPullups(parsed.pullups || '');
      }
    }
  }, [router]);

  const handleSaveStats = async (e) => {
    e.preventDefault();

    const statsObj = { runTime, pushups, situps, pullups };
    localStorage.setItem('issb_fitness_stats', JSON.stringify(statsObj));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);

    // Save to results to increment dash metrics
    try {
      await databaseService.saveResult({
        userId: user.id,
        testName: 'Physical Fitness Entry',
        category: 'fitness-stats',
        score: parseInt(pushups) || 0,
        totalQuestions: 30, // Pushup benchmark
        suggestions: [
          lang === 'en' ? 'Maintain daily running schedule.' : 'روزانہ دوڑنے کا شیڈول برقرار رکھیں۔',
          lang === 'en' ? 'Improve core strength for obstacle tests.' : 'رکاوٹیں عبور کرنے کے لیے اپنے پیٹ کے عضلات مضبوط کریں۔'
        ]
      });

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const weeklyPlans = {
    1: {
      title: 'Week 1: Aerobic Base & Stamina Building',
      urduTitle: 'پہلا ہفتہ: اسٹیمینا بلڈنگ',
      days: [
        'Monday: 2.0 km light jogging + 10 pushups.',
        'Tuesday: Core strengthening (planks, sit-ups) + stretches.',
        'Wednesday: 2.0 km jogging + 10 sit-ups.',
        'Thursday: Rest day.',
        'Friday: 2.5 km light run + 12 push-ups.',
        'Saturday: General stretching + light sprints.',
        'Sunday: Complete rest.'
      ],
      urduDays: [
        'پیر: 2 کلومیٹر ہلکی دوڑ + 10 پش اپس۔',
        'منگل: پیٹ کے عضلات کی ورزش (Planks) اور اسٹریچنگ۔',
        'بدھ: 2 کلومیٹر دوڑ + 10 سٹ اپس۔',
        'جمعرات: آرام کا دن۔',
        'جمعہ: 2.5 کلومیٹر دوڑ + 12 پش اپس۔',
        'ہفتہ: اسٹریچنگ اور تیز دوڑ کی مختصر مشقیں۔',
        'اتوار: مکمل آرام۔'
      ]
    },
    2: {
      title: 'Week 2: Strength & Muscle Development',
      urduTitle: 'دوسرا ہفتہ: عضلاتی طاقت بڑھانا',
      days: [
        'Monday: 2.5 km run + 15 push-ups + 15 sit-ups.',
        'Tuesday: Pull-up training (hanging & chin-ups attempt).',
        'Wednesday: 2.5 km run + Core drills (lunges, squats).',
        'Thursday: Rest day.',
        'Friday: 3.0 km run + 18 push-ups + 15 sit-ups.',
        'Saturday: Sprint drills (100m x 4 reps).',
        'Sunday: Rest.'
      ],
      urduDays: [
        'پیر: 2.5 کلومیٹر دوڑ + 15 پش اپس + 15 سٹ اپس۔',
        'منگل: پل اپس (رِنگ لٹکنا اور چڑھنا)۔',
        'بدھ: 2.5 کلومیٹر دوڑ + ٹانگوں کی مضبوطی کی ورزشیں۔',
        'جمعرات: آرام کا دن۔',
        'جمعہ: 3 کلومیٹر دوڑ + 18 پش اپس + 15 سٹ اپس۔',
        'ہفتہ: تیز دوڑ (100 میٹر کے 4 چکر)۔',
        'اتوار: آرام۔'
      ]
    },
    3: {
      title: 'Week 3: High-Intensity Obstacle Preparation',
      urduTitle: 'تیسرا ہفتہ: تیز رفتار رکاوٹیں عبور کرنے کی مشق',
      days: [
        'Monday: 3.0 km timed run + 20 push-ups + 20 sit-ups.',
        'Tuesday: Hanging drills + grip strengthening + 4 pull-ups.',
        'Wednesday: Hill sprints or high-intensity stair climbing.',
        'Thursday: Rest day.',
        'Friday: 3.0 km timed run + 22 push-ups + 22 sit-ups.',
        'Saturday: Long jumps + ditch-crossing mock jumps (7 feet).',
        'Sunday: Rest.'
      ],
      urduDays: [
        'پیر: 3 کلومیٹر وقت کے ساتھ دوڑ + 20 پش اپس + 20 سٹ اپس۔',
        'منگل: لٹکنے کی مشقیں اور ہاتھوں کی گرفت کی مضبوطی۔',
        'بدھ: اونچائی پر چڑھنے یا سیڑھیاں چڑھنے کی مشق۔',
        'جمعرات: آرام کا دن۔',
        'جمعہ: 3 کلومیٹر وقت کے ساتھ دوڑ + 22 پش اپس + 22 سٹ اپس۔',
        'ہفتہ: لمبی چھلانگ اور گڑھا عبور کرنے کی مشق (7 فٹ)۔',
        'اتوار: آرام۔'
      ]
    },
    4: {
      title: 'Week 4: Peak Selection Simulator',
      urduTitle: 'چوتھا ہفتہ: فائنل امتحانی معیار حاصل کرنا',
      days: [
        'Monday: 1.6 km simulation run (Target: under 7.5 mins).',
        'Tuesday: Full benchmark (15 push-ups, 15 sit-ups, 3 pull-ups in 2 mins).',
        'Wednesday: 2.0 km light jogging + active recovery stretching.',
        'Thursday: Rest day.',
        'Friday: Final simulation run (1.6 km) + all obstacle mock checks.',
        'Saturday: Rest and mental prep.',
        'Sunday: Board arrival prep.'
      ],
      urduDays: [
        'پیر: 1.6 کلومیٹر دوڑ کا ٹیسٹ (ہدف: ساڑھے 7 منٹ سے کم)۔',
        'منگل: مکمل امتحانی چیک (15 پش اپس، 15 سٹ اپس، 3 پل اپس 2 منٹ میں)۔',
        'بدھ: 2 کلومیٹر ہلکی چہل قدمی اور اسٹریچنگ۔',
        'جمعرات: آرام کا دن۔',
        'جمعہ: فائنل 1.6 کلومیٹر دوڑ کا چیک۔',
        'ہفتہ: آرام اور ذہنی سکون۔',
        'اتوار: آئی ایس ایس بی روانگی کی تیاری۔'
      ]
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
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide">
          {lang === 'en' ? 'Physical Test Guidance' : 'جسمانی تندرستی پلان'}
        </h1>
        <div className="w-24 h-1.5 bg-gold mx-auto mt-4 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-3.5 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Understand official standards, track your reps, and follow the custom 30-day training workout calendar.'
            : 'آئی ایس ایس بی فزیکل ٹیسٹ کے آفیشل معیار کو سمجھیں، اپنی کارکردگی درج کریں اور 30 روزہ پلان پر عمل کریں۔'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Requirements Board */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gold/15">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-gold/10 pb-3 mb-4">
              <Dumbbell className="w-5 h-5 text-gold" />
              <span>{lang === 'en' ? 'Official Benchmarks' : 'امتحانی معیار'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-black/20 border border-gold/10 rounded flex justify-between">
                <div>
                  <p className="font-bold text-white">{lang === 'en' ? '1.6 Km (1 Mile) Run' : '1.6 کلومیٹر دوڑ'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Stamina & cardiovascular timing</p>
                </div>
                <span className="font-bold text-gold shrink-0 font-mono text-xs">7.5 Mins Max</span>
              </div>

              <div className="p-3 bg-black/20 border border-gold/10 rounded flex justify-between">
                <div>
                  <p className="font-bold text-white">{lang === 'en' ? 'Push-Ups' : 'پش اپس'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Chest & upper body strength</p>
                </div>
                <span className="font-bold text-gold shrink-0 font-mono text-xs">15 Reps / 2 Mins</span>
              </div>

              <div className="p-3 bg-black/20 border border-gold/10 rounded flex justify-between">
                <div>
                  <p className="font-bold text-white">{lang === 'en' ? 'Sit-Ups' : 'سٹ اپس'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Core & abdominal muscle stamina</p>
                </div>
                <span className="font-bold text-gold shrink-0 font-mono text-xs">15 Reps / 2 Mins</span>
              </div>

              <div className="p-3 bg-black/20 border border-gold/10 rounded flex justify-between">
                <div>
                  <p className="font-bold text-white">{lang === 'en' ? 'Chin-Ups (Pull-Ups)' : 'پل اپس (ٹھوڑی اوپر)'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Back & bicep pull strength</p>
                </div>
                <span className="font-bold text-gold shrink-0 font-mono text-xs">3 Reps / 2 Mins</span>
              </div>

              <div className="p-3 bg-black/20 border border-gold/10 rounded flex justify-between text-left">
                <div>
                  <p className="font-bold text-white">{lang === 'en' ? 'Ditch Crossing' : 'گڑھا عبور کرنا'}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Physical leap determination</p>
                </div>
                <span className="font-bold text-gold shrink-0 font-mono text-xs">7ft 4in Wide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: 30-Day Calendar (Week-wise) & Stats Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Week Selector tabs */}
          <div className="flex border-b border-gold/10 max-w-sm">
            {[1, 2, 3, 4].map((wk) => (
              <button
                key={wk}
                onClick={() => setActiveWeek(wk)}
                className={`flex-1 py-3 text-xs font-bold transition-all ${
                  activeWeek === wk 
                    ? 'text-gold border-b-2 border-gold font-extrabold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Week {wk}
              </button>
            ))}
          </div>

          {/* Week Details */}
          <div className="glass-panel p-6 rounded-xl border border-gold/15 animate-slide-in">
            <h3 className="font-bold text-white text-base mb-4">
              {lang === 'en' ? weeklyPlans[activeWeek].title : weeklyPlans[activeWeek].urduTitle}
            </h3>

            <div className="space-y-3.5">
              {(lang === 'en' ? weeklyPlans[activeWeek].days : weeklyPlans[activeWeek].urduDays).map((dayText, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-black/20 border border-gold/5 rounded hover:border-gold/15 transition-all text-xs text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-olive-primary/50 border border-gold/20 flex items-center justify-center text-[8px] text-gold font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p>{dayText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fitness logger form */}
          <div className="glass-panel p-6 rounded-xl border border-gold/20 shadow-lg">
            <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              <span>{lang === 'en' ? 'Today\'s Fitness Log' : 'روزانہ کارکردگی لاگ'}</span>
            </h3>

            <form onSubmit={handleSaveStats} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {lang === 'en' ? '1.6 Km Time (e.g. 7:15)' : '1.6 کلومیٹر دوڑ کا وقت'}
                </label>
                <input
                  type="text"
                  placeholder="7:30"
                  value={runTime}
                  onChange={(e) => setRunTime(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Push-Ups Count' : 'پش اپس تعداد'}
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={pushups}
                  onChange={(e) => setPushups(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Sit-Ups Count' : 'سٹ اپس تعداد'}
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={situps}
                  onChange={(e) => setSitups(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Pull-Ups Count' : 'پل اپس تعداد'}
                </label>
                <input
                  type="number"
                  placeholder="3"
                  value={pullups}
                  onChange={(e) => setPullups(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2 flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-500 italic">Logs are synced with dashboard statistics.</span>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold hover:bg-gold-hover text-black font-extrabold text-xs rounded transition-all cursor-pointer active:scale-95 shadow"
                >
                  Save Today's Log
                </button>
              </div>
            </form>

            {savedStatus && (
              <div className="mt-4 p-2 bg-emerald-950/30 border border-emerald-900/40 text-center text-xs font-bold text-emerald-400 animate-pulse rounded">
                Today's Workout Entry Synced Successfully!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
