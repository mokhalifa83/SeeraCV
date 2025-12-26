import { Link } from "react-router-dom";
import { BlogPost } from "@/lib/contentful";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface BlogCardProps {
    post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
    const { title, slug, excerpt, featuredImage, category, publishedDate } = post.fields;
    const imageUrl = featuredImage && 'fields' in featuredImage ? featuredImage.fields.file?.url : undefined;

    return (
        <Link to={`/blog/${slug}`} className="block h-full transition-transform hover:-translate-y-1">
            <Card className="h-full overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                    {imageUrl ? (
                        <img
                            src={`https:${imageUrl}`}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                            لا توجد صورة
                        </div>
                    )}
                </div>
                <CardHeader className="p-4 pb-2">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        {category && (
                            <Badge variant="secondary" className="font-normal text-xs">
                                {category}
                            </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <time dateTime={publishedDate}>
                                {format(new Date(publishedDate), "d MMMM yyyy", { locale: ar })}
                            </time>
                        </div>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-foreground">
                        {title}
                    </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {excerpt}
                    </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-auto">
                    <span className="text-sm font-medium text-primary md:text-xs">اقرأ المزيد ←</span>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default BlogCard;
