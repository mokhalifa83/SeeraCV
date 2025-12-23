import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { data: payments, error: paymentError } = await supabaseClient
      .from('payments')
      .select('id, plan_type, downloads_used, ai_requests_used, expires_at, created_at, status')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (paymentError) throw paymentError;

    const hasPaid = payments && payments.length > 0;
    const payment = hasPaid ? payments[0] : null;
    const planType = payment ? payment.plan_type : null;
    const isExpired = payment?.expires_at ? new Date(payment.expires_at) < new Date() : false;

    return new Response(
      JSON.stringify({
        hasPaid: hasPaid && !isExpired,
        planType,
        payment: payment ? {
          id: payment.id,
          plan_type: payment.plan_type,
          downloads_used: payment.downloads_used || 0,
          ai_requests_used: payment.ai_requests_used || 0,
          expires_at: payment.expires_at,
          created_at: payment.created_at,
          is_expired: isExpired
        } : null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error checking payment:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});