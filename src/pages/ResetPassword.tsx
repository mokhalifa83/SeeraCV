import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [status, setStatus] = useState<"loading" | "form" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            // Get token from URL hash fragment
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const access_token = hashParams.get("access_token");
            const type = hashParams.get("type");
            const error = hashParams.get("error");

            // Handle errors in URL
            if (error) {
                setStatus("error");
                setErrorMessage("انتهت صلاحية رابط إعادة تعيين كلمة المرور. الرجاء طلب رابط جديد.");
                return;
            }

            if (!access_token || type !== "recovery") {
                setStatus("error");
                setErrorMessage("رابط إعادة تعيين كلمة المرور غير صالح.");
                return;
            }

            // Set the session with the access token
            const { error: sessionError } = await supabase.auth.setSession({
                access_token,
                refresh_token: hashParams.get("refresh_token") || "",
            });

            if (sessionError) {
                setStatus("error");
                setErrorMessage("حدث خطأ في التحقق من الرابط. الرجاء المحاولة مرة أخرى.");
            } else {
                setStatus("form");
            }
        };

        verifyToken();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            toast({
                title: "خطأ",
                description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                variant: "destructive",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "خطأ",
                description: "كلمات المرور غير متطابقة",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        setIsSubmitting(false);

        if (error) {
            toast({
                title: "خطأ",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setStatus("success");
            toast({
                title: "تم بنجاح",
                description: "تم تغيير كلمة المرور بنجاح",
            });

            // Redirect to builder after 3 seconds
            setTimeout(() => {
                navigate("/builder");
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md">
                <Link to="/" className="flex items-center gap-2 justify-center mb-8">
                    <FileText className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-primary">سيرتي</h1>
                </Link>

                <Card>
                    <CardHeader className="text-center">
                        {status === "loading" && (
                            <>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                                <CardTitle>جاري التحقق من الرابط...</CardTitle>
                                <CardDescription>
                                    الرجاء الانتظار
                                </CardDescription>
                            </>
                        )}

                        {status === "form" && (
                            <>
                                <CardTitle>تعيين كلمة مرور جديدة</CardTitle>
                                <CardDescription>
                                    أدخل كلمة المرور الجديدة لحسابك
                                </CardDescription>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-green-600 dark:text-green-400">
                                    تم تغيير كلمة المرور بنجاح! 🎉
                                </CardTitle>
                                <CardDescription>
                                    سيتم توجيهك إلى لوحة التحكم...
                                </CardDescription>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                </div>
                                <CardTitle className="text-red-600 dark:text-red-400">
                                    خطأ في إعادة تعيين كلمة المرور
                                </CardTitle>
                                <CardDescription className="text-red-600/80 dark:text-red-400/80">
                                    {errorMessage}
                                </CardDescription>
                            </>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {status === "form" && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="8 أحرف على الأقل"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="أعد إدخال كلمة المرور"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full gradient-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "جاري التحديث..." : "تحديث كلمة المرور"}
                                </Button>
                            </form>
                        )}

                        {status === "error" && (
                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate("/auth?tab=forgot")}
                                    className="w-full"
                                    variant="outline"
                                >
                                    طلب رابط جديد
                                </Button>
                                <Button
                                    onClick={() => navigate("/auth?tab=signin")}
                                    className="w-full gradient-primary"
                                >
                                    تسجيل الدخول
                                </Button>
                            </div>
                        )}

                        {status === "success" && (
                            <Button
                                onClick={() => navigate("/builder")}
                                className="w-full gradient-primary"
                            >
                                الانتقال إلى لوحة التحكم
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        العودة إلى الصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
