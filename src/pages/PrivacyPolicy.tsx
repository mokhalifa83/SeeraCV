import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">سياسة الخصوصية</h1>
        
        <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">مقدمة</h2>
            <p>
              نحن في "سيرتي" نلتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام خدماتنا.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">المعلومات التي نجمعها</h2>
            <p>نقوم بجمع المعلومات التالية:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>معلومات الحساب: البريد الإلكتروني وكلمة المرور عند التسجيل</li>
              <li>معلومات السيرة الذاتية: الاسم، معلومات الاتصال، الخبرات، التعليم، المهارات</li>
              <li>معلومات الدفع: يتم معالجتها بشكل آمن عبر Stripe ولا نخزن بيانات البطاقة</li>
              <li>معلومات الاستخدام: كيفية تفاعلك مع الموقع لتحسين خدماتنا</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">كيف نستخدم معلوماتك</h2>
            <p>نستخدم معلوماتك للأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>إنشاء وإدارة حسابك</li>
              <li>توفير خدمات إنشاء السيرة الذاتية</li>
              <li>معالجة المدفوعات</li>
              <li>تحسين خدماتنا وتجربة المستخدم</li>
              <li>إرسال إشعارات مهمة متعلقة بحسابك</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">حماية البيانات</h2>
            <p>
              نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. تشمل هذه الإجراءات:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تشفير البيانات أثناء النقل باستخدام SSL/TLS</li>
              <li>تخزين آمن للبيانات مع تشفير قاعدة البيانات</li>
              <li>مراجعات أمنية دورية</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">الاحتفاظ بالبيانات</h2>
            <p>
              نحتفظ ببيانات السيرة الذاتية الخاصة بك وفقًا لخطتك:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>الخطة الأساسية: 7 أيام</li>
              <li>الخطة الاحترافية: 30 يومًا</li>
            </ul>
            <p>يمكنك حذف بياناتك في أي وقت من خلال حسابك.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">مشاركة المعلومات</h2>
            <p>
              لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>مع مزودي الخدمات الضروريين (مثل معالجة الدفع)</li>
              <li>عند الحاجة للامتثال للقانون</li>
              <li>بموافقتك الصريحة</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">حقوقك</h2>
            <p>لديك الحق في:</p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>تصحيح البيانات غير الدقيقة</li>
              <li>حذف بياناتك</li>
              <li>الاعتراض على معالجة بياناتك</li>
              <li>نقل بياناتك</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">ملفات تعريف الارتباط</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">التواصل معنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا عبر{" "}
              <Link to="/contact" className="text-primary hover:underline">
                صفحة اتصل بنا
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">التعديلات</h2>
            <p>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع.
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

export default PrivacyPolicy;
