'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appName: 'ISSB Navigator',
    home: 'Home',
    about: 'About ISSB',
    tests: 'Practice Tests',
    quiz: 'Academic Quizzes',
    psych: 'Psychological Tests',
    interview: 'Interview Prep',
    physical: 'Physical Fitness',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    startPreparing: 'Start Preparing Free',
    heroTitle: 'Steer Your Path to Commission',
    heroSubtitle: 'Master the Inter Services Selection Board (ISSB) evaluation for Pakistan Army, Navy, and Air Force with immersive practice, automatic analytics, and guidance.',
    quotesHeader: 'Motivational Directives',
    welcomeBack: 'Welcome Back, Candidate',
    readinessProgress: 'ISSB Preparation Progress',
    completedTests: 'Completed Tests',
    totalScore: 'Total Score',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    improvements: 'Improvement Areas',
    startTest: 'Start Test',
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    explanation: 'Explanation',
    timer: 'Time Remaining',
    backToDashboard: 'Back to Dashboard',
    certificateText: 'This certifies that the candidate has completed core preparation modules on ISSB Navigator and demonstrated the required standard of cognitive, psychological, and physical awareness.',
    certifiedBy: 'Certified by ISSB Navigator Prep Council',
    downloadCert: 'Download Certificate',
    cnic: 'CNIC Number',
    fullName: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    phone: 'Phone Number (Optional)',
    registerTitle: 'Create Candidate Profile',
    loginTitle: 'Sign In to Dashboard',
    hasAccount: 'Already have a profile? Sign In',
    noAccount: 'New Candidate? Create Profile',
    testReport: 'Test Score Report',
    watTitle: 'Word Association Test (WAT)',
    sentenceTitle: 'Sentence Completion Test',
    tatTitle: 'Thematic Apperception Test (TAT)',
    adminUsers: 'Manage Candidates',
    adminQuestions: 'Manage Questions'
  },
  ur: {
    appName: 'آئی ایس ایس بی نیویگیٹر',
    home: 'ہوم پیج',
    about: 'آئی ایس ایس بی معلومات',
    tests: 'مشقی ٹیسٹ',
    quiz: 'علمی کوئز',
    psych: 'نفسیاتی ٹیسٹ',
    interview: 'انٹرویو گائیڈ',
    physical: 'جسمانی تندرستی',
    dashboard: 'ڈیش بورڈ',
    admin: 'ایڈمن پینل',
    profile: 'پروفائل',
    login: 'لاگ ان',
    register: 'رجسٹریشن',
    logout: 'لاگ آؤٹ',
    startPreparing: 'مفت تیاری شروع کریں',
    heroTitle: 'کمیشن کا راستہ یہاں سے شروع ہوتا ہے',
    heroSubtitle: 'پاکستان فوج، بحریہ اور فضائیہ کے آئی ایس ایس بی امتحانات کے لیے بھرپور مشقیں، نفسیاتی رہنمائی اور تعلیمی کوئز۔',
    quotesHeader: 'حوصلہ افزا پیغامات',
    welcomeBack: 'خوش آمدید، معزز امیدوار',
    readinessProgress: 'تیاری کی پیشرفت',
    completedTests: 'مکمل شدہ ٹیسٹ',
    totalScore: 'کل سکور',
    strengths: 'آپ کی صلاحیتیں',
    weaknesses: 'کمزوریاں',
    improvements: 'بہتری کے شعبے',
    startTest: 'ٹیسٹ شروع کریں',
    submit: 'جمع کریں',
    next: 'اگلا',
    previous: 'پچھلا',
    finish: 'مکمل کریں',
    explanation: 'وضاحت',
    timer: 'باقی وقت',
    backToDashboard: 'ڈیش بورڈ پر واپس جائیں',
    certificateText: 'یہ تصدیق کی جاتی ہے کہ امیدوار نے آئی ایس ایس بی نیویگیٹر پر تمام اہم مشقیں اور نفسیاتی سیشنز مکمل کر کے فکری اور جسمانی تیاری کا معیار حاصل کر لیا ہے۔',
    certifiedBy: 'تصدیق کنندہ: آئی ایس ایس بی نیویگیٹر کونسل',
    downloadCert: 'سرٹیفکیٹ ڈاؤن لوڈ کریں',
    cnic: 'شناختی کارڈ نمبر (CNIC)',
    fullName: 'پورا نام',
    email: 'ای میل پتہ',
    password: 'پاس ورڈ',
    phone: 'فون نمبر (اختیاری)',
    registerTitle: 'امیدوار کی پروفائل بنائیں',
    loginTitle: 'اپنے ڈیش بورڈ میں لاگ ان کریں',
    hasAccount: 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں',
    noAccount: 'نئے امیدوار؟ اکاؤنٹ بنائیں',
    testReport: 'ٹیسٹ رپورٹ کارڈ',
    watTitle: 'لفظی وابستگی کا ٹیسٹ (WAT)',
    sentenceTitle: 'نامکمل جملے مکمل کرنے کا ٹیسٹ',
    tatTitle: 'تصویری کہانی لکھنے کا ٹیسٹ (TAT)',
    adminUsers: 'امیدواروں کا انتظام',
    adminQuestions: 'سوالات کا انتظام'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Load language preference from local storage if available
    const savedLang = localStorage.getItem('issb_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'ur')) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ur' : 'en';
    setLang(nextLang);
    localStorage.setItem('issb_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  const isRtl = lang === 'ur';

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
