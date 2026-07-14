-- 1. Create Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  cnic TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'candidate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual update to own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow profile insertion on signup" ON public.profiles FOR INSERT WITH CHECK (true);

-- 2. Create Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow admin write access to questions" ON public.questions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Create Test Results Table
CREATE TABLE IF NOT EXISTS public.results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  suggestions TEXT[],
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read own test results" ON public.results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own test results" ON public.results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create User Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  completed_tests INTEGER DEFAULT 0,
  strengths TEXT[],
  weaknesses TEXT[],
  improvement_areas TEXT[],
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to upsert own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- 5. Seed Initial Question Catalog into remote Supabase database
INSERT INTO public.questions (category, question, options, correct_answer, explanation) VALUES
('verbal-analogies', 'Army is to Soldier as Navy is to:', ARRAY['Sailor', 'Pilot', 'Captain', 'Ship'], 'Sailor', 'A soldier is a member of the army, and a sailor is a member of the navy.'),
('verbal-analogies', 'Khyber Pass is to Pakistan as Khyber is to:', ARRAY['Mountain', 'KPK', 'Border', 'Locomotive'], 'KPK', 'The Khyber Pass is a landmark located in the Khyber Pakhtunkhwa (KPK) province of Pakistan.'),
('verbal-series', 'Complete the number series: 2, 6, 12, 20, 30, ?', ARRAY['40', '42', '44', '46'], '42', 'The difference between consecutive terms is increasing by 2: +4, +6, +8, +10, so the next addition is +12. 30 + 12 = 42.'),
('verbal-odd', 'Choose the odd one out:', ARRAY['Rifle', 'Pistol', 'Tank', 'Shield'], 'Shield', 'Rifle, Pistol, and Tank are offensive weapons, whereas a Shield is defensive equipment.'),
('verbal-vocabulary', 'What is the synonym of "VALOR"?', ARRAY['Cowardice', 'Bravery', 'Deceit', 'Trepidation'], 'Bravery', 'Valor means great courage in the face of danger, especially in battle. Its synonym is Bravery.'),
('academic-pakstudies', 'Who was the first Governor-General of Pakistan?', ARRAY['Liaquat Ali Khan', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Khawaja Nazimuddin', 'Ayub Khan'], 'Quaid-e-Azam Muhammad Ali Jinnah', 'Quaid-e-Azam Muhammad Ali Jinnah served as the first Governor-General of Pakistan from Independence on 14 August 1947 until his death on 11 September 1948.'),
('academic-military', 'What is the highest military gallantry award of Pakistan?', ARRAY['Hilal-e-Jurat', 'Nishan-e-Haider', 'Sitara-e-Jurat', 'Tamgha-e-Basalat'], 'Nishan-e-Haider', 'Nishan-e-Haider (Sign of the Lion) is the highest military gallantry award in Pakistan, awarded to officers and enlisted personnel for acts of extraordinary bravery in the face of the enemy.'),
('academic-military', 'Which rank in the Pakistan Army is directly above Major?', ARRAY['Captain', 'Lieutenant Colonel', 'Colonel', 'Brigadier'], 'Lieutenant Colonel', 'The rank hierarchy is: Captain -> Major -> Lieutenant Colonel -> Colonel -> Brigadier.');
