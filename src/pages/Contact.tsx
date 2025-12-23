import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  const [state, handleSubmit] = useForm("xnnevele");

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">اتصل بنا</h1>
          <p className="text-xl text-muted-foreground">
            نحن هنا لمساعدتك. أرسل لنا رسالتك وسنرد عليك في أقرب وقت ممكن.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                أرسل رسالتك
              </CardTitle>
              <CardDescription>
                املأ النموذج وسنتواصل معك قريبًا
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.succeeded ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-muted-foreground">
                    شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="أدخل اسمك"
                      required
                      className="text-right"
                    />
                    <ValidationError prefix="الاسم" field="name" errors={state.errors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      className="text-right"
                    />
                    <ValidationError prefix="البريد الإلكتروني" field="email" errors={state.errors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input
                      id="subject"
                      type="text"
                      name="subject"
                      placeholder="موضوع الرسالة"
                      required
                      className="text-right"
                    />
                    <ValidationError prefix="الموضوع" field="subject" errors={state.errors} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      required
                      className="text-right resize-none"
                    />
                    <ValidationError prefix="الرسالة" field="message" errors={state.errors} />
                  </div>

                  <Button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full gap-2"
                  >
                    {state.submitting ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  معلومات التواصل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">البريد الإلكتروني</h4>
                  <p className="text-muted-foreground">support@seerati.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">أوقات الرد</h4>
                  <p className="text-muted-foreground">نرد على الرسائل خلال 24-48 ساعة</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>الأسئلة الشائعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">كيف يمكنني استرداد أموالي؟</h4>
                  <p className="text-muted-foreground text-sm">
                    نظرًا لطبيعة الخدمة الرقمية، المدفوعات غير قابلة للاسترداد. إذا واجهت مشكلة تقنية، تواصل معنا.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">نسيت كلمة المرور</h4>
                  <p className="text-muted-foreground text-sm">
                    يمكنك إعادة تعيين كلمة المرور من صفحة تسجيل الدخول.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">كيف أحصل على المزيد من التحميلات؟</h4>
                  <p className="text-muted-foreground text-sm">
                    يمكنك شراء خطة جديدة للحصول على تحميلات إضافية.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} سيرتي. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
