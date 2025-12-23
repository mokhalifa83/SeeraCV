import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
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
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;

    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Stripe key exists:", !!stripeKey);

    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe session:", session.id, "status:", session.payment_status);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, message: "Payment not completed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get price details to determine plan type
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const priceId = lineItems.data[0]?.price?.id;

    // Determine plan type based on price ID
    let planType = "basic";
    if (priceId === "price_1SQWPHD588IzJukPXDhfslCz") {
      planType = "professional";
    }

    // Check if payment already exists for this session
    const { data: existingPayment } = await supabaseClient
      .from("payments")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingPayment) {
      console.log("Payment already recorded for session:", sessionId);
      return new Response(
        JSON.stringify({ success: true, message: "Payment already recorded", planType }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get previous active payment to calculate carry-over (Stacking Logic)
    const { data: previousPayment } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let downloadOffset = 0;
    let aiOffset = 0;
    // Default expiry: Now + 30 days
    let newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 30);

    if (previousPayment) {
      // Calculate remaining from previous plan
      // NOTE: Limits must match those in logic (5 for Pro, 3 for Basic, 50 AI for Pro)
      const prevLimitDownloads = previousPayment.plan_type === 'professional' ? 5 : 3;
      const prevLimitAI = previousPayment.plan_type === 'professional' ? 50 : 0;

      const remainingDownloads = Math.max(0, prevLimitDownloads - (previousPayment.downloads_used || 0));
      const remainingAI = Math.max(0, prevLimitAI - (previousPayment.ai_requests_used || 0));

      console.log('Stacking Credits: ', { remainingDownloads, remainingAI });

      // Set negative usage to effectively "add" these credits to the new plan's limit
      // e.g. New Limit 5. Offset -3. Usage calculated = Used - Offset. 
      // Wait, standard calculation is `Used`.
      // If we seek to have `Limit - CurrentUsed = TotalAvailable`.
      // TotalAvailable = Limit + Remaining.
      // Limit - CurrentUsed = Limit + Remaining.
      // -CurrentUsed = Remaining.
      // CurrentUsed = -Remaining.
      downloadOffset = -remainingDownloads;
      aiOffset = -remainingAI;

      // Extend expiry if previous was not expired
      const oldExpiry = new Date(previousPayment.expires_at);
      if (oldExpiry > new Date()) {
        // Add 30 days to the OLD expiry instead of Now
        oldExpiry.setDate(oldExpiry.getDate() + 30);
        newExpiresAt = oldExpiry;
      }
    }

    // Insert payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        user_id: user.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || "SAR",
        status: "completed",
        plan_type: planType,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent as string,
        downloads_used: downloadOffset,
        ai_requests_used: aiOffset,
        expires_at: newExpiresAt.toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error inserting payment:", paymentError);
      throw paymentError;
    }

    console.log("Payment recorded successfully:", payment.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and recorded",
        planType,
        payment
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error verifying payment:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
