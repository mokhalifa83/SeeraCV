import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentDialog } from "@/components/PaymentDialog";

interface SkillsStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const SkillsStep = ({ data, updateData }: SkillsStepProps) => {
  const { toast } = useToast();
  const skills = data.skills || [];
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("متوسط");
  const [suggesting, setSuggesting] = useState(false);
  const { hasPaid, planType, incrementAiRequests } = usePaymentStatus();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const addSkill = () => {
    if (newSkillName.trim()) {
      updateData("skills", [
        ...skills,
        { name: newSkillName.trim(), level: newSkillLevel },
      ]);
      setNewSkillName("");
      setNewSkillLevel("متوسط");
    }
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_: any, i: number) => i !== index);
    updateData("skills", updated);
  };

  const updateSkillLevel = (index: number, level: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], level };
    updateData("skills", updated);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "مبتدئ":
        return "bg-muted text-muted-foreground";
      case "متوسط":
        return "bg-accent/20 text-accent-foreground";
      case "متقدم":
        return "bg-primary/20 text-primary";
      case "خبير":
        return "bg-secondary/20 text-secondary";
      default:
        return "bg-muted";
    }
  };

  const getLevelPercentage = (level: string) => {
    switch (level) {
      case "مبتدئ":
        return 25;
      case "متوسط":
        return 50;
      case "متقدم":
        return 75;
      case "خبير":
        return 100;
      default:
        return 50;
    }
  };

  const suggestSkills = async () => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }
    setSuggesting(true);
    try {
      const jobTitle = data.personalInfo?.jobTitle || "";
      const experiences = data.experiences || [];
      const education = data.education || [];

      if (!jobTitle && experiences.length === 0) {
        toast({
          title: "معلومات غير كافية",
          description: "يرجى إضافة المسمى الوظيفي أو الخبرات أولاً",
          variant: "destructive",
        });
        setSuggesting(false);
        return;
      }

      let context = `المسمى الوظيفي: ${jobTitle || "غير محدد"}\n`;

      if (experiences.length > 0) {
        context += `الخبرات العملية:\n`;
        experiences.forEach((exp: any) => {
          context += `- ${exp.position || "غير محدد"} في ${exp.company || "غير محدد"}`;
          if (exp.startDate || exp.endDate) {
            context += ` (${exp.startDate || ""} - ${exp.endDate || "حتى الآن"})`;
          }
          context += `\n`;
        });
      }

      if (education.length > 0) {
        context += `التعليم:\n`;
        education.forEach((edu: any) => {
          context += `- ${edu.degree || "غير محدد"} في ${edu.field || "غير محدد"}\n`;
        });
      }

      console.log("Sending context to AI:", context);

      const { data: result, error } = await supabase.functions.invoke("enhance-with-ai", {
        body: {
          type: "suggest_skills",
          text: context,
        },
      });

      if (error) throw error;

      console.log("AI response:", result);

      if (result?.suggestions && result.suggestions.length > 0) {
        const newSkills = result.suggestions.map((skill: any) => ({
          name: skill.name,
          level: skill.level || 'متوسط'
        }));
        updateData("skills", [...skills, ...newSkills]);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم اقتراح المهارات بنجاح",
          description: `تم إضافة ${newSkills.length} مهارة جديدة بمستويات متنوعة`,
        });
      } else {
        throw new Error("لم يتم الحصول على اقتراحات");
      }
    } catch (error: any) {
      console.error("Error suggesting skills:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل اقتراح المهارات",
        variant: "destructive",
      });
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        feature="اقتراح المهارات بالذكاء الاصطناعي"
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">المهارات</h2>
          <p className="text-muted-foreground">
            أضف مهاراتك التقنية والشخصية
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <Button
            onClick={suggestSkills}
            disabled={suggesting}
            variant="outline"
            className="w-full"
          >
            {suggesting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الاقتراح...
              </>
            ) : (
              <>
                <Sparkles className="ml-2 h-4 w-4" />
                اقتراح مهارات بالذكاء الاصطناعي
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            💡 استخدم الذكاء الاصطناعي لاقتراح مهارات مناسبة لمجالك
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="اسم المهارة (مثال: JavaScript)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
          </div>
          <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">مبتدئ</SelectItem>
              <SelectItem value="intermediate">متوسط</SelectItem>
              <SelectItem value="advanced">متقدم</SelectItem>
              <SelectItem value="expert">خبير</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addSkill}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة
          </Button>
        </div>

        {data.skills && data.skills.length > 0 && (
          <div className="space-y-3">
            {data.skills.map((skill: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getLevelColor(skill.level)} transition-all`}
                        style={{ width: `${getLevelPercentage(skill.level)}%` }}
                      />
                    </div>
                    <Select
                      value={skill.level}
                      onValueChange={(value) => updateSkillLevel(index, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">مبتدئ</SelectItem>
                        <SelectItem value="intermediate">متوسط</SelectItem>
                        <SelectItem value="advanced">متقدم</SelectItem>
                        <SelectItem value="expert">خبير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!data.skills || data.skills.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">لم تضف أي مهارات بعد</p>
            <Button variant="outline" onClick={suggestSkills} disabled={suggesting}>
              <Sparkles className="ml-2 h-4 w-4" />
              اقتراح مهارات بالذكاء الاصطناعي
            </Button>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">أمثلة على المهارات:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">JavaScript</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Python</Badge>
            <Badge variant="secondary">التواصل</Badge>
            <Badge variant="secondary">القيادة</Badge>
            <Badge variant="secondary">حل المشكلات</Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillsStep;
