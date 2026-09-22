-- ==============================================================================
-- HACKHUB DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id BIGSERIAL PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  college TEXT,
  city TEXT,
  branch TEXT,
  year INTEGER,
  skills TEXT, -- comma-separated or JSON list
  preferred_role TEXT, -- e.g. Frontend, Backend, AI/ML, Full Stack, UI/UX
  availability TEXT, -- e.g. Full-time, Weekends, 10 hrs/week
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  bio TEXT,
  looking_for_team BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HACKATHONS
CREATE TABLE IF NOT EXISTS public.hackathons (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT,
  domain TEXT DEFAULT 'General',
  technologies TEXT[], -- e.g. ['React', 'Node.js', 'Python']
  location TEXT,
  is_online BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  event_start TIMESTAMPTZ,
  event_end TIMESTAMPTZ,
  website_url TEXT,
  registration_url TEXT,
  source_url TEXT,
  team_min INTEGER DEFAULT 1,
  team_max INTEGER DEFAULT 4,
  prize TEXT,
  difficulty TEXT DEFAULT 'intermediate', -- beginner, intermediate, advanced
  eligibility TEXT,
  rules TEXT,
  is_verified BOOLEAN DEFAULT true,
  verification_tier TEXT DEFAULT 'verified', -- 'verified', 'discovered', 'expired'
  last_verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  last_fetch_status TEXT DEFAULT 'success', -- 'success', 'failed', 'cached'
  source_platform TEXT DEFAULT 'Direct', -- 'Devfolio', 'Devpost', etc.
  change_hash TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming, registration_closed, ongoing, ended
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.1 HACKATHON SYNC LOGS (Telemetry & Audit)
CREATE TABLE IF NOT EXISTS public.hackathon_sync_logs (
  id BIGSERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  sources_checked INTEGER DEFAULT 0,
  discovered_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  expired_count INTEGER DEFAULT 0,
  failed_sources TEXT[],
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed'
  telemetry JSONB
);

-- 3. HACKATHON RULES (Rule Engine)
CREATE TABLE IF NOT EXISTS public.hackathon_rules (
  id BIGSERIAL PRIMARY KEY,
  hackathon_id BIGINT REFERENCES public.hackathons(id) ON DELETE CASCADE,
  max_slides INTEGER DEFAULT 10,
  min_video_minutes NUMERIC DEFAULT 5,
  max_video_minutes NUMERIC DEFAULT 10,
  required_sections TEXT[] DEFAULT ARRAY['Problem', 'Solution', 'Architecture', 'Tech Stack', 'Demo', 'Future Scope'],
  required_files TEXT[] DEFAULT ARRAY['GitHub repository', 'PPT', 'Video demonstration'],
  submission_requirements TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROBLEM STATEMENTS
CREATE TABLE IF NOT EXISTS public.problem_statements (
  id BIGSERIAL PRIMARY KEY,
  hackathon_id BIGINT REFERENCES public.hackathons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  vertical TEXT NOT NULL, -- e.g. AI & ML, FinTech, Healthcare, Smart Cities
  description TEXT NOT NULL,
  expected_solution TEXT,
  constraints TEXT,
  related_technologies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WINNING PROJECTS (Digital Archive)
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGSERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  competition TEXT NOT NULL,
  year INTEGER NOT NULL,
  problem_statement TEXT NOT NULL,
  solution TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  domain TEXT DEFAULT 'General',
  team_size INTEGER DEFAULT 4,
  project_image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  why_it_won TEXT,
  lessons_learned TEXT[],
  roadmap JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEAMS (TeamMatch)
CREATE TABLE IF NOT EXISTS public.teams (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hackathon_id BIGINT REFERENCES public.hackathons(id) ON DELETE SET NULL,
  created_by BIGINT REFERENCES public.profiles(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 4,
  required_skills TEXT,
  status TEXT DEFAULT 'open', -- open, closed, full
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT,
  skills TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 8. BOOKMARKS / SAVED HACKATHONS
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  hackathon_id BIGINT REFERENCES public.hackathons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hackathon_id)
);

-- 9. PRESENTATIONS (AI PPT Maker)
CREATE TABLE IF NOT EXISTS public.presentations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  hackathon_id BIGINT REFERENCES public.hackathons(id) ON DELETE SET NULL,
  project_title TEXT NOT NULL,
  team_name TEXT,
  template TEXT DEFAULT 'Hackathon Standard',
  slides JSONB NOT NULL,
  compliance_report JSONB,
  slide_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-EFFICIENCY SEARCH
CREATE INDEX IF NOT EXISTS idx_hackathons_deadline ON public.hackathons(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_hackathons_domain ON public.hackathons(domain);
CREATE INDEX IF NOT EXISTS idx_profiles_auth ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_hackathon ON public.teams(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_projects_year ON public.projects(year);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Public read permissions
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Hackathons are viewable by everyone" ON public.hackathons FOR SELECT USING (true);
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profiles" ON public.profiles FOR ALL USING (auth.uid() = auth_user_id);
