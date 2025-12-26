import { useEffect, useState } from "react";
import { getBlogPosts, BlogPost } from "@/lib/contentful";
import BlogCard from "@/components/blog/BlogCard";
import SEO from "@/components/SEO";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogListing = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    // Extract unique categories from posts for filter buttons
    const categories = Array.from(new Set(posts.map(post => post.fields.category).filter(Boolean))) as string[];

    const filteredPosts = selectedCategory
        ? posts.filter(post => post.fields.category === selectedCategory)
        : posts;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO title="المدونة" description="نصائح ومقالات حول كتابة السيرة الذاتية والبحث عن وظيفة" />

            <BlogHeader />

            {/* Header */}
            <div className="bg-primary/5 py-12 md:py-16">
                <div className="container px-4 text-center">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-5xl">
                        مدونة سيرتي
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
                        كل ما تحتاج معرفته عن كتابة السيرة الذاتية، المقابلات الشخصية، وتطوير مسارك المهني.
                    </p>

                    {/* Filter Buttons (Tag Balloons) */}
                    <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            onClick={() => setSelectedCategory(null)}
                            className="rounded-full"
                        >
                            الكل
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="container px-4 py-12 flex-grow">
                {loading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.sys.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-lg text-muted-foreground">لا توجد مقالات منشورة حالياً.</p>
                    </div>
                )}
            </main>

            <BlogFooter />
        </div>
    );
};

export default BlogListing;
