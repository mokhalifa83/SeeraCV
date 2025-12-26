import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FileText, ArrowRight, ArrowLeft, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveCvDataToStorage, loadCvDataFromStorage, associateUserWithStoredData, clearStoredCvData, getEmptyCvData } from "@/hooks/useCvDataPersistence";
import UserProfileMenu from "@/components/builder/UserProfileMenu";
import DraftsDialog from "@/components/builder/DraftsDialog";
import PlanBadge from "@/components/builder/PlanBadge";
import PersonalInfoStep from "@/components/builder/PersonalInfoStep";
import SummaryStep from "@/components/builder/SummaryStep";
import ExperienceStep from "@/components/builder/ExperienceStep";
import EducationStep from "@/components/builder/EducationStep";
import SkillsStep from "@/components/builder/SkillsStep";
import CertificatesStep from "@/components/builder/CertificatesStep";
import AdditionalStep from "@/components/builder/AdditionalStep";
import TemplatePreview from "@/components/builder/TemplatePreview";
import ClassicTemplate from "@/components/builder/templates/ClassicTemplate";
import MinimalTemplate from "@/components/builder/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/builder/templates/ProfessionalTemplate";
import OrangeTemplate from "@/components/builder/templates/OrangeTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Builder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftsDialogOpen, setDraftsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [isInitialized, setIsInitialized] = useState(false);
  const [cvData, setCvData] = useState(getEmptyCvData());

  useEffect(() => {
    const initializeBuilder = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check user ownership of stored data
      const storedUserId = localStorage.getItem("cvDataUserId");
      const isCurrentUser = storedUserId === session.user.id;

      if (!isCurrentUser) {
        // Different user - clear old data and associate new user
        clearStoredCvData();
        associateUserWithStoredData(session.user.id);
      }

      // Get draftId from URL
      const draftIdParam = searchParams.get('draftId');

      let dataLoaded = false;

      // Priority 1: Load from draftId if provided
      if (draftIdParam) {
        console.log("Loading draft from database:", draftIdParam);
        const loaded = await loadDraftById(draftIdParam, session.user.id);
        if (loaded) {
          dataLoaded = true;
        }
      }

      // Priority 2: Load from localStorage (if same user and no draft loaded)
      if (!dataLoaded && isCurrentUser) {
        const savedData = loadCvDataFromStorage();
        if (savedData) {
          console.log("Loading CV data from localStorage");
          setCvData(savedData);
          dataLoaded = true;
        }
      }

      setIsInitialized(true);

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          clearStoredCvData();
          navigate("/auth");
        } else if (event === "SIGNED_IN" && session) {
          const storedId = localStorage.getItem("cvDataUserId");
          if (storedId !== session.user.id) {
            clearStoredCvData();
            associateUserWithStoredData(session.user.id);
            setCvData(getEmptyCvData());
          }
          setUser(session.user);
        }
      });

      return () => subscription.unsubscribe();
    };

    initializeBuilder();
  }, [searchParams]);

  // Auto-save to localStorage whenever cvData changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCvDataToStorage(cvData);
    }
  }, [cvData, isInitialized]);

  const loadDraftById = async (id: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("cv_drafts")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (data && !error) {
        setCvData(data.cv_data as any);
        setDraftId(data.id);
        // Also save to localStorage for backup
        saveCvDataToStorage(data.cv_data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading draft:", error);
      return false;
    }
  };

  const loadDraft = async (id?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (id) {
      await loadDraftById(id, session.user.id);
    }
  };

  const saveDraft = async () => {
    if (!user) {
      toast({
        title: "تنبيه",
        description: "يجب تسجيل الدخول لحفظ المسودة",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (draftId) {
        // تحديث المسودة الموجودة
        const { error } = await supabase
          .from("cv_drafts")
          .update({ cv_data: cvData })
          .eq("id", draftId);

        if (error) throw error;
      } else {
        // إنشاء مسودة جديدة
        const { data, error } = await supabase
          .from("cv_drafts")
          .insert({ user_id: user.id, cv_data: cvData })
          .select()
          .single();

        if (error) throw error;
        if (data) setDraftId(data.id);
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ مسودتك",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ المسودة",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const steps = [
    { number: 1, title: "المعلومات الشخصية", component: PersonalInfoStep },
    { number: 2, title: "الملخص المهني", component: SummaryStep },
    { number: 3, title: "الخبرات العملية", component: ExperienceStep },
    { number: 4, title: "التعليم", component: EducationStep },
    { number: 5, title: "المهارات", component: SkillsStep },
    { number: 6, title: "الشهادات والدورات", component: CertificatesStep },
    { number: 7, title: "معلومات إضافية", component: AdditionalStep },
  ];

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCvData = (field: string, data: any) => {
    setCvData(prev => ({ ...prev, [field]: data }));
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "professional":
        return <ProfessionalTemplate data={cvData} />;
      case "classic":
        return <ClassicTemplate data={cvData} />;
      case "minimal":
        return <MinimalTemplate data={cvData} />;
      case "orange":
        return <OrangeTemplate data={cvData} />;
      default:
        return <TemplatePreview data={cvData} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="font-bold text-sm md:text-base text-primary">سيرتي</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              <PlanBadge />
              <div className="hidden lg:block text-sm text-muted-foreground">
                الخطوة {currentStep} من {steps.length}: {steps[currentStep - 1].title}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={saving}
                className="text-xs md:text-sm"
              >
                {saving ? "..." : <span className="hidden sm:inline">حفظ المسودة</span>}<span className="sm:hidden">💾</span>
              </Button>
              {user && (
                <UserProfileMenu
                  user={user}
                  onSignOut={handleSignOut}
                  onOpenDrafts={() => setDraftsDialogOpen(true)}
                />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-between mt-4 overflow-x-auto pb-2">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`flex flex-col items-center gap-1 min-w-[80px] transition-all ${currentStep === step.number
                  ? "text-primary"
                  : currentStep > step.number
                    ? "text-accent"
                    : "text-muted-foreground"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep === step.number
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : currentStep > step.number
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted"
                    }`}
                >
                  {step.number}
                </div>
                <span className="text-xs text-center hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Form Section */}
          <div className="bg-background rounded-2xl shadow-medium p-4 md:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
              <p className="text-muted-foreground">املأ المعلومات المطلوبة بعناية</p>
            </div>

            <div className="min-h-[400px]">
              <CurrentStepComponent
                data={cvData}
                updateData={updateCvData}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                السابق
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="gradient-primary">
                  التالي
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gradient-secondary"
                  onClick={() => {
                    localStorage.setItem("cvData", JSON.stringify(cvData));
                    navigate(`/preview${draftId ? `?draftId=${draftId}` : ""}`);
                  }}
                >
                  معاينة السيرة الذاتية
                </Button>
              )}
            </div>
          </div>

          {/* Preview Section - Hidden on mobile */}
          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div className="bg-background rounded-2xl shadow-medium p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">المعاينة الفورية</h3>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-[180px]">
                    <Palette className="ml-2 h-4 w-4 flex-shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">القالب الافتراضي</SelectItem>
                    <SelectItem value="professional">قالب احترافي</SelectItem>
                    <SelectItem value="classic">قالب كلاسيكي</SelectItem>
                    <SelectItem value="minimal">قالب بسيط</SelectItem>
                    <SelectItem value="orange">قالب عصري</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      <DraftsDialog
        open={draftsDialogOpen}
        onOpenChange={setDraftsDialogOpen}
        onLoadDraft={loadDraft}
      />

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-12 bg-background/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">سيرتي</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} سيرتي. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/blog" className="hover:text-primary transition-colors">المدونة</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Builder;
