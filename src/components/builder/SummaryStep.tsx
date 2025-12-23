import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentDialog } from "@/components/PaymentDialog";

interface SummaryStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const SummaryStep = ({ data, updateData }: SummaryStepProps) => {
  const summary = data.summary || "";
  const [enhancing, setEnhancing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { hasPaid, planType, incrementAiRequests } = usePaymentStatus();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleChange = (value: string) => {
    updateData("summary", value);
  };

  const enhanceSummary = async () => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }

    if (!summary.trim()) {
      toast({
        title: "تنبيه",
        description: "الرجاء كتابة نص أولاً",
        variant: "destructive",
      });
      return;
    }

    setEnhancing(true);
    try {
      const { data: functionData, error } = await supabase.functions.invoke(
        "enhance-with-ai",
        {
          body: { text: summary, type: "summary" },
        }
      );

      if (error) {
        // Try to parse error message from response
        const errorBody = await error.context?.json?.() || {};
        throw new Error(errorBody.error || error.message);
      }

      if (functionData?.enhancedText) {
        handleChange(functionData.enhancedText);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم التحسين بنجاح",
          description: "تم تحسين الملخص باستخدام الذكاء الاصطناعي",
        });
      }
    } catch (error: any) {
      console.error("Error enhancing summary:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل تحسين النص",
        variant: "destructive",
      });
    } finally {
      setEnhancing(false);
    }
  };

  const generateSummary = async () => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }

    const personalInfo = data.personalInfo || {};
    const experiences = data.experiences || [];
    const skills = data.skills || [];

    if (!personalInfo.jobTitle && experiences.length === 0) {
      toast({
        title: "تنبيه",
        description: "الرجاء إضافة معلوماتك الشخصية أو خبراتك أولاً",
        variant: "destructive",
      });
      return;
    }

    const context = `المسمى الوظيفي: ${personalInfo.jobTitle || "غير محدد"}
الخبرات: ${experiences.map((exp: any) => `${exp.position} في ${exp.company}`).join("، ") || "غير محدد"}
المهارات: ${skills.map((skill: any) => skill.name).join("، ") || "غير محدد"}`;

    setGenerating(true);
    try {
      const { data: functionData, error } = await supabase.functions.invoke(
        "enhance-with-ai",
        {
          body: { text: context, type: "generate-summary" },
        }
      );

      if (error) {
        // Try to parse error message from response
        const errorBody = await error.context?.json?.() || {};
        throw new Error(errorBody.error || error.message);
      }

      if (functionData?.enhancedText) {
        handleChange(functionData.enhancedText);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء ملخص احترافي تلقائياً",
        });
      }
    } catch (error: any) {
      console.error("Error generating summary:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل إنشاء الملخص",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        feature="ميزات الذكاء الاصطناعي"
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">الملخص المهني</h2>
          <p className="text-muted-foreground">
            اكتب ملخصاً مختصراً عن خبراتك ومهاراتك (2-3 جمل)
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="مثال: مطور برمجيات متخصص في تطوير تطبيقات الويب بخبرة 5 سنوات..."
              value={data.summary || ""}
              onChange={(e) => handleChange(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {data.summary?.length || 0} حرف
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={enhanceSummary}
              disabled={enhancing || !data.summary?.trim()}
              className="w-full"
            >
              {enhancing ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحسين...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-4 w-4" />
                  تحسين النص بالذكاء الاصطناعي
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={generateSummary}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-4 w-4" />
                  إنشاء ملخص تلقائياً
                </>
              )}
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>نصيحة:</strong> استخدم الذكاء الاصطناعي لتحسين صياغة الملخص أو إنشائه تلقائياً بناءً على بياناتك
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryStep;
