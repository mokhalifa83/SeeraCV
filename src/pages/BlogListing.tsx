import { useEffect, useState } from "react";
import { getBlogPosts, BlogPost } from "@/lib/contentful";
import BlogCard from "@/components/blog/BlogCard";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";

const BlogListing = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const items = await getBlogPosts();
                // @ts-ignore
                setPosts(items);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO title="المدونة" description="نصائح ومقالات حول كتابة السيرة الذاتية والبحث عن وظيفة" />

            {/* Header */}
            <div className="bg-primary/5 py-16 md:py-24">
                <div className="container px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
                        مدونة سيرتي
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        كل ما تحتاج معرفته عن كتابة السيرة الذاتية، المقابلات الشخصية، وتطوير مسارك المهني.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container px-4 py-12">
                {loading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <BlogCard key={post.sys.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-lg text-muted-foreground">لا توجد مقالات منشورة حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListing;
