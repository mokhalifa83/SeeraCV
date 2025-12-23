import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Headphones, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const supportSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  issueType: z.string({ required_error: "الرجاء اختيار نوع المشكلة" }).min(1, "الرجاء اختيار نوع المشكلة"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

const PrioritySupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { planType } = usePaymentStatus();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isProfessional = planType === 'professional';

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      issueType: "",
      description: "",
    },
  });

  const onSubmit = async (values: SupportFormValues) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from('support_tickets').insert({
        user_id: session.user.id,
        name: values.name,
        email: values.email,
        issue_type: values.issueType,
        description: values.description,
        is_priority: isProfessional,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "تم إرسال طلبك بنجاح",
        description: isProfessional
          ? "سنتواصل معك خلال 24 ساعة كحد أقصى"
          : "سنتواصل معك في أقرب وقت ممكن",
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              سيرتي
            </Link>
            <Link
              to="/builder"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للمحرر
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">تم إرسال طلبك بنجاح!</CardTitle>
              <CardDescription className="text-lg">
                {isProfessional
                  ? "كمشترك في الخطة الاحترافية، سنتواصل معك خلال 24 ساعة كحد أقصى."
                  : "شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت ممكن."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                تم إرسال تفاصيل طلبك إلى فريق الدعم الفني. سنتواصل معك عبر البريد الإلكتروني المسجل.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => navigate("/builder")}>
                  العودة للمحرر
                </Button>
                <Button variant="outline" onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}>
                  إرسال طلب آخر
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            سيرتي
          </Link>
          <Link
            to="/builder"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمحرر
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isProfessional ? 'bg-secondary/20' : 'bg-primary/10'
            }`}>
            <Headphones className={`w-8 h-8 ${isProfessional ? 'text-secondary' : 'text-primary'}`} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isProfessional ? 'الدعم الفني ذو الأولوية' : 'الدعم الفني'}
          </h1>
          <p className="text-muted-foreground">
            {isProfessional
              ? 'كمشترك في الخطة الاحترافية، تحظى برد سريع خلال 24 ساعة'
              : 'أخبرنا كيف يمكننا مساعدتك'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              تفاصيل الطلب
            </CardTitle>
            <CardDescription>
              أخبرنا بالمشكلة التي تواجهها وسنساعدك في أقرب وقت
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="issueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع المشكلة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المشكلة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technical">مشكلة تقنية</SelectItem>
                          <SelectItem value="payment">مشكلة في الدفع</SelectItem>
                          <SelectItem value="download">مشكلة في التحميل</SelectItem>
                          <SelectItem value="ai">مشكلة في الذكاء الاصطناعي</SelectItem>
                          <SelectItem value="account">مشكلة في الحساب</SelectItem>
                          <SelectItem value="suggestion">اقتراح تحسين</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المشكلة</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اشرح المشكلة بالتفصيل..."
                          rows={5}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isProfessional && (
                  <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                    <p className="text-sm text-secondary flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      طلبك ذو أولوية عالية كمشترك في الخطة الاحترافية
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      إرسال الطلب
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PrioritySupport;