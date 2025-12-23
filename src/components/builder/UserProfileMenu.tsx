import { useState } from "react";
import { User, LogOut, FileText, CreditCard, ChevronDown, LayoutDashboard, Home, PenTool, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UserProfileMenuProps {
  user: any;
  onSignOut: () => void;
  onOpenDrafts: () => void;
}

const UserProfileMenu = ({ user, onSignOut, onOpenDrafts }: UserProfileMenuProps) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    downloadsRemaining,
    aiRequestsRemaining,
    planType,
    hasPaid,
    isExpired,
    expiresAt
  } = usePaymentStatus();

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onSignOut();
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const planName = planType === 'professional' ? 'الباقة الاحترافية' : (planType === 'basic' ? 'الباقة الأساسية' : 'مجاني');
  const isPro = planType === 'professional';

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-muted/50 transition-colors p-0">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-background transition-all hover:ring-primary/20">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${hasPaid && !isExpired ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
          <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="p-6 pb-2">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-4 border-muted">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{user?.user_metadata?.full_name || "المستخدم"}</h3>
                  <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
                  <div className={`text-xs mt-1 inline-flex items-center px-2 py-0.5 rounded-full ${hasPaid && !isExpired ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {hasPaid && !isExpired ? planName : 'لا يوجد اشتراك فعال'}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Usage Stats Dashboard */}
            {hasPaid && !isExpired && (
              <div className="p-6 bg-muted/20">
                <h4 className="text-sm font-semibold mb-4 text-primary flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  حالة الاستخدام
                </h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">التحميلات المتبقية</span>
                      <span className="font-bold">{downloadsRemaining}</span>
                    </div>
                    <Progress value={(downloadsRemaining / (isPro ? 5 : 3)) * 100} className="h-2" />
                  </div>

                  {isPro && (
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">رصيد الذكاء الاصطناعي</span>
                        <span className="font-bold">{aiRequestsRemaining}</span>
                      </div>
                      <Progress value={(aiRequestsRemaining / 50) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <div className="p-4 flex-1">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12" onClick={() => handleNavigate("/")}>
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">الرئيسية</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 h-12" onClick={() => handleNavigate("/builder")}>
                  <PenTool className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">منشئ السيرة الذاتية</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 h-12" onClick={() => { setIsOpen(false); onOpenDrafts(); }}>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col items-start text-right">
                    <span className="text-base">مسوداتي</span>
                    <span className="text-xs text-muted-foreground font-normal">عرض السير الذاتية المحفوظة</span>
                  </div>
                </Button>

                <Button variant="ghost" className="w-full justify-start gap-3 h-12" onClick={() => { setIsOpen(false); setShowSubscriptionDialog(true); }}>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex flex-col items-start text-right">
                    <span className="text-base">تفاصيل الباقة</span>
                    <span className="text-xs text-muted-foreground font-normal">معلومات اشتراكك الحالي</span>
                  </div>
                </Button>
              </nav>
            </div>

            <Separator />

            {/* Footer */}
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-base">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Subscription Details Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل اشتراكك</DialogTitle>
            <DialogDescription>
              نظرة عامة على باقتك الحالية ومميزاتها
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">الباقة الحالية</span>
                <span className="text-xl font-bold text-primary mt-1">{hasPaid && !isExpired ? planName : "مجانية"}</span>
              </div>
              <Badge variant={hasPaid && !isExpired ? "default" : "secondary"}>
                {hasPaid && !isExpired ? "نشط" : "غير نشط"}
              </Badge>
            </div>

            {hasPaid && !isExpired ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg flex flex-col items-center text-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">ينتهي في</span>
                    <span className="font-bold text-sm">
                      {expiresAt ? formatDate(expiresAt) : (
                        // Fallback: created_at + 30 days if expiresAt is missing
                        user?.created_at ? formatDate(new Date(new Date(user.created_at).setDate(new Date(user.created_at).getDate() + 30)).toISOString()) : "-"
                      )}
                    </span>
                  </div>
                  <div className="p-3 border rounded-lg flex flex-col items-center text-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">المدة</span>
                    <span className="font-bold text-sm">30 يوم</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">المميزات المفعلة:</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {planType === 'professional' ? "5 تحميلات PDF عالية الدقة" : "3 تحميلات PDF عالية الدقة"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      حفظ البيانات {planType === 'professional' ? "(30 يوم)" : "(7 أيام)"}
                    </li>
                    {planType === 'professional' && (
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        رصيد 50 محسّن بالذكاء الاصطناعي
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2">
                  <Button onClick={() => { setShowSubscriptionDialog(false); navigate("/pricing"); }} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    تجديد الاشتراك / ترقية الباقة
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-muted-foreground">ليس لديك اشتراك نشط حالياً.</p>
                <Button onClick={() => navigate("/pricing")} className="w-full">تصفح الباقات</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserProfileMenu;
