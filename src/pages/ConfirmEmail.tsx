import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const confirmEmail = async () => {
            // Get token_hash and type from URL parameters
            const token_hash = searchParams.get("token_hash");
            const type = searchParams.get("type");

            if (!token_hash || !type) {
                setStatus("error");
                setErrorMessage("رابط التأكيد غير صالح. الرجاء التحقق من الرابط المرسل إلى بريدك الإلكتروني.");
                return;
            }

            try {
                // Verify OTP using Supabase
                const { error } = await supabase.auth.verifyOtp({
                    token_hash,
                    type: type as any,
                });

                if (error) {
                    setStatus("error");
                    setErrorMessage(
                        error.message === "Token has expired or is invalid"
                            ? "انتهت صلاحية رابط التأكيد. الرجاء طلب رابط جديد."
                            : error.message
                    );
                } else {
                    setStatus("success");
                }
            } catch (error) {
                setStatus("error");
                setErrorMessage("حدث خطأ أثناء تأكيد البريد الإلكتروني. الرجاء المحاولة مرة أخرى.");
            }
        };

        confirmEmail();
    }, [searchParams]);

    // Auto-redirect countdown after success
    useEffect(() => {
        if (status === "success" && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (status === "success" && countdown === 0) {
            navigate("/builder");
        }
    }, [status, countdown, navigate]);

    const handleManualRedirect = () => {
        navigate("/builder");
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
                                <CardTitle>جاري تأكيد البريد الإلكتروني...</CardTitle>
                                <CardDescription>
                                    الرجاء الانتظار بينما نقوم بتأكيد حسابك
                                </CardDescription>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-green-600 dark:text-green-400">
                                    تم تأكيد البريد الإلكتروني بنجاح! 🎉
                                </CardTitle>
                                <CardDescription>
                                    مرحباً بك في سيرتي! يمكنك الآن البدء في إنشاء سيرتك الذاتية الاحترافية.
                                </CardDescription>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                </div>
                                <CardTitle className="text-red-600 dark:text-red-400">
                                    فشل تأكيد البريد الإلكتروني
                                </CardTitle>
                                <CardDescription className="text-red-600/80 dark:text-red-400/80">
                                    {errorMessage}
                                </CardDescription>
                            </>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {status === "success" && (
                            <>
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        سيتم توجيهك تلقائياً إلى لوحة التحكم خلال
                                    </p>
                                    <p className="text-3xl font-bold text-primary">{countdown}</p>
                                    <p className="text-sm text-muted-foreground mt-1">ثواني</p>
                                </div>
                                <Button
                                    onClick={handleManualRedirect}
                                    className="w-full gradient-primary"
                                >
                                    الانتقال إلى لوحة التحكم الآن
                                </Button>
                            </>
                        )}

                        {status === "error" && (
                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate("/auth?tab=signup")}
                                    className="w-full"
                                    variant="outline"
                                >
                                    العودة إلى التسجيل
                                </Button>
                                <Button
                                    onClick={() => navigate("/auth?tab=signin")}
                                    className="w-full gradient-primary"
                                >
                                    تسجيل الدخول
                                </Button>
                            </div>
                        )}

                        {status === "loading" && (
                            <div className="flex justify-center">
                                <div className="animate-pulse flex space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
                                </div>
                            </div>
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

export default ConfirmEmail;
