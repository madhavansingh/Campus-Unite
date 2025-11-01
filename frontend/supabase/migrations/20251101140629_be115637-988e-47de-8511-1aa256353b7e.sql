-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  college TEXT NOT NULL,
  year TEXT NOT NULL,
  branch TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  academic_background TEXT,
  professional_goals TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer', 'authority')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  mode TEXT NOT NULL DEFAULT 'offline' CHECK (mode IN ('online', 'offline', 'hybrid')),
  capacity INTEGER,
  price DECIMAL(10, 2) DEFAULT 0,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create event_rsvps table
CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event_bookmarks table
CREATE TABLE public.event_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event_views table for AI recommendations
CREATE TABLE public.event_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_views ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Events RLS Policies
CREATE POLICY "Anyone can view approved events"
  ON public.events FOR SELECT
  USING (status = 'approved' OR organizer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'authority'
  ));

CREATE POLICY "Organizers can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organizer', 'authority')
  ));

CREATE POLICY "Organizers can update their own pending events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id AND status = 'pending');

CREATE POLICY "Authorities can update event status"
  ON public.events FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'authority'
  ));

-- Event RSVPs RLS Policies
CREATE POLICY "Users can view their own RSVPs"
  ON public.event_rsvps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create RSVPs"
  ON public.event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON public.event_rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Event Bookmarks RLS Policies
CREATE POLICY "Users can view their own bookmarks"
  ON public.event_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.event_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.event_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Event Views RLS Policies
CREATE POLICY "Users can view their own views"
  ON public.event_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own views"
  ON public.event_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for events table
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;