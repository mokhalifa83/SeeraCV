import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Sparkles, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveCvDataToStorage, loadCvDataFromStorage } from '@/hooks/useCvDataPersistence';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const PaymentDialog = ({ open, onOpenChange, feature }: PaymentDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planName: string) => {
    setLoading(priceId);

    try {
      // CRITICAL: Save current URL for return after payment
      const currentUrl = window.location.pathname + window.location.search;
      console.log('Saving return URL:', currentUrl);
      localStorage.setItem('returnAfterPayment', currentUrl);

      // CRITICAL: Ensure CV data is saved before redirecting
      const currentCvData = loadCvDataFromStorage();
      if (currentCvData) {
        console.log('CV data is already saved in localStorage');
        // Re-save to ensure it's fresh
        saveCvDataToStorage(currentCvData);
      } else {
        console.warn('No CV data found to save before payment');
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { priceId },
      });

      if (error) throw error;

      if (data.url) {
        // فتح صفحة الدفع في نفس النافذة للحصول على تجربة أفضل
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'خطأ في عملية الدفع',
        description: 'حدث خطأ أثناء إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {feature ? `${feature} - ميزة مدفوعة` : 'اختر خطة الدفع'}
          </DialogTitle>
          <DialogDescription>
            {feature
              ? 'هذه الميزة متاحة فقط للمشتركين. اختر الخطة المناسبة لك للمتابعة.'
              : 'اختر الخطة المناسبة لك للوصول إلى جميع المميزات'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Basic Plan */}
          <div className="bg-card rounded-2xl shadow-medium p-6 border">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">الخطة الأساسية</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">39</span>
                <span className="text-xl text-muted-foreground">ريال</span>
              </div>
              <p className="text-sm text-muted-foreground">مثالية للبداية السريعة</p>
            </div>

            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>الوصول لجميع القوالب</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>تحميل PDF عالي الجودة</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>حفظ البيانات (7 أيام)</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>بدون ميزات الذكاء الاصطناعي</span>
              </li>
              <li className="flex items-start gap-2 opacity-50">
                <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>تحميل واحد فقط</span>
              </li>
            </ul>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCheckout('price_1SQWO6D588IzJukPOeZ7XjK', 'الأساسية')}
              disabled={loading === 'price_1SQWO6D588IzJukPOeZ7XjK'}
            >
              {loading === 'price_1SQWO6D588IzJukPOeZ7XjK' ? 'جاري التحميل...' : 'اشترِ الآن - 39 ر.س'}
            </Button>
          </div>

          {/* Professional Plan */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl shadow-strong p-6 relative border-2 border-primary/20">
            <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Crown className="h-3 w-3" />
              الأكثر شعبية
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">الخطة الاحترافية</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">59</span>
                <span className="text-xl text-muted-foreground">ريال</span>
              </div>
              <p className="text-sm text-muted-foreground">للحصول على أفضل النتائج</p>
            </div>

            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">كل ميزات الخطة الأساسية</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">تحسين النقاط بالذكاء الاصطناعي (50 طلب)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">إنشاء الملخص المهني تلقائياً</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                </div>
                <span className="font-medium">اقتراح المهارات المناسبة</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>3 تحميلات (تعديل وتحميل مجدداً)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>حفظ البيانات (30 يوم)</span>
              </li>
            </ul>

            <Button
              className="w-full gradient-primary"
              onClick={() => handleCheckout('price_1SQWPHD588IzJukPXDhfslCz', 'الاحترافية')}
              disabled={loading === 'price_1SQWPHD588IzJukPXDhfslCz'}
            >
              {loading === 'price_1SQWPHD588IzJukPXDhfslCz' ? 'جاري التحميل...' : 'اشترِ الآن - 59 ر.س'}
              <Sparkles className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};