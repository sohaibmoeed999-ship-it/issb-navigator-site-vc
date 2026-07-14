import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let realSupabase = null;

// Initialize Supabase only if keys are present
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    realSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
  }
}

// In-Memory fallback cache + LocalStorage synchronization
const IS_SERVER = typeof window === 'undefined';

const getLocalStorage = (key, defaultValue) => {
  if (IS_SERVER) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

// Seed initial users list (includes an admin)
const initialUsers = [
  {
    id: 'admin-id-12345',
    name: 'Brigadier General (R)',
    cnic: '11111-1111111-1',
    email: 'admin@issbnavigator.com',
    password: 'adminpassword',
    phone: '+923001234567',
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

// Seed initial questions catalog
import { seedQuestionsList } from './seedQuestions';

// Mock DB Engine
const mockDB = {
  getUsers: () => getLocalStorage('issb_users', initialUsers),
  setUsers: (users) => setLocalStorage('issb_users', users),
  
  getResults: () => getLocalStorage('issb_results', []),
  setResults: (results) => setLocalStorage('issb_results', results),
  
  getProgress: () => getLocalStorage('issb_progress', {}),
  setProgress: (progress) => setLocalStorage('issb_progress', progress),
  
  getQuestions: () => getLocalStorage('issb_questions', seedQuestionsList),
  setQuestions: (questions) => setLocalStorage('issb_questions', questions),
  
  getCurrentSession: () => getLocalStorage('issb_session', null),
  setCurrentSession: (session) => setLocalStorage('issb_session', session),
};

export const authService = {
  signUp: async ({ name, cnic, email, password, phone }) => {
    if (realSupabase) {
      const { data, error } = await realSupabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Save custom profile columns in Supabase profiles table
      const { error: profileError } = await realSupabase
        .from('profiles')
        .insert({ id: data.user.id, name, cnic, email, phone, role: 'candidate' });
      if (profileError) throw profileError;
      return { user: { id: data.user.id, name, email, role: 'candidate' } };
    } else {
      // LocalStorage Mock SignUp
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = mockDB.getUsers();
          const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
          const cnicExists = users.some(u => u.cnic === cnic);
          
          if (emailExists) {
            reject(new Error('A user with this email already exists.'));
            return;
          }
          if (cnicExists) {
            reject(new Error('A user with this CNIC already exists.'));
            return;
          }
          
          const newUser = {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            name,
            cnic,
            email,
            password, // In mock we store plaintext for local testing ease
            phone: phone || '',
            role: 'candidate',
            created_at: new Date().toISOString()
          };
          
          users.push(newUser);
          mockDB.setUsers(users);
          
          const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, cnic: newUser.cnic, role: newUser.role };
          mockDB.setCurrentSession(sessionUser);
          resolve({ user: sessionUser });
        }, 800);
      });
    }
  },

  signIn: async (emailOrCnic, password) => {
    if (realSupabase) {
      // If it is CNIC, we would first map it to email in a production app.
      // For simplicity in Supabase, we assume login by email.
      const { data, error } = await realSupabase.auth.signInWithPassword({
        email: emailOrCnic,
        password
      });
      if (error) throw error;
      
      const { data: profile, error: profileError } = await realSupabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) throw profileError;
      
      return { user: profile };
    } else {
      // LocalStorage Mock SignIn
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = mockDB.getUsers();
          const user = users.find(
            u => (u.email.toLowerCase() === emailOrCnic.toLowerCase() || u.cnic === emailOrCnic) && 
            u.password === password
          );
          
          if (!user) {
            reject(new Error('Invalid email/CNIC or password.'));
            return;
          }
          
          const sessionUser = { id: user.id, name: user.name, email: user.email, cnic: user.cnic, role: user.role };
          mockDB.setCurrentSession(sessionUser);
          resolve({ user: sessionUser });
        }, 800);
      });
    }
  },

  signOut: async () => {
    if (realSupabase) {
      const { error } = await realSupabase.auth.signOut();
      if (error) throw error;
    } else {
      mockDB.setCurrentSession(null);
    }
    return true;
  },

  getCurrentUser: async () => {
    if (realSupabase) {
      const { data: { user } } = await realSupabase.auth.getUser();
      if (!user) return null;
      const { data: profile } = await realSupabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return profile || null;
    } else {
      return mockDB.getCurrentSession();
    }
  }
};

