const { createClient } = require('@supabase/supabase-js')

exports.handler = async function(event, context) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  )

  try {
    // Query the 'profiles' table from your database
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) throw error

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        timestamp: new Date().toISOString(),
        message: 'Supabase pinged successfully'
      })
    }
  } catch (error) {
    console.error('Keep-alive error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      })
    }
  }
}
```

6. **Scroll down and click "Commit changes"** (green button)

7. **Click "Commit changes"** again in the popup

---

**Done!** Now wait 2-3 minutes for Netlify to redeploy, then test it by visiting:
```
https://seeracy.com/.netlify/functions/keep-alive
