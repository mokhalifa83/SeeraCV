import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPostBySlug, BlogPost } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import SEO from "@/components/SEO";
import { Loader2, ArrowRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const item = await getBlogPostBySlug(slug);
                // @ts-ignore
                setPost(item);
            } catch (error) {
                console.error("Error fetching blog post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">المقال غير موجود</h1>
                <Link to="/blog">
                    <Button>العودة للمدونة</Button>
                </Link>
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
                        className="my-8 h-auto w-full rounded-lg"
                    />
                );
            },
            [BLOCKS.HEADING_2]: (node: any, children: any) => (
                <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">{children}</h2>
            ),
            [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
                <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
            ),
            [INLINES.HYPERLINK]: (node: any, children: any) => (
                <a href={node.data.uri} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            ),
        },
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title={title}
                description={excerpt}
                image={imageUrl ? `https:${imageUrl}` : undefined}
                type="article"
            />

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
            <article className="container relative z-10 mx-auto -mt-20 max-w-3xl px-4">
                <div className="rounded-2xl bg-card p-6 shadow-xl md:p-10">
                    {/* Header */}
                    <div className="mb-8 border-b pb-8">
                        <Link
                            to="/blog"
                            className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            <ArrowRight className="ml-2 h-4 w-4" />
                            العودة للمدونة
                        </Link>

                        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {category && (
                                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
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
        </div>
    );
};

export default BlogPostPage;
