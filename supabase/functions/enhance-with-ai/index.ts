// Edge function for AI enhancement
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with anon key for auth
    const supabaseAuthClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Initialize Supabase client with service role for database queries
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "غير مصرح - يرجى تسجيل الدخول" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseAuthClient.auth.getUser(token);

    if (authError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "غير مصرح - يرجى تسجيل الدخول" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify payment status - user must have professional plan (using service role to bypass RLS)
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("id, plan_type, status, ai_requests_used")
      .eq("user_id", userData.user.id)
      .eq("status", "completed")
      .eq("plan_type", "professional")
      .order("created_at", { ascending: false })
      .limit(1);

    if (paymentError) {
      console.error("Payment check error:", paymentError);
      return new Response(
        JSON.stringify({ error: "خطأ في التحقق من حالة الاشتراك" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!paymentData || paymentData.length === 0) {
      return new Response(
        JSON.stringify({ error: "هذه الميزة متاحة فقط للباقة الاحترافية. يرجى الترقية للاستمرار." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payment = paymentData[0];

    // Check AI usage limit (50 requests for professional plan)
    const AI_REQUEST_LIMIT = 50;
    if ((payment.ai_requests_used || 0) >= AI_REQUEST_LIMIT) {
      return new Response(
        JSON.stringify({ error: "لقد استهلكت رصيد طلبات الذكاء الاصطناعي (50 طلب). يرجى التجديد." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Increment usage counter
    const { error: updateError } = await supabaseAdmin
      .from("payments")
      .update({
        ai_requests_used: (payment.ai_requests_used || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Error updating usage:", updateError);
      // We don't block the request if update fails, but we should log it
    }

    const { text, type } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "النص مطلوب" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("AI_SERVICE_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY غير متوفر" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "summary") {
      systemPrompt = "أنت مساعد محترف لكتابة السير الذاتية. مهمتك تحسين النصوص لتكون احترافية وجذابة.";
      userPrompt = `قم بتحسين النص التالي ليصبح ملخصاً مهنياً قوياً ومناسباً للسيرة الذاتية. اجعله بين 150-500 حرف:

${text}

قم بإرجاع النص المحسن فقط بدون أي شرح إضافي.`;
    } else if (type === "generate-summary") {
      systemPrompt = "أنت مساعد محترف لكتابة السير الذاتية. مهمتك إنشاء ملخصات احترافية قوية.";
      userPrompt = `بناءً على المعلومات التالية، اكتب ملخصاً مهنياً قوياً واحداً للسيرة الذاتية (150-500 حرف):

${text}

اكتب ملخصاً احترافياً واحداً يبرز الخبرات والمهارات الرئيسية. أرجع النص مباشرة بدون عناوين أو ترقيم.`;
    } else if (type === "experience") {
      systemPrompt = "أنت مساعد محترف لكتابة السير الذاتية. مهمتك تحسين أوصاف الخبرات العملية.";
      userPrompt = `قم بتحسين وصف الخبرة العملية التالية لجعله أكثر احترافية وتأثيراً:

${text}

قم بإرجاع النص المحسن فقط بدون أي شرح إضافي.`;
    } else if (type === "project") {
      systemPrompt = "أنت مساعد محترف لكتابة السير الذاتية. مهمتك تحسين أوصاف المشاريع.";
      userPrompt = `قم بتحسين وصف المشروع التالي ليصبح أكثر احترافية (حتى 200 حرف):

${text}

قم بإرجاع النص المحسن فقط بدون أي شرح إضافي.`;
    } else if (type === "generate_project_description") {
      systemPrompt = "أنت مساعد يكتب أوصاف مشاريع. أرجع فقط الوصف بدون أي كلام إضافي.";
      userPrompt = `اكتب وصفاً مختصراً (100-200 حرف) لمشروع اسمه: ${text}

مهم جداً: أرجع فقط الوصف مباشرة. بدون مقدمات، بدون "إليك"، بدون "بالتأكيد"، بدون شروحات.

مثال جيد: "منصة تجارة إلكترونية متكاملة لبيع المنتجات مع نظام دفع آمن وإدارة مخزون"
مثال سيء: "بالتأكيد! إليك وصف احترافي للمشروع..."

أرجع الوصف مباشرة:`;
    } else if (type === "suggest_technologies") {
      systemPrompt = "أنت مساعد خبير في اقتراح أدوات وتقنيات ومعدات مناسبة لأي مجال (طبي، هندسي، فني، حرفي، تقني). تفهم السياق وتقترح أدوات عملية ومناسبة. أرجع فقط الأسماء مفصولة بفواصل، بدون أي شرح.";
      userPrompt = `اقرأ معلومات المشروع التالية واقترح 4 أدوات أو تقنيات أو معدات أو أساليب عمل مناسبة تماماً لمجال هذا المشروع:

${text}

تعليمات صارمة:
1. افهم المجال من اسم المشروع والسياق (طبي، تعليمي، تطوعي، برمجي، هندسي، إداري، تصوير، تمريض، إلخ)
2. اقترح أدوات/تقنيات/معدات تناسب هذا المجال بالتحديد
3. للمجالات غير التقنية، اقترح المعدات المستخدمة (مثلاً للتمريض: فرز، تعقيم، إسعافات / للتصوير: كاميرا، عدسات، إضاءة)
4. أرجع 4 أدوات فقط مفصولة بفاصلة عربية (،) أو إنجليزية (,)

أمثلة:
- ممرضة: فرز الحالات، التعقيم، التلقيح، الخياطة الطبية
- مصور: كاميرا DSLR، عدسات تقريب، حامل ثلاثي، إضاءة
- مبرمج: React، Node.js، Git، VS Code

أرجع 4 أدوات/تقنيات مناسبة للمشروع المذكور (بدون مقدمات):
`;
    } else if (type === "suggest_skills") {
      systemPrompt = "أنت خبير في التوظيف والسير الذاتية. أرجع فقط المهارات مع المستويات بالصيغة المحددة تماماً.";
      userPrompt = `بناءً على المعلومات التالية، اقترح 6 مهارات مناسبة مع مستويات متنوعة.

${text}

أرجع المهارات بهذه الصيغة بالضبط (كل مهارة في سطر منفصل):
اسم المهارة | المستوى

مثال:
الطهي الإيطالي | خبير
تخطيط القوائم | متقدم
إدارة الفريق | متوسط
الطهي الصحي | متقدم
إدارة المخزون | متوسط
خدمة العملاء | متقدم

مهم جداً: أرجع فقط 6 سطور، كل سطر يحتوي على: اسم المهارة | المستوى
المستويات المسموحة فقط: مبتدئ، متوسط، متقدم، خبير`;
    } else if (type === "generate_responsibilities") {
      systemPrompt = "أنت مساعد يكتب مهام وظيفية. أرجع فقط النقاط بدون مقدمات.";
      userPrompt = `اكتب 4-6 مهام ومسؤوليات للوظيفة التالية:

${text}

مهم جداً:
- أرجع النقاط فقط بدون أي مقدمات أو شروحات
- كل نقطة في سطر منفصل
- بدون ترقيم أو رموز (-, •, *)
- ابدأ كل نقطة بفعل قوي
- كل نقطة 100-150 حرف

مثال صحيح:
قمت بإدارة فريق من 5 موظفين وتحقيق أهداف المبيعات بنسبة 120%
طورت نظام إدارة العملاء وحسنت الإنتاجية بنسبة 35%
نظمت 10 ورش عمل تدريبية للموظفين الجدد

مثال خاطئ:
بالتأكيد! إليك المهام المناسبة...

النقاط:`;
    } else {
      systemPrompt = "أنت مساعد محترف لكتابة السير الذاتية.";
      userPrompt = `قم بتحسين النص التالي ليصبح أكثر احترافية:

${text}`;
    }

    // Google Gemini API only supports specific models. Using gemini-2.5-flash as it is available for this key.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: "user",
            parts: [{ text: userPrompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "فشل الاتصال بخدمة Google Gemini" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    // Gemini response structure: candidates[0].content.parts[0].text
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "لم يتم الحصول على نتيجة من Gemini" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle skill suggestions with levels
    if (type === "suggest_skills") {
      const lines = content.split('\n').filter((line: string) => line.trim());
      const suggestions = lines
        .map((line: string) => {
          // Remove bullet points, numbers, etc.
          const cleaned = line.replace(/^[-•*\d.)\s]+/, '').trim();
          if (!cleaned) return null;

          // Check if line has the pipe separator
          if (cleaned.includes('|')) {
            const [name, level] = cleaned.split('|').map((s: string) => s.trim());
            if (name && level) {
              return { name, level };
            }
          }

          // Fallback: if no pipe, assign a default level
          return { name: cleaned, level: 'متوسط' };
        })
        .filter((s: any) => s !== null && s.name)
        .slice(0, 6);

      console.log('Parsed suggestions:', suggestions);

      return new Response(
        JSON.stringify({ suggestions }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle responsibilities generation
    if (type === "generate_responsibilities") {
      const responsibilities = content
        .split('\n')
        .map((s: string) => s.replace(/^[-•*\d.)\s]+/, '').trim())
        .filter((s: string) => s.length > 0 && !s.includes('بالتأكيد') && !s.includes('إليك'))
        .slice(0, 6);

      return new Response(
        JSON.stringify({ responsibilities }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle project description - clean any introductory text
    if (type === "generate_project_description") {
      // Remove common introductory phrases
      let cleanedContent = content.trim();
      const introPatterns = [
        /^(بالتأكيد[،!]*|تأكيد[،!]*|إليك|أكيد|نعم)[^\.]*[\.\:]/,
        /^".*"$/,
        /لتكون.*احترافية/i,
      ];

      introPatterns.forEach(pattern => {
        cleanedContent = cleanedContent.replace(pattern, '').trim();
      });

      // Get only the first sentence or paragraph that looks like a description
      const lines = cleanedContent.split('\n').filter((l: string) => l.trim());
      cleanedContent = lines.find((l: string) =>
        l.length > 50 &&
        !l.includes('بالتأكيد') &&
        !l.includes('إليك') &&
        !l.includes('لتحسين')
      ) || lines[0] || cleanedContent;

      return new Response(
        JSON.stringify({ enhancedText: cleanedContent.trim() }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle technologies suggestion - clean any introductory text
    if (type === "suggest_technologies") {
      let cleanedContent = content.trim();

      // If the content contains newlines, it might be a list. Convert to comma separated.
      if (cleanedContent.includes('\n')) {
        const listItems = cleanedContent
          .split('\n')
          .map(line => line.replace(/^[-•*\d.)\s]+/, '').trim()) // Remove bullets
          .filter(line => line.length > 0 && !line.match(/^(بالتأكيد|إليك|هنا|بناءً)/)); // Filter out chatty lines

        if (listItems.length > 0) {
          cleanedContent = listItems.join('، ');
        }
      }

      // Simple cleanup of common prefixes if they exist at the very start
      cleanedContent = cleanedContent
        .replace(/^(بالتأكيد|إليك|أكيد|هنا)[^:]*[:\n]/s, '') // Remove "Sure here is:"
        .trim();

      // Ensure no trailing/leading punctuation
      cleanedContent = cleanedContent.replace(/^[\s،,]+|[\s،,]+$/g, '');

      // Fallback: If we killed the string (e.g. it's too short), return the original
      if (cleanedContent.length < 3) {
        console.log("Cleaned content too short, returning original:", content);
        cleanedContent = content.replace(/^(بالتأكيد|إليك)[^:]*[:\n]/s, '').trim();
      }

      return new Response(
        JSON.stringify({ enhancedText: cleanedContent }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ enhancedText: content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});