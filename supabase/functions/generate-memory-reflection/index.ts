import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memories, notebookCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare memory summary for AI
    const memorySummary = memories.map((m: any) => ({
      sentiment: m.sentiment || "neutral",
      preview: m.content.substring(0, 100),
    }));

    const systemPrompt = `You are a poetic memory curator. Create a beautiful, reflective visualization of someone's memory collection. Use metaphors like a "garden of memories", "constellation of moments", or "tapestry of experiences". 

Be warm, encouraging, and poetic. Keep it to 3-4 sentences that feel personal and meaningful. Focus on the emotional journey and growth.`;

    const userPrompt = `Create a poetic reflection for someone who has collected ${memories.length} memories across ${notebookCount} notebooks. 

Memory sentiments breakdown:
- Happy: ${memories.filter((m: any) => m.sentiment === "happy").length}
- Sad: ${memories.filter((m: any) => m.sentiment === "sad").length}
- Neutral: ${memories.filter((m: any) => m.sentiment === "neutral").length}
- Stressed: ${memories.filter((m: any) => m.sentiment === "stressed").length}

Sample memory snippets:
${memorySummary.slice(0, 5).map((m: any) => `- [${m.sentiment}] ${m.preview}...`).join("\n")}

Generate a beautiful, poetic reflection about their memory garden.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reflection = data.choices?.[0]?.message?.content || "Your memories bloom like flowers in a garden, each one a unique petal in the tapestry of your life's journey.";

    return new Response(
      JSON.stringify({ reflection }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating reflection:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
