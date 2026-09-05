-- ==============================================================================
-- IEEE PEC Student Branch - Supabase Database Schema
-- Complete setup for Auth, Audition Portal, Interview Evaluation, and Event Management
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'pending' CHECK (role IN ('pending', 'interviewer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile or admins can update all" 
  ON public.profiles FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-provision profile on Supabase auth user signup trigger (optional helper)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User'),
    'pending'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. APPLICATIONS TABLE (Student Audition / Membership Submissions)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  sid TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  chapters TEXT[] DEFAULT '{}',
  domains TEXT[] DEFAULT '{}',
  github_url TEXT,
  portfolio_url TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Selected', 'Hold', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications Policies
CREATE POLICY "Allow public insert for applications" 
  ON public.applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated portal users to view applications" 
  ON public.applications FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
    )
  );

CREATE POLICY "Allow interviewers and admins to update application status" 
  ON public.applications FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
    )
  );


-- 3. INTERVIEWS TABLE (Evaluations & Scores submitted by Interviewers)
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  interviewer_name TEXT NOT NULL,
  technical_score INTEGER NOT NULL,
  communication_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  teamwork_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('Select', 'Hold', 'Reject')),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Interviews Policies
CREATE POLICY "Allow interviewers and admins to read interviews" 
  ON public.interviews FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
    )
  );

CREATE POLICY "Allow interviewers and admins to insert interview evaluations" 
  ON public.interviews FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
    )
  );


-- 4. EVENTS TABLE (Dynamic Events with Admin Management & Laptop Photo Upload)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  capacity INTEGER,
  registration_open BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Public read for events" 
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Admin write access for events" 
  ON public.events FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- 5. STORAGE BUCKET CONFIGURATION
-- Run this in Supabase Storage UI or via SQL:
-- Bucket Name: "event-images" (Public: true)

INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for event-images bucket
CREATE POLICY "Public Access for Event Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Admin upload access for Event Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
