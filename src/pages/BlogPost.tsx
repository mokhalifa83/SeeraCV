import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import SEO from "@/components/SEO";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogCard from "@/components/blog/BlogCard";
import { Loader2, ArrowRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const item = await getBlogPostBySlug(slug);
                // @ts-ignore
                setPost(item);

                if (item) {
                    const related = await getRelatedPosts(slug);
                    // @ts-ignore
                    setRelatedPosts(related);
                }
            } catch (error) {
                console.error("Error fetching blog post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
        // Scroll to top when slug changes (navigating between posts)
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <BlogHeader />
                <div className="flex-grow flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold">المقال غير موجود</h1>
                    <Link to="/blog">
                        <Button>العودة للمدونة</Button>
                    </Link>
                </div>
                <BlogFooter />
            </div>
        );
    }

    const { title, content, featuredImage, category, publishedDate, excerpt } = post.fields;
    const imageUrl = featuredImage && 'fields' in featuredImage ? featuredImage.fields.file?.url : undefined;

    const renderOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                const { file, title } = node.data.target.fields;
                return (
                    <img
                        src={`https:${file.url}`}
                        alt={title}
                        className="my-8 h-auto w-full rounded-lg shadow-md"
                    />
                );
            },
            [BLOCKS.HEADING_2]: (node: any, children: any) => (
                <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground border-b pb-2">{children}</h2>
            ),
            [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
                <p className="mb-4 leading-relaxed text-muted-foreground text-lg">{children}</p>
            ),
            [INLINES.HYPERLINK]: (node: any, children: any) => (
                <a href={node.data.uri} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            ),
        },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO
                title={title}
                description={excerpt}
                image={imageUrl ? `https:${imageUrl}` : undefined}
                type="article"
            />

            <BlogHeader />

            {/* Hero Image */}
            {imageUrl && (
                <div className="relative h-[40vh] w-full md:h-[50vh]">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent/50" />
                    <img
                        src={`https:${imageUrl}`}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Content Container */}
            <article className="container relative z-10 mx-auto -mt-20 max-w-4xl px-4 flex-grow mb-12">
                <div className="rounded-2xl bg-card p-6 shadow-xl md:p-12 border">
                    {/* Header */}
                    <div className="mb-8 border-b pb-8">
                        <Link
                            to="/blog"
                            className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowRight className="ml-2 h-4 w-4" />
                            العودة للمدونة
                        </Link>

                        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {category && (
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
                                    <Tag className="h-3 w-3" />
                                    <span>{category}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <time dateTime={publishedDate}>
                                    {format(new Date(publishedDate), "d MMMM yyyy", { locale: ar })}
                                </time>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
                            {title}
                        </h1>
                    </div>

                    {/* Rich Text Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {documentToReactComponents(content, renderOptions)}
                    </div>
                </div>
            </article>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <section className="bg-muted/30 py-16">
                    <div className="container px-4">
                        <h2 className="text-3xl font-bold mb-8 text-center">مقالات ذات صلة</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((post) => (
                                <BlogCard key={post.sys.id} post={post} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <BlogFooter />
        </div>
    );
};

export default BlogPostPage;
