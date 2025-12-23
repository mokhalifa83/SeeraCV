import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Sparkles, GripVertical, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentDialog } from "@/components/PaymentDialog";

interface ExperienceStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const ExperienceStep = ({ data, updateData }: ExperienceStepProps) => {
  const experiences = data.experiences || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [enhancingResp, setEnhancingResp] = useState<{ expIndex: number; respIndex: number } | null>(null);
  const [generatingResp, setGeneratingResp] = useState<number | null>(null);
  const { toast } = useToast();
  const { hasPaid, planType, incrementAiRequests } = usePaymentStatus();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const addExperience = () => {
    updateData("experiences", [
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        responsibilities: [""],
      },
    ]);
    setExpandedIndex(experiences.length);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    updateData("experiences", updated);
  };

  const addResponsibility = (expIndex: number) => {
    const updated = [...experiences];
    if (updated[expIndex].responsibilities.length < 6) {
      updated[expIndex].responsibilities.push("");
      updateData("experiences", updated);
    }
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].responsibilities[respIndex] = value;
    updateData("experiences", updated);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].responsibilities.splice(respIndex, 1);
    updateData("experiences", updated);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_: any, i: number) => i !== index);
    updateData("experiences", updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const enhanceResponsibility = async (expIndex: number, respIndex: number) => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }

    const text = experiences[expIndex].responsibilities[respIndex];
    if (!text.trim()) {
      toast({
        title: "تنبيه",
        description: "الرجاء كتابة نص أولاً",
        variant: "destructive",
      });
      return;
    }

    setGeneratingResp(expIndex);
    try {
      const { data: functionData, error } = await supabase.functions.invoke(
        "enhance-with-ai",
        {
          body: { text, type: "experience" },
        }
      );

      if (error) throw error;

      if (functionData?.enhancedText) {
        updateResponsibility(expIndex, respIndex, functionData.enhancedText);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم التحسين بنجاح",
          description: "تم تحسين الوصف باستخدام الذكاء الاصطناعي",
        });
      }
    } catch (error: any) {
      console.error("Error enhancing responsibility:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل تحسين النص",
        variant: "destructive",
      });
    } finally {
      setEnhancingResp(null);
    }
  };

  const generateResponsibilities = async (expIndex: number) => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }
    const exp = experiences[expIndex];
    if (!exp.position || !exp.company) {
      toast({
        title: "تنبيه",
        description: "الرجاء إضافة المسمى الوظيفي واسم الشركة أولاً",
        variant: "destructive",
      });
      return;
    }

    setEnhancingResp({ expIndex, respIndex: -1 });
    try {
      const context = `المسمى الوظيفي: ${exp.position}
الشركة: ${exp.company}
الموقع: ${exp.location || "غير محدد"}
الفترة: ${exp.startDate} - ${exp.current ? "حتى الآن" : exp.endDate}`;

      const { data: functionData, error } = await supabase.functions.invoke(
        "enhance-with-ai",
        {
          body: { text: context, type: "generate_responsibilities" },
        }
      );

      if (error) throw error;

      if (functionData?.responsibilities) {
        const updated = [...experiences];
        updated[expIndex].responsibilities = functionData.responsibilities;
        updateData("experiences", updated);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء المهام والمسؤوليات تلقائياً",
        });
      }
    } catch (error: any) {
      console.error("Error generating responsibilities:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل إنشاء المهام",
        variant: "destructive",
      });
    } finally {
      setGeneratingResp(null);
    }
  };

  return (
    <>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        feature="تحسين وإنشاء المسؤوليات بالذكاء الاصطناعي"
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">الخبرات العملية</h2>
          <p className="text-muted-foreground">أضف خبراتك العملية بالتفصيل</p>
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">لم تضف أي خبرات بعد</p>
            <Button onClick={addExperience}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة خبرة
            </Button>
          </div>
        )}

        {experiences.map((exp: any, expIndex: number) => (
          <Card key={expIndex} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {exp.position || exp.company || `خبرة ${expIndex + 1}`}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedIndex(expandedIndex === expIndex ? null : expIndex)}
                >
                  {expandedIndex === expIndex ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(expIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {expandedIndex === expIndex && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">اسم الشركة</label>
                    <Input
                      placeholder="شركة التقنية"
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">المسمى الوظيفي</label>
                    <Input
                      placeholder="مطور برمجيات"
                      value={exp.position || ""}
                      onChange={(e) => updateExperience(expIndex, "position", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">تاريخ البداية</label>
                    <Input
                      type="month"
                      value={exp.startDate || ""}
                      onChange={(e) => updateExperience(expIndex, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">تاريخ النهاية</label>
                    <Input
                      type="month"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(expIndex, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`current-${expIndex}`}
                    checked={exp.current || false}
                    onCheckedChange={(checked) =>
                      updateExperience(expIndex, "current", checked)
                    }
                  />
                  <label htmlFor={`current-${expIndex}`} className="text-sm">
                    أعمل هنا حالياً
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">المهام والمسؤوليات</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateResponsibilities(expIndex)}
                      disabled={generatingResp === expIndex || !exp.position || !exp.company}
                    >
                      {generatingResp === expIndex ? (
                        <>
                          <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                          جاري الإنشاء...
                        </>
                      ) : (
                        <>
                          <Sparkles className="ml-2 h-3 w-3" />
                          إنشاء بالذكاء الاصطناعي
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {exp.responsibilities?.map((resp: string, respIndex: number) => (
                      <div key={respIndex} className="flex gap-2">
                        <Textarea
                          placeholder="المهمة أو المسؤولية"
                          value={resp}
                          onChange={(e) => updateResponsibility(expIndex, respIndex, e.target.value)}
                          rows={2}
                          className="flex-1"
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => enhanceResponsibility(expIndex, respIndex)}
                            disabled={enhancingResp?.expIndex === expIndex && enhancingResp?.respIndex === respIndex || !resp.trim()}
                          >
                            {enhancingResp?.expIndex === expIndex && enhancingResp?.respIndex === respIndex ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResponsibility(expIndex, respIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addResponsibility(expIndex)}
                    className="mt-2"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة مسؤولية
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {experiences.length > 0 && (
          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="ml-2 h-4 w-4" />
            إضافة خبرة أخرى
          </Button>
        )}
      </div>
    </>
  );
};

export default ExperienceStep;
