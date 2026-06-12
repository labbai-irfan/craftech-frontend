import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getMetaTags, getCanonicalUrl, generateJsonLD } from '../../utils/seo';

/**
 * SEOHead Component
 * Manages all meta tags, structured data, and canonical URLs
 * Usage: <SEOHead page="home" title="Custom Title" schema={customSchema} />
 */
const SEOHead = ({
  page = 'home',
  title,
  description,
  image,
  schema,
  breadcrumbs,
  noindex = false,
  nofollow = false,
  path = '/',
}) => {
  const defaultTags = getMetaTags(page);
  const finalTitle = title || defaultTags.title;
  const finalDescription = description || defaultTags.meta.find(m => m.name === 'description')?.content;
  const finalImage = image || defaultTags.meta.find(m => m.property === 'og:image')?.content;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {noindex && <meta name="robots" content={`noindex${nofollow ? ', nofollow' : ''}`} />}
      {!noindex && !nofollow && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={getCanonicalUrl(path)} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={getCanonicalUrl(path)} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={generateJsonLD(schema)} />
      )}

      {/* Breadcrumb Schema */}
      {breadcrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateJsonLD({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.name,
              item: getCanonicalUrl(crumb.url),
            })),
          })}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://cdn.example.com" />
    </Helmet>
  );
};

export default SEOHead;
