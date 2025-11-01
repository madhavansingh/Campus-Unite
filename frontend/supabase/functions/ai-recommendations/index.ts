import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile with interests
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all approved events
    const { data: events } = await supabaseClient
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .gte('date', new Date().toISOString());

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI to rank events based on user interests
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const systemPrompt = `You are an AI event recommendation system. Given a user's interests and a list of events, rank the events by relevance.
User interests: ${profile.interests.join(', ')}
User skills: ${profile.skills?.join(', ') || 'None'}
User goals: ${profile.professional_goals || 'Not specified'}

CRITICAL: The user has STRICTLY selected these interests: ${profile.interests.join(', ')}. 
DO NOT recommend events from categories they haven't selected. For example:
- If user selected "Technical", DO NOT show Cultural, Music, or Sports events
- If user selected "Music", DO NOT show Technical, Sports, or Art events
- Only recommend events that match their exact interests

Return ONLY a JSON array of event IDs sorted by relevance (most relevant first). Format: ["id1", "id2", "id3"]`;

    const eventsContext = events.map(e => 
      `ID: ${e.id}, Title: ${e.title}, Category: ${e.category}, Tags: ${e.tags.join(', ')}, Description: ${e.description.substring(0, 200)}`
    ).join('\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Events:\n${eventsContext}` }
        ],
      }),
    });

    const aiData = await response.json();
    const rankedIds = JSON.parse(aiData.choices[0].message.content);

    // Reorder events based on AI ranking and apply strict filtering
    const userInterests = profile.interests.map((i: string) => i.toLowerCase());
    const recommendations = rankedIds
      .map((id: string) => events.find(e => e.id === id))
      .filter((e: any) => e && (
        userInterests.includes(e.category.toLowerCase()) ||
        e.tags.some((tag: string) => userInterests.includes(tag.toLowerCase()))
      ));

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});