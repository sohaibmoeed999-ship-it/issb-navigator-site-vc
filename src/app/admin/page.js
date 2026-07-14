'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/LanguageContext';
import { authService, databaseService } from '../../lib/supabase';
import { Shield, Users, BookOpen, BarChart3, Plus, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  const router = useRouter();
  const { lang } = useLanguage();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');

  // Admin lists data
  const [allUsers, setAllUsers] = useState([]);
  const [allResults, setAllResults] = useState([]);
  
  // Question Form states
  const [category, setCategory] = useState('verbal-analogies');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        
        setUser(currentUser);
        
        if (currentUser.role === 'admin') {
          // Load administrative lists
          const usersList = await databaseService.getAllUsers();
          setAllUsers(usersList);
          
          const resultsList = await databaseService.getAllResults();
          setAllResults(resultsList);
        }
      } catch (err) {
        console.error('Error fetching admin details:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!questionText || !optA || !optB || !optC || !optD || !correctAnswer || !explanation) {
      setFormError('Please fill in all question fields.');
      return;
    }

    const options = [optA, optB, optC, optD];
    if (!options.includes(correctAnswer)) {
      setFormError('Correct answer MUST exactly match one of the four options.');
      return;
    }

    try {
      await databaseService.addQuestion({
        category,
        question: questionText,
        options,
        correct_answer: correctAnswer,
        explanation
      });

      // Clear fields
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectAnswer('');
      setExplanation('');

      setFormSuccess('Question successfully registered in the database catalog!');
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setFormError(err.message || 'Failed to insert question.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Deny Access layout if not an Admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md glass-panel p-8 rounded-xl border border-red-500/30 text-center space-y-4">
          <ShieldAlert className="w-14 h-14 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Access Denied</h2>
          <p className="text-gray-400 text-xs leading-relaxed">
            This module is restricted to military commission officers and selection board administrators. Please log in using officer credentials.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-red-950/40 hover:bg-red-900/50 border border-red-700 text-red-300 hover:text-white text-xs font-bold rounded tracking-wide transition-all"
            >
              Sign In to Officer Registry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow flex flex-col justify-start">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-gold/15 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/30 border border-red-600/35 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide uppercase">Admin Panel</h1>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">SECURE OFFICER COMMAND STATION</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-black/40 p-1.5 rounded-lg border border-gold/10 gap-1">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded text-xs font-bold tracking-wide uppercase transition-all ${
              activeTab === 'questions' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Question
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded text-xs font-bold tracking-wide uppercase transition-all ${
              activeTab === 'candidates' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Candidates ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded text-xs font-bold tracking-wide uppercase transition-all ${
              activeTab === 'results' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Test Logs ({allResults.length})
          </button>
        </div>
      </div>

      {/* Tab Content 1: Add Question Form */}
      {activeTab === 'questions' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-gold/15 max-w-3xl mx-auto w-full animate-slide-in">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold" />
            <span>Add Question to Database Catalog</span>
          </h2>

          {formError && (
            <div className="mb-5 p-3 rounded bg-red-950/20 border border-red-900/30 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-5 p-3 rounded bg-emerald-950/30 border border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Category Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="verbal-analogies">Verbal - Analogies</option>
                  <option value="verbal-series">Verbal - Series</option>
                  <option value="verbal-coding">Verbal - Coding</option>
                  <option value="verbal-relations">Verbal - Relations</option>
                  <option value="verbal-odd">Verbal - Odd One Out</option>
                  <option value="verbal-vocabulary">Verbal - Vocabulary</option>
                  <option value="non-verbal-pattern">Non Verbal - Patterns</option>
                  <option value="non-verbal-series">Non Verbal - Figure Series</option>
                  <option value="non-verbal-completion">Non Verbal - Completion</option>
                  <option value="academic-pakstudies">Academic - Pak Studies</option>
                  <option value="academic-islamic">Academic - Islamic Studies</option>
                  <option value="academic-military">Academic - Military Knowledge</option>
                  <option value="academic-science">Academic - Everyday Science</option>
                  <option value="academic-current">Academic - Current Affairs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Correct Answer (Must match option text)
                </label>
                <input
                  type="text"
                  placeholder="Paste the exact correct option text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Question Statement / Description
              </label>
              <textarea
                placeholder="Type the question content..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full h-24 px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Option A
                </label>
                <input
                  type="text"
                  placeholder="Option A content"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Option B
                </label>
                <input
                  type="text"
                  placeholder="Option B content"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Option C
                </label>
                <input
                  type="text"
                  placeholder="Option C content"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Option D
                </label>
                <input
                  type="text"
                  placeholder="Option D content"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Answer Explanation (Displayed after grading)
              </label>
              <textarea
                placeholder="Describe why the correct answer is valid..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full h-18 px-3 py-2 bg-black/40 border border-gold/15 rounded text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gold hover:bg-gold-hover text-black font-extrabold text-xs rounded tracking-wider uppercase transition-all cursor-pointer active:scale-95 shadow"
              >
                Add to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content 2: Manage Candidates List */}
      {activeTab === 'candidates' && (
        <div className="glass-panel p-6 rounded-xl border border-gold/15 animate-slide-in">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            <span>Registered Candidates Registry</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[10px] uppercase font-mono border-b border-gold/10 text-gold">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Candidate Name</th>
                  <th className="py-2.5 px-4 font-bold">CNIC ID</th>
                  <th className="py-2.5 px-4 font-bold">Email</th>
                  <th className="py-2.5 px-4 font-bold text-center">Phone</th>
                  <th className="py-2.5 px-4 font-bold text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {allUsers.map((usr, i) => (
                  <tr key={i} className="hover:bg-olive-primary/10 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{usr.name}</td>
                    <td className="py-3 px-4 font-mono">{usr.cnic}</td>
                    <td className="py-3 px-4">{usr.email}</td>
                    <td className="py-3 px-4 text-center font-mono">{usr.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase ${
                        usr.role === 'admin' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'bg-olive-primary/30 text-gold border border-gold/25'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Global Test Results Logs */}
      {activeTab === 'results' && (
        <div className="glass-panel p-6 rounded-xl border border-gold/15 animate-slide-in">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold" />
            <span>Global Candidate Assessment Logs</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[10px] uppercase font-mono border-b border-gold/10 text-gold">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Test Name</th>
                  <th className="py-2.5 px-4 font-bold">Category</th>
                  <th className="py-2.5 px-4 font-bold text-center">Score</th>
                  <th className="py-2.5 px-4 font-bold text-center">Percentage</th>
                  <th className="py-2.5 px-4 font-bold text-right">Date Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {allResults.map((res, i) => (
                  <tr key={i} className="hover:bg-olive-primary/10 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{res.test_name}</td>
                    <td className="py-3 px-4 font-mono text-[10px]">{res.category}</td>
                    <td className="py-3 px-4 text-center font-bold font-mono">{res.score} / {res.total_questions}</td>
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {Math.round((res.score / res.total_questions) * 100)}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 font-mono">
                      {new Date(res.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
