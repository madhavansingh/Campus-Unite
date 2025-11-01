import { supabase } from "@/integrations/supabase/client";

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const createProfile = async (userId: string, profileData: any) => {
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profileData,
    });
  return { error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getAIRecommendations = async () => {
  const { data, error } = await supabase.functions.invoke('ai-recommendations');
  return { data, error };
};

export const semanticSearch = async (query: string, filters?: any) => {
  const { data, error } = await supabase.functions.invoke('semantic-search', {
    body: { query, ...filters },
  });
  return { data, error };
};

export const getEvents = async (status: string = 'approved') => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });
  return { data, error };
};

export const createEvent = async (eventData: any) => {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();
  return { data, error };
};

export const updateEvent = async (eventId: string, updates: any) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();
  return { data, error };
};

export const rsvpEvent = async (eventId: string, userId: string) => {
  const { error } = await supabase
    .from('event_rsvps')
    .insert({ event_id: eventId, user_id: userId });
  return { error };
};

export const unrsvpEvent = async (eventId: string, userId: string) => {
  const { error } = await supabase
    .from('event_rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  return { error };
};

export const bookmarkEvent = async (eventId: string, userId: string) => {
  const { error } = await supabase
    .from('event_bookmarks')
    .insert({ event_id: eventId, user_id: userId });
  return { error };
};

export const unbookmarkEvent = async (eventId: string, userId: string) => {
  const { error } = await supabase
    .from('event_bookmarks')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  return { error };
};

export const trackEventView = async (eventId: string, userId: string) => {
  await supabase
    .from('event_views')
    .insert({ event_id: eventId, user_id: userId });
};