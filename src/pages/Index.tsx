import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Sparkles, Download, Zap, CheckCircle2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserProfileMenu from "@/components/builder/UserProfileMenu";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 md:py-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-primary">سيرتي</h1>
        </div>
        <nav className="flex gap-2 md:gap-4 items-center flex-wrap">
          {session ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Button onClick={() => navigate("/builder")} variant="ghost" size="sm" className="text-xs md:text-sm">
                لوحة التحكم
              </Button>
              <UserProfileMenu
                user={session.user}
                onSignOut={handleSignOut}
                onOpenDrafts={() => navigate("/builder")}
              />
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">تسجيل الدخول</Button>
              </Link>
              <Link to="/pricing" className="hidden sm:inline">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">الأسعار</Button>
              </Link>
              <Link to="/signup">
                <Button className="gradient-primary text-xs md:text-sm" size="sm">ابدأ الآن</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            أنشئ سيرتك الذاتية
            <br />
            <span className="text-primary">الاحترافية بدقائق</span>
          </h1>

          {session && (
            <p className="text-lg font-medium text-primary mb-2 animate-fade-in">
              مرحباً بك مجدداً 👋، جاهز لإكمال سيرتك الذاتية؟
            </p>
          )}

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            قوالب عصرية مصممة خصيصاً للسوق العربي، ذكاء اصطناعي لتحسين محتواك، وتحميل فوري بصيغة PDF
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {session ? (
              <Button
                size="lg"
                className="gradient-primary text-lg px-8 py-6 shadow-strong hover:shadow-strong hover:scale-105 transition-all"
                onClick={() => navigate("/builder")}
              >
                الذهاب للوحة التحكم
                <Zap className="mr-2 h-5 w-5" />
              </Button>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-lg px-8 py-6 shadow-strong hover:shadow-strong hover:scale-105 transition-all">
                  ابدأ الآن مجاناً
                  <Zap className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                عرض الأسعار
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>بدون بطاقة ائتمانية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>معاينة فورية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>PDF عالي الجودة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">لماذا سيرتي؟</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-medium hover:shadow-strong transition-all">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">قوالب احترافية</h3>
            <p className="text-muted-foreground leading-relaxed">
              5 قوالب عصرية مصممة خصيصاً للسير الذاتية العربية. مناسبة لجميع المجالات من التقنية إلى الإدارة
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-medium hover:shadow-strong transition-all">
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">ذكاء اصطناعي</h3>
            <p className="text-muted-foreground leading-relaxed">
              اكتب نقاطك ببساطة ودع الذكاء الاصطناعي يحولها لعبارات احترافية قوية تلفت انتباه أصحاب العمل
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-medium hover:shadow-strong transition-all">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Download className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">تحميل فوري</h3>
            <p className="text-muted-foreground leading-relaxed">
              حمّل سيرتك الذاتية بصيغة PDF عالية الجودة جاهزة للطباعة أو الإرسال الفوري للشركات
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <h2 className="text-4xl font-bold text-center mb-16">كيف تعمل؟</h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">أدخل معلوماتك</h3>
            <p className="text-muted-foreground">املأ نموذج بسيط بخبراتك ومهاراتك</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">اختر القالب</h3>
            <p className="text-muted-foreground">اختر من بين 5 قوالب احترافية</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">حسّن بالذكاء AI</h3>
            <p className="text-muted-foreground">استخدم الذكاء الاصطناعي لتحسين المحتوى</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-bold mb-2">حمّل سيرتك</h3>
            <p className="text-muted-foreground">احصل على PDF جاهز للاستخدام</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">ماذا يقول مستخدمونا؟</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-soft">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />)}
            </div>
            <p className="text-foreground mb-4">"موقع رائع! ساعدني في إنشاء سيرة ذاتية احترافية في أقل من 10 دقائق. القوالب جميلة والذكاء الاصطناعي فعلاً مفيد."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                أ
              </div>
              <div>
                <p className="font-bold">أحمد العتيبي</p>
                <p className="text-sm text-muted-foreground">مهندس برمجيات</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-soft">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />)}
            </div>
            <p className="text-foreground mb-4">"استخدمت الخطة الاحترافية وحصلت على وظيفة خلال أسبوعين! الذكاء الاصطناعي حوّل خبراتي لنقاط قوية جداً."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                ف
              </div>
              <div>
                <p className="font-bold">فاطمة المطيري</p>
                <p className="text-sm text-muted-foreground">مديرة تسويق</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-soft">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />)}
            </div>
            <p className="text-foreground mb-4">"أفضل موقع لإنشاء السير الذاتية بالعربي. التصميم سهل والنتيجة احترافية جداً. أنصح به بشدة!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                م
              </div>
              <div>
                <p className="font-bold">محمد الشمري</p>
                <p className="text-sm text-muted-foreground">خريج جديد</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="gradient-hero rounded-3xl p-12 text-center text-white shadow-strong">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز لإنشاء سيرتك الاحترافية؟</h2>
          <p className="text-xl mb-8 opacity-90">ابدأ الآن مجاناً وحمّل سيرتك في دقائق</p>
          {session ? (
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/builder")}
            >
              اكمل سيرتك الذاتية
              <Zap className="mr-2 h-5 w-5" />
            </Button>
          ) : (
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                ابدأ الآن
                <Zap className="mr-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">سيرتي</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} سيرتي. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
