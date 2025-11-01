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

    const { query, location, category, priceRange } = await req.json();

    // Get approved events
    let queryBuilder = supabaseClient
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .gte('date', new Date().toISOString());

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data: events } = await queryBuilder;

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use AI for semantic search
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const systemPrompt = `You are a semantic search engine for campus events. Understand natural language queries and find matching events.
Query: "${query}"
${location ? `Location filter: ${location}` : ''}
${priceRange ? `Price range: ${priceRange}` : ''}

Examples of queries you should understand:
- "hackathon prize worth 50000" → Find hackathons with prizes around 50,000
- "free music events near me" → Find free music events
- "AI workshops this weekend" → Find AI/ML workshops happening soon

Return ONLY a JSON array of event IDs that match the query, sorted by relevance. Format: ["id1", "id2", "id3"]`;

    const eventsContext = events.map(e => 
      `ID: ${e.id}, Title: ${e.title}, Category: ${e.category}, Tags: ${e.tags.join(', ')}, Price: ${e.price}, Location: ${e.location}, Description: ${e.description.substring(0, 200)}`
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
    const matchedIds = JSON.parse(aiData.choices[0].message.content);

    // Reorder events based on AI matching
    const results = matchedIds
      .map((id: string) => events.find(e => e.id === id))
      .filter((e: any) => e);

    return new Response(JSON.stringify({ results }), {
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