import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentDialog } from "@/components/PaymentDialog";

interface AdditionalStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const AdditionalStep = ({ data, updateData }: AdditionalStepProps) => {
  const { toast } = useToast();
  const { hasPaid, planType, incrementAiRequests } = usePaymentStatus();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const languages = data.languages || [];
  const projects = data.projects || [];
  const hobbies = data.hobbies || [];
  const [enhancingProject, setEnhancingProject] = useState<number | null>(null);
  const [generatingTech, setGeneratingTech] = useState<number | null>(null);
  const [newHobby, setNewHobby] = useState("");

  const addLanguage = () => {
    updateData("languages", [
      ...languages,
      { name: "", proficiency: "جيد" },
    ]);
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    updateData("languages", updated);
  };

  const removeLanguage = (index: number) => {
    const updated = languages.filter((_: any, i: number) => i !== index);
    updateData("languages", updated);
  };

  const addProject = () => {
    updateData("projects", [
      ...projects,
      { name: "", description: "", technologies: "", link: "", date: "" },
    ]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    updateData("projects", updated);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_: any, i: number) => i !== index);
    updateData("projects", updated);
  };

  const generateProjectDescription = async (index: number) => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }

    const project = projects[index];
    if (!project.name) {
      toast({
        title: "تنبيه",
        description: "الرجاء إضافة اسم المشروع أولاً",
        variant: "destructive",
      });
      return;
    }

    setEnhancingProject(index);
    try {
      const { data: result, error } = await supabase.functions.invoke("enhance-with-ai", {
        body: { text: project.name, type: "generate_project_description" },
      });

      if (error) throw error;

      if (result?.enhancedText) {
        updateProject(index, "description", result.enhancedText);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء وصف احترافي للمشروع",
        });
      }
    } catch (error: any) {
      console.error("Error generating description:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل إنشاء الوصف",
        variant: "destructive",
      });
    } finally {
      setEnhancingProject(null);
    }
  };

  const suggestTechnologies = async (index: number) => {
    if (!hasPaid || planType !== 'professional') {
      setShowPaymentDialog(true);
      return;
    }

    const project = projects[index];
    if (!project.name) {
      toast({
        title: "تنبيه",
        description: "الرجاء إضافة اسم المشروع أولاً",
        variant: "destructive",
      });
      return;
    }

    setGeneratingTech(index);
    try {
      // Build context including job title and experiences to understand the field
      const jobTitle = data.personalInfo?.jobTitle || "";
      const experiences = data.experiences || [];

      let context = `المشروع: ${project.name}`;
      if (project.description) {
        context += `\nالوصف: ${project.description}`;
      }
      if (jobTitle) {
        context += `\nالمجال المهني: ${jobTitle}`;
      }
      if (experiences.length > 0) {
        context += `\nالخبرات: ${experiences.map((exp: any) => exp.position).filter(Boolean).join(", ")}`;
      }

      const { data: result, error } = await supabase.functions.invoke("enhance-with-ai", {
        body: { text: context, type: "suggest_technologies" },
      });

      if (error) throw error;

      if (result?.enhancedText) {
        updateProject(index, "technologies", result.enhancedText);
        await incrementAiRequests(); // Update counter in database
        toast({
          title: "تم الاقتراح بنجاح",
          description: "تم اقتراح تقنيات مناسبة للمشروع",
        });
      }
    } catch (error: any) {
      console.error("Error suggesting technologies:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل اقتراح التقنيات",
        variant: "destructive",
      });
    } finally {
      setGeneratingTech(null);
    }
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      updateData("hobbies", [...hobbies, newHobby.trim()]);
      setNewHobby("");
    }
  };

  const removeHobby = (index: number) => {
    const updated = hobbies.filter((_: any, i: number) => i !== index);
    updateData("hobbies", updated);
  };

  return (
    <>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        feature="ميزات الذكاء الاصطناعي للمشاريع"
      />

      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            أضف معلومات إضافية لتعزيز سيرتك الذاتية (كلها اختيارية).
          </p>
        </div>

        <Tabs defaultValue="languages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="languages">اللغات</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="hobbies">الهوايات</TabsTrigger>
          </TabsList>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4 mt-6">
            {languages.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-3">لم تضف أي لغة بعد</p>
                <Button onClick={addLanguage} variant="outline" size="sm">
                  <Plus className="ml-2 h-4 w-4" />
                  أضف لغة
                </Button>
              </div>
            ) : (
              <>
                {languages.map((lang: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اللغة</Label>
                        <Input
                          placeholder="مثال: الإنجليزية"
                          value={lang.name}
                          onChange={(e) => updateLanguage(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>مستوى الإتقان</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Select
                          value={lang.proficiency}
                          onValueChange={(value) => updateLanguage(index, "proficiency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="اللغة الأم">اللغة الأم</SelectItem>
                            <SelectItem value="ممتاز">ممتاز (طلاقة كاملة)</SelectItem>
                            <SelectItem value="جيد جدًا">جيد جدًا (محادثة وكتابة)</SelectItem>
                            <SelectItem value="جيد">جيد (محادثة أساسية)</SelectItem>
                            <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button onClick={addLanguage} variant="outline" className="w-full">
                  <Plus className="ml-2 h-4 w-4" />
                  أضف لغة أخرى
                </Button>
              </>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 mt-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-3">لم تضف أي مشروع بعد</p>
                <Button onClick={addProject} variant="outline" size="sm">
                  <Plus className="ml-2 h-4 w-4" />
                  أضف مشروع
                </Button>
              </div>
            ) : (
              <>
                {projects.map((project: any, index: number) => (
                  <Card key={index} className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">مشروع {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>اسم المشروع</Label>
                      <Input
                        placeholder="مثال: تطبيق إدارة المهام"
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>وصف مختصر (حتى 200 حرف)</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateProjectDescription(index)}
                          disabled={!project.name || enhancingProject === index}
                        >
                          <Sparkles className="h-4 w-4 ml-2" />
                          {enhancingProject === index ? "جاري الإنشاء..." : "AI إنشاء"}
                        </Button>
                      </div>
                      <Textarea
                        placeholder="وصف المشروع وما حققته فيه..."
                        value={project.description}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        rows={3}
                        maxLength={200}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>التقنيات المستخدمة</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => suggestTechnologies(index)}
                            disabled={!project.name || generatingTech === index}
                          >
                            <Sparkles className="h-4 w-4 ml-2" />
                            {generatingTech === index ? "..." : "AI"}
                          </Button>
                        </div>
                        <Input
                          placeholder="React, Node.js, MongoDB"
                          value={project.technologies}
                          onChange={(e) => updateProject(index, "technologies", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>تاريخ الإنجاز</Label>
                        <Input
                          type="month"
                          value={project.date}
                          onChange={(e) => updateProject(index, "date", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>رابط المشروع (GitHub, موقع، إلخ)</Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={project.link}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                      />
                    </div>
                  </Card>
                ))}
                <Button onClick={addProject} variant="outline" className="w-full">
                  <Plus className="ml-2 h-4 w-4" />
                  أضف مشروع آخر
                </Button>
              </>
            )}
          </TabsContent>

          {/* Hobbies Tab */}
          <TabsContent value="hobbies" className="space-y-4 mt-6">
            <div className="space-y-3">
              <Label>إضافة هواية جديدة</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="مثال: القراءة، الرياضة، التصوير"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHobby()}
                />
                <Button onClick={addHobby} disabled={!newHobby.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {hobbies.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">لم تضف أي هواية بعد</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>هواياتك ({hobbies.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby: string, index: number) => (
                    <div
                      key={index}
                      className="bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
                    >
                      {hobby}
                      <button
                        onClick={() => removeHobby(index)}
                        className="hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-2">💡 نصيحة:</h4>
          <p className="text-sm text-muted-foreground">
            المعلومات الإضافية تساعد في إظهار شخصيتك وتمييزك عن المتقدمين الآخرين. لكن تذكر أن تبقيها مهنية وذات صلة بالوظيفة.
          </p>
        </div>
      </div>
    </>
  );
};

export default AdditionalStep;