import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowRight, Palette } from "lucide-react";
import TemplatePreview from "@/components/builder/TemplatePreview";
import ClassicTemplate from "@/components/builder/templates/ClassicTemplate";
import MinimalTemplate from "@/components/builder/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/builder/templates/ProfessionalTemplate";
import OrangeTemplate from "@/components/builder/templates/OrangeTemplate";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentDialog } from "@/components/PaymentDialog";
import { loadCvDataFromStorage, saveCvDataToStorage } from "@/hooks/useCvDataPersistence";

const Preview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [cvData, setCvData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const previewRef = useRef<HTMLDivElement>(null);
  const { hasPaid, incrementDownloads, downloadsRemaining } = usePaymentStatus();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    loadCvData();
  }, []);

  const loadCvData = async () => {
    const draftId = searchParams.get("draftId");

    // Priority 1: Load from draftId in database
    if (draftId) {
      console.log("Preview: Loading from draftId:", draftId);
      const { data, error } = await supabase
        .from("cv_drafts")
        .select("cv_data")
        .eq("id", draftId)
        .maybeSingle();

      if (data && !error) {
        console.log("Preview: Loaded from database successfully");
        setCvData(data.cv_data);
        // Sync to localStorage for consistency
        saveCvDataToStorage(data.cv_data);
        setLoading(false);
        return;
      }

      if (error) {
        console.error("Error loading draft:", error);
      }
    }

    // Priority 2: Load from localStorage
    console.log("Preview: Loading from localStorage");
    const localData = loadCvDataFromStorage();
    if (localData) {
      console.log("Preview: Loaded from localStorage successfully");
      setCvData(localData);
      setLoading(false);
      return;
    }

    console.log("Preview: No data found");
    setLoading(false);
  };

  /* 
     We are now using react-to-print for robust PDF generation.
     This hook handles the iframe creation and print dialog triggering.
  */
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'السيرة الذاتية',
    onAfterPrint: () => {
      setDownloading(false);
      toast({
        title: "تمت العملية",
        description: "شكراً لاستخدامك سيرتي",
      });
    },
    onBeforePrint: () => {
      setDownloading(true);
      return Promise.resolve();
    },
    onPrintError: (errorLocation, error) => {
      setDownloading(false);
      console.error("Print error:", errorLocation, error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الطباعة",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async () => {
    if (!hasPaid) {
      setShowPaymentDialog(true);
      return;
    }

    // Check if user has downloads remaining
    if (downloadsRemaining <= 0) {
      toast({
        title: "عفواً، لقد استهلكت رصيد التحميل",
        description: "يرجى الترقية أو تجديد الباقة للحصول على المزيد من التحميلات",
        variant: "destructive",
      });
      return;
    }

    if (downloading) return;

    setDownloading(true);
    try {
      // 1. Check and increment usage limit using the hook method
      await incrementDownloads();

      // 2. If successful, proceed with download
      if (previewRef.current) {
        handlePrint();
      }
    } catch (error: any) {
      setDownloading(false);
      console.error("Download error:", error);

      // Parse error message for better user feedback
      let errorTitle = "خطأ";
      let errorMessage = error.message || "حدث خطأ أثناء التحميل";

      if (error.message?.includes("No downloads remaining")) {
        errorTitle = "عفواً، لقد استهلكت رصيد التحميل";
        errorMessage = "يرجى الترقية أو تجديد الباقة للحصول على المزيد من التحميلات";
      } else if (error.message?.includes("expired")) {
        errorTitle = "انتهت صلاحية الباقة";
        errorMessage = "يرجى تجديد اشتراكك للمتابعة";
      } else if (error.message?.includes("No active payment")) {
        errorTitle = "لا يوجد اشتراك نشط";
        errorMessage = "يرجى الاشتراك في إحدى الباقات للتحميل";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">لا توجد بيانات للمعاينة</h2>
          <p className="text-muted-foreground mb-4">الرجاء إنشاء سيرة ذاتية أولاً</p>
          <Button onClick={() => navigate("/builder")}>
            العودة للمنشئ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        feature="تحميل السيرة الذاتية"
      />

      <div className="min-h-screen bg-muted/20">
        {/* Header */}
        <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">معاينة السيرة الذاتية</span>
              </div>

              <div className="flex items-center gap-4">
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

                <Button variant="outline" onClick={() => {
                  // Ensure data is saved before navigating
                  console.log("Edit button clicked, saving data and navigating...");
                  saveCvDataToStorage(cvData);
                  const draftId = searchParams.get("draftId");
                  const targetUrl = `/builder${draftId ? `?draftId=${draftId}` : ""}`;
                  console.log("Navigating to:", targetUrl);
                  navigate(targetUrl);
                }}>
                  <ArrowRight className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
                <Button
                  onClick={handleDownload}
                  className="gradient-primary"
                  disabled={downloading}
                >
                  <Download className="ml-2 h-4 w-4" />
                  {downloading ? "جاري التحميل..." : "تحميل PDF"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Preview Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-medium p-8" ref={previewRef} id="cv-print-content">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
