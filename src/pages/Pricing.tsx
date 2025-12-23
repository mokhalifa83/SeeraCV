import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, X, Sparkles, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { hasPaid, planType, isExpired } = usePaymentStatus();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً للمتابعة",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(priceId);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { priceId },
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في عملية الدفع",
        description: "حدث خطأ أثناء إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const isBasicActive = hasPaid && !isExpired && planType === 'basic';
  const isProActive = hasPaid && !isExpired && planType === 'professional';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">سيرتي</h1>
        </Link>
        <nav className="flex gap-4 items-center">
          {user ? (
            <Link to="/builder">
              <Button variant="ghost">لوحة التحكم</Button>
            </Link>
          ) : (
            <>
              <Link to="/">
                <Button variant="ghost">الرئيسية</Button>
              </Link>
              <Link to="/builder">
                <Button className="gradient-primary">ابدأ الآن</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">خطط الأسعار</h1>
          <p className="text-xl text-muted-foreground">اختر الخطة المناسبة لك</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-card rounded-3xl shadow-medium p-8 hover:shadow-strong transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">الخطة الأساسية</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">39</span>
                <span className="text-2xl text-muted-foreground">ريال</span>
              </div>
              <p className="text-muted-foreground">مثالية للبداية السريعة</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>الوصول لجميع القوالب الخمسة</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>معاينة فورية أثناء الكتابة</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>تحميل PDF عالي الجودة</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>صفحة واحدة أو صفحتين</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>حفظ البيانات (7 أيام)</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>بدون ميزات الذكاء الاصطناعي</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>3 تحميلات PDF</span>
              </li>
            </ul>

            <Button
              className="w-full"
              size="lg"
              variant={isBasicActive ? "secondary" : "outline"}
              onClick={() => handleCheckout("price_1SQWO6D588IzJukPOeZ7XjK", "الأساسية")}
              disabled={loading === "price_1SQWO6D588IzJukPOeZ7XjK"}
            >
              {loading === "price_1SQWO6D588IzJukPOeZ7XjK" ? "جاري التحميل..." : (isBasicActive ? "تمديد الباقة / شراء المزيد - 39 ر.س" : "اشترِ الآن - 39 ر.س")}
            </Button>
          </div>

          {/* Professional Plan */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl shadow-strong p-8 relative border-2 border-primary/20">
            <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-secondary text-secondary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-medium">
              <Crown className="h-4 w-4" />
              الأكثر شعبية
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">الخطة الاحترافية</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">59</span>
                <span className="text-2xl text-muted-foreground">ريال</span>
              </div>
              <p className="text-muted-foreground">للحصول على أفضل النتائج</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">كل ميزات الخطة الأساسية</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">تحسين النقاط بالذكاء الاصطناعي (50 طلب)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">إنشاء الملخص المهني تلقائياً</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">اقتراح المهارات المناسبة</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">توسيع وصف الوظائف</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>5 تحميلات (تعديل وتحميل مجدداً)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>تحميل PDF و DOCX</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>حفظ البيانات (30 يوم)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>دعم فني ذو أولوية</span>
              </li>
            </ul>

            <Button
              className="w-full gradient-primary"
              size="lg"
              onClick={() => handleCheckout("price_1SQWPHD588IzJukPXDhfslCz", "الاحترافية")}
              disabled={loading === "price_1SQWPHD588IzJukPXDhfslCz"}
            >
              {loading === "price_1SQWPHD588IzJukPXDhfslCz" ? "جاري التحميل..." : (isProActive ? "تمديد الباقة / شراء المزيد - 59 ر.س" : "اشترِ الآن - 59 ر.س")}
              <Sparkles className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">مقارنة تفصيلية</h2>

          <div className="bg-card rounded-2xl shadow-medium overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right p-4 font-bold">الميزة</th>
                  <th className="text-center p-4 font-bold">الأساسية</th>
                  <th className="text-center p-4 font-bold">الاحترافية</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4">جميع القوالب (5)</td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">معاينة فورية</td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">PDF عالي الجودة</td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">تحسين بالذكاء الاصطناعي</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">اقتراح مهارات AI</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">إنشاء ملخص AI</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">عدد التحميلات</td>
                  <td className="text-center p-4 font-medium">3</td>
                  <td className="text-center p-4 font-medium">5</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">صيغة DOCX</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4">مدة الحفظ</td>
                  <td className="text-center p-4 font-medium">7 أيام</td>
                  <td className="text-center p-4 font-medium">30 يوم</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4">الدعم الفني</td>
                  <td className="text-center p-4 font-medium">عادي</td>
                  <td className="text-center p-4 font-medium">أولوية</td>
                </tr>
                <tr className="font-bold">
                  <td className="p-4">السعر</td>
                  <td className="text-center p-4">39 ريال</td>
                  <td className="text-center p-4">59 ريال</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">أسئلة شائعة</h2>

          <div className="space-y-4">
            <div className="bg-card p-6 rounded-xl shadow-soft">
              <h3 className="font-bold mb-2">هل يمكنني التعديل بعد الدفع؟</h3>
              <p className="text-muted-foreground">نعم! يمكنك العودة وتعديل سيرتك الذاتية خلال فترة الصلاحية (7 أيام للأساسية، 30 يوم للاحترافية).</p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft">
              <h3 className="font-bold mb-2">ما هي طرق الدفع المتاحة؟</h3>
              <p className="text-muted-foreground">نقبل جميع بطاقات الائتمان والخصم (Visa, Mastercard, Mada). الدفع آمن 100% عبر Stripe.</p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft">
              <h3 className="font-bold mb-2">هل الذكاء الاصطناعي يكتب المحتوى كاملاً؟</h3>
              <p className="text-muted-foreground">لا، الذكاء الاصطناعي يساعدك في تحسين ما تكتبه وتحويله لصيغة احترافية. أنت من يملك المحتوى الأساسي.</p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-soft">
              <h3 className="font-bold mb-2">هل القوالب متوافقة مع أنظمة ATS؟</h3>
              <p className="text-muted-foreground">نعم، جميع قوالبنا متوافقة مع أنظمة تتبع المتقدمين (ATS) المستخدمة في الشركات.</p>
            </div>
          </div>
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
    </div >
  );
};

export default Pricing;
