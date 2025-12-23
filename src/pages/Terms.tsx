import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            سيرتي
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">الشروط والأحكام</h1>
        
        <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">مقدمة</h2>
            <p>
              مرحبًا بك في "سيرتي". باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">تعريفات</h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li><strong>"الخدمة"</strong>: منصة سيرتي لإنشاء السير الذاتية</li>
              <li><strong>"المستخدم"</strong>: أي شخص يستخدم الخدمة</li>
              <li><strong>"المحتوى"</strong>: جميع المعلومات والنصوص التي يدخلها المستخدم</li>
              <li><strong>"الحساب"</strong>: حساب المستخدم المسجل على المنصة</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">استخدام الخدمة</h2>
            <p>عند استخدام خدماتنا، توافق على:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تقديم معلومات صحيحة ودقيقة</li>
              <li>عدم استخدام الخدمة لأغراض غير قانونية</li>
              <li>عدم محاولة الوصول غير المصرح به إلى أنظمتنا</li>
              <li>عدم نقل أو مشاركة حسابك مع آخرين</li>
              <li>الحفاظ على سرية معلومات تسجيل الدخول الخاصة بك</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">الحسابات</h2>
            <p>
              يجب أن يكون عمرك 18 عامًا على الأقل لإنشاء حساب. أنت مسؤول عن جميع الأنشطة التي تتم من خلال حسابك.
            </p>
            <p>
              نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه الشروط.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">الخطط والأسعار</h2>
            <p>نقدم الخطط التالية:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>
                <strong>الخطة الأساسية (39 ر.س)</strong>: جميع القوالب، تحميل PDF واحد، حفظ البيانات لمدة 7 أيام
              </li>
              <li>
                <strong>الخطة الاحترافية (59 ر.س)</strong>: جميع مميزات الخطة الأساسية، 3 تحميلات PDF، حفظ البيانات لمدة 30 يومًا، 50 طلب ذكاء اصطناعي
              </li>
            </ul>
            <p>
              جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة إن وجدت. الدفعات غير قابلة للاسترداد.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">سياسة الاسترداد</h2>
            <p>
              نظرًا لطبيعة الخدمة الرقمية، فإن جميع المدفوعات نهائية وغير قابلة للاسترداد بعد إتمام عملية الشراء. إذا واجهت مشكلة تقنية تمنعك من استخدام الخدمة، يرجى التواصل معنا وسنعمل على حلها.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">الملكية الفكرية</h2>
            <p>
              جميع حقوق الملكية الفكرية للمنصة، بما في ذلك التصميم والشعار والقوالب، مملوكة لـ "سيرتي". يحتفظ المستخدم بملكية المحتوى الذي يدخله.
            </p>
            <p>
              بإدخال المحتوى، تمنحنا ترخيصًا لاستخدامه لغرض تقديم الخدمة فقط.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">خدمات الذكاء الاصطناعي</h2>
            <p>
              تستخدم خدماتنا الذكاء الاصطناعي لتحسين محتوى السيرة الذاتية. يرجى ملاحظة:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>المحتوى المُنشأ بالذكاء الاصطناعي هو اقتراحات ويجب مراجعته</li>
              <li>أنت مسؤول عن دقة المعلومات النهائية في سيرتك الذاتية</li>
              <li>طلبات الذكاء الاصطناعي محدودة وفقًا لخطتك</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">إخلاء المسؤولية</h2>
            <p>
              نقدم الخدمة "كما هي" دون ضمانات من أي نوع. لا نضمن:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>حصولك على وظيفة باستخدام سيرتك الذاتية</li>
              <li>توفر الخدمة بشكل مستمر دون انقطاع</li>
              <li>خلو الخدمة من الأخطاء التقنية</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">حدود المسؤولية</h2>
            <p>
              لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">التعديلات على الشروط</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بالتغييرات الجوهرية. استمرارك في استخدام الخدمة بعد التعديل يعني موافقتك على الشروط الجديدة.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">القانون الحاكم</h2>
            <p>
              تخضع هذه الشروط وتُفسر وفقًا لأنظمة المملكة العربية السعودية.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">التواصل</h2>
            <p>
              للاستفسارات أو الشكاوى، يرجى التواصل معنا عبر{" "}
              <Link to="/contact" className="text-primary hover:underline">
                صفحة اتصل بنا
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} سيرتي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
