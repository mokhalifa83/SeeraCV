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

    const { type } = await req.json();
    if (!type || !['download', 'ai_request'].includes(type)) {
      throw new Error("Invalid usage type");
    }

    // Get the latest payment for this user
    const { data: payments, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (paymentError) throw paymentError;
    if (!payments || payments.length === 0) {
      throw new Error("No active payment found");
    }

    const payment = payments[0];

    // Check if payment has expired
    if (payment.expires_at && new Date(payment.expires_at) < new Date()) {
      throw new Error("Payment has expired");
    }

    // Check limits
    const isProfessional = payment.plan_type === 'professional';
    const downloadsLimit = isProfessional ? 5 : 3;
    const aiRequestsLimit = isProfessional ? 50 : 0;

    if (type === 'download' && (payment.downloads_used || 0) >= downloadsLimit) {
      throw new Error("Download limit reached");
    }

    if (type === 'ai_request' && (payment.ai_requests_used || 0) >= aiRequestsLimit) {
      throw new Error("AI requests limit reached");
    }

    // Update usage
    const updateField = type === 'download' ? 'downloads_used' : 'ai_requests_used';
    const currentValue = payment[updateField] || 0;

    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        [updateField]: currentValue + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        [updateField]: currentValue + 1
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error updating usage:", errorMessage);

    // Determine appropriate status code based on error type
    let statusCode = 500;
    if (errorMessage.includes("No authorization header") ||
      errorMessage.includes("User not authenticated") ||
      errorMessage.includes("Invalid usage type") ||
      errorMessage.includes("No active payment found")) {
      statusCode = 400; // Bad request
    } else if (errorMessage.includes("limit reached") ||
      errorMessage.includes("expired")) {
      statusCode = 403; // Forbidden
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: statusCode,
      }
    );
  }
});