import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO = ({ title, description, image, url, type = 'website' }: SEOProps) => {
    const siteName = 'SiraCV - سيرتي';
    const defaultDescription = 'أنشئ سيرتك الذاتية الاحترافية في دقائق باستخدام الذكاء الاصطناعي.';

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{`${title} | ${siteName}`}</title>
            <meta name="description" content={description || defaultDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description || defaultDescription} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="ar_SA" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description || defaultDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
