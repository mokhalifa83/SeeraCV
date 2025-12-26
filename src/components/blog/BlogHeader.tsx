import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserProfileMenu from "@/components/builder/UserProfileMenu";

const BlogHeader = () => {
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <header className="bg-background border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg md:text-xl text-primary">مدونة سيرتي</span>
                    </Link>
                </div>

                <nav className="flex gap-2 md:gap-4 items-center">
                    <Link to="/" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-primary transition-colors">
                        الرئيسية
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Button onClick={() => navigate("/builder")} variant="outline" size="sm" className="hidden sm:flex">
                                لوحة التحكم
                            </Button>
                            <UserProfileMenu
                                user={session.user}
                                onSignOut={handleSignOut}
                                onOpenDrafts={() => navigate("/builder")}
                            />
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:inline-block">
                                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="gradient-primary" size="sm">ابدأ الآن</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default BlogHeader;
