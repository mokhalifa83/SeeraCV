import { useState, useEffect } from "react";
import { FileText, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Draft {
  id: string;
  cv_data: any;
  updated_at: string;
}

interface DraftsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDraft: (draftId: string) => void;
}

const DraftsDialog = ({ open, onOpenChange, onLoadDraft }: DraftsDialogProps) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadDrafts();
    }
  }, [open]);

  const loadDrafts = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("cv_drafts")
      .select("*")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل المسودات",
        variant: "destructive",
      });
    } else {
      setDrafts(data || []);
    }
    setLoading(false);
  };

  const deleteDraft = async (id: string) => {
    const { error } = await supabase
      .from("cv_drafts")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف المسودة",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحذف",
        description: "تم حذف المسودة بنجاح",
      });
      loadDrafts();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>مسوداتي</DialogTitle>
          <DialogDescription>
            اختر مسودة لتعديلها أو احذف المسودات القديمة
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد مسودات محفوظة</p>
          </div>
        ) : (
          <div className="space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">
                    {draft.cv_data?.personalInfo?.fullName || "مسودة بدون اسم"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {draft.cv_data?.personalInfo?.jobTitle || "بدون مسمى وظيفي"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    آخر تحديث:{" "}
                    {formatDistanceToNow(new Date(draft.updated_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLoadDraft(draft.id);
                      onOpenChange(false);
                    }}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDraft(draft.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DraftsDialog;
