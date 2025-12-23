import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Download, Sparkles, Crown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPaid, planType, loading, refetchPaymentStatus } = usePaymentStatus();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Check for return URL
    const savedReturnUrl = localStorage.getItem('returnAfterPayment');
    if (savedReturnUrl) {
      setReturnUrl(savedReturnUrl);
    }

    // Verify payment with Stripe session
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      // No session ID, just check existing payment status
      refetchPaymentStatus();
      setVerifying(false);
    }
  }, []);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({
          title: "تم التحقق من الدفع",
          description: "تم تفعيل خطتك بنجاح!",
        });
      }

      // Refetch payment status to update UI
      await refetchPaymentStatus();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الدفع. يرجى التواصل مع الدعم.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleReturnToBuilder = () => {
    // Don't clear cvData - we need it when we return!
    // Only clear the returnAfterPayment URL
    localStorage.removeItem('returnAfterPayment');

    // Navigate to the saved URL or builder
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate('/builder');
    }
  };

  if (verifying || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحقق من حالة الدفع...</p>
        </div>
      </div>
    );
  }

  const isProfessional = planType === 'professional';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-3xl shadow-strong p-8 md:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">تم الدفع بنجاح!</h1>

          {hasPaid && (
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full mb-4">
              {isProfessional ? <Crown className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <span className="font-bold">
                {isProfessional ? 'الخطة الاحترافية' : 'الخطة الأساسية'}
              </span>
            </div>
          )}

          <p className="text-xl text-muted-foreground mb-8">
            شكراً لك على شراء الخطة. يمكنك الآن الاستفادة من جميع الميزات المتاحة.
          </p>

          <div className="bg-muted/30 rounded-2xl p-6 mb-8 space-y-4">
            <h3 className="font-bold text-lg mb-4 text-right">ما حصلت عليه:</h3>

            {/* Common Features */}
            <div className="flex items-start gap-3 text-right">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">الوصول لجميع القوالب</h3>
                <p className="text-sm text-muted-foreground">استخدم أي قالب من القوالب المتاحة</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-right">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">تحميل PDF عالي الجودة</h3>
                <p className="text-sm text-muted-foreground">
                  {isProfessional ? '5 تحميلات متاحة' : '3 تحميلات متاحة'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-right">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">حفظ البيانات</h3>
                <p className="text-sm text-muted-foreground">
                  {isProfessional ? 'محفوظة لمدة 30 يوم' : 'محفوظة لمدة 7 أيام'}
                </p>
              </div>
            </div>

            {/* Professional Only Features */}
            {isProfessional && (
              <>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold text-secondary flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4" />
                    ميزات الذكاء الاصطناعي
                  </h4>
                </div>

                <div className="flex items-start gap-3 text-right">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">تحسين النقاط بالذكاء الاصطناعي</h3>
                    <p className="text-sm text-muted-foreground">50 طلب متاح لتحسين المحتوى</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-right">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">إنشاء الملخص المهني تلقائياً</h3>
                    <p className="text-sm text-muted-foreground">دع الذكاء الاصطناعي يكتب ملخصك</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-right">
                  <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">اقتراح المهارات والتقنيات</h3>
                    <p className="text-sm text-muted-foreground">اقتراحات ذكية بناءً على خبراتك</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary w-full sm:w-auto" onClick={handleReturnToBuilder}>
              <FileText className="ml-2 h-5 w-5" />
              {returnUrl ? 'العودة للمتابعة' : 'ابدأ بإنشاء سيرتك'}
            </Button>

            <Link to="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                العودة للرئيسية
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              هل تحتاج مساعدة؟ <Link to="/contact" className="text-primary hover:underline">تواصل مع الدعم الفني</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
