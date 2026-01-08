export async function onRequest(context) {
  const supabaseUrl = context.env.VITE_SUPABASE_URL;
  const supabaseKey = context.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  try {
    // Simple fetch to Supabase to keep it active
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase pinged successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
