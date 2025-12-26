import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

const BlogFooter = () => {
    return (
        <footer className="bg-background border-t py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl text-primary">مدونة سيرتي</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                            الرئيسية
                        </Link>
                        <Link to="/builder" className="text-muted-foreground hover:text-primary transition-colors">
                            أنشئ سيرتك الذاتية
                        </Link>
                        <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                            الأسعار
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <Button variant="outline" className="gap-2">
                                <ArrowRight className="h-4 w-4" />
                                العودة للموقع الرئيسي
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} سيرتي. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default BlogFooter;