export const databaseService = {
  // Questions Methods
  getQuestions: async (category = null) => {
    if (realSupabase) {
      let query = realSupabase.from('questions').select('*');
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } else {
      const questions = mockDB.getQuestions();
      if (category) {
        return questions.filter(q => q.category === category);
      }
      return questions;
    }
  },

  addQuestion: async (questionObj) => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('questions')
        .insert(questionObj)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const questions = mockDB.getQuestions();
      const newQuestion = {
        id: 'q-' + Math.random().toString(36).substr(2, 9),
        ...questionObj,
        created_at: new Date().toISOString()
      };
      questions.push(newQuestion);
      mockDB.setQuestions(questions);
      return newQuestion;
    }
  },

  // Test Results Methods
  saveResult: async ({ userId, testName, category, score, totalQuestions, suggestions }) => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('results')
        .insert({
          user_id: userId,
          test_name: testName,
          category,
          score,
          total_questions: totalQuestions,
          suggestions,
          date: new Date().toISOString()
        })
        .select();
      if (error) throw error;
      
      // Update overall progress aggregate
      await databaseService.syncProgress(userId);
      
      return data[0];
    } else {
      const results = mockDB.getResults();
      const newResult = {
        id: 'res-' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        test_name: testName,
        category,
        score,
        total_questions: totalQuestions,
        suggestions,
        date: new Date().toISOString()
      };
      results.push(newResult);
      mockDB.setResults(results);
      
      // Update progress
      await databaseService.syncProgress(userId);
      return newResult;
    }
  },

  getResults: async (userId) => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('results')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const results = mockDB.getResults();
      return results
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  // Progress Methods
  getProgress: async (userId) => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Allow empty
      return data || null;
    } else {
      const progressStore = mockDB.getProgress();
      return progressStore[userId] || null;
    }
  },

  syncProgress: async (userId) => {
    // Generate strengths, weaknesses and progress based on user test results
    const results = await databaseService.getResults(userId);
    const completedTests = results.length;
    
    // Simple analysis logic
    const categoryStats = {};
    results.forEach(res => {
      if (!categoryStats[res.category]) {
        categoryStats[res.category] = { totalScore: 0, maxScore: 0 };
      }
      categoryStats[res.category].totalScore += res.score;
      categoryStats[res.category].maxScore += res.total_questions;
    });

    const strengths = [];
    const weaknesses = [];
    const improvementAreas = [];

    Object.keys(categoryStats).forEach(cat => {
      const percentage = (categoryStats[cat].totalScore / categoryStats[cat].maxScore) * 100;
      const cleanName = cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (percentage >= 75) {
        strengths.push(cleanName);
      } else if (percentage < 55) {
        weaknesses.push(cleanName);
        improvementAreas.push(`Practice more ${cleanName} exercises`);
      } else {
        improvementAreas.push(`Review questions in ${cleanName}`);
      }
    });

    // Default values if no tests completed
    if (completedTests === 0) {
      strengths.push('Not analyzed yet');
      weaknesses.push('Take first test');
      improvementAreas.push('Attempt Verbal or Academic Quizzes to receive automated advice');
    }

    const progressObj = {
      user_id: userId,
      completed_tests: completedTests,
      strengths,
      weaknesses,
      improvement_areas: improvementAreas,
      last_active: new Date().toISOString()
    };

    if (realSupabase) {
      const { error } = await realSupabase
        .from('progress')
        .upsert(progressObj);
      if (error) throw error;
    } else {
      const progressStore = mockDB.getProgress();
      progressStore[userId] = progressObj;
      mockDB.setProgress(progressStore);
    }
  },

  // Admin Methods
  getAllUsers: async () => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data;
    } else {
      return mockDB.getUsers();
    }
  },

  getAllResults: async () => {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('results')
        .select('*');
      if (error) throw error;
      return data;
    } else {
      return mockDB.getResults();
    }
  }
};
