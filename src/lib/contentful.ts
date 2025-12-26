import { createClient, EntryFieldTypes, EntrySkeletonType } from "contentful";

export const contentfulClient = createClient({
    space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
    accessToken: import.meta.env.DEV
        ? import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || ''
        : import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
    host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

export interface BlogPostSkeleton extends EntrySkeletonType {
    contentTypeId: 'blogPostForSeeraCv';
    fields: {
        title: EntryFieldTypes.Text;
        slug: EntryFieldTypes.Text;
        excerpt: EntryFieldTypes.Text;
        featuredImage: EntryFieldTypes.AssetLink;
        content: EntryFieldTypes.RichText;
        category: EntryFieldTypes.Text;
        publishedDate: EntryFieldTypes.Date;
    };
}

// Helper type for the response entry
export type BlogPost = {
    sys: {
        id: string;
        createdAt: string;
        updatedAt: string;
    };
    fields: {
        title: string;
        slug: string;
        excerpt?: string;
        featuredImage: {
            fields: {
                file: {
                    url: string;
                };
                title?: string;
            };
        };
        content: any;
        category?: string;
        publishedDate: string;
    };
};

export const getBlogPosts = async () => {
    const response = await contentfulClient.getEntries<BlogPostSkeleton>({
        content_type: "blogPostForSeeraCv",
        order: ["-fields.publishedDate"],
    });
    return response.items;
};

export const getBlogPostBySlug = async (slug: string) => {
    const response = await contentfulClient.getEntries<BlogPost>({
        content_type: "blogPostForSeeraCv",
        "fields.slug": slug,
        limit: 1,
    });
    return response.items[0];
};
