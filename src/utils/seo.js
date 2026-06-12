/**
 * SEO Utilities & Structured Data Schemas
 * Craftech — Premium Construction & MEP Services
 */

// Base configuration
export const SEO_CONFIG = {
  siteName: 'Craftech Engineers',
  siteUrl: 'https://craftechengineers.com',
  twitterHandle: '@craftech_eng',
  phone: '+91 93248 77493',
  email: 'info@craftechengineers.com',
  address: 'Mumbai, Maharashtra, India',
};

/**
 * Generate Organization Structured Data (schema.org)
 * Helps Google understand your business
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Craftech Engineers Pvt. Ltd.',
  description: 'Premium construction, MEP execution, and interior fit-outs across Mumbai',
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}/logo.png`,
  sameAs: [
    'https://www.instagram.com/craftech_eng',
    'https://www.linkedin.com/company/craftech-engineers',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: SEO_CONFIG.phone,
    email: SEO_CONFIG.email,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
    addressCountry: 'IN',
  },
  foundingDate: '2012',
  areaServed: 'IN',
});

/**
 * Generate LocalBusiness Schema
 * Improves local SEO ranking
 */
export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SEO_CONFIG.siteUrl}/#local-business`,
  name: 'Craftech Engineers',
  image: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
  description: 'Expert construction, MEP systems, and interior design company',
  url: SEO_CONFIG.siteUrl,
  telephone: SEO_CONFIG.phone,
  email: SEO_CONFIG.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mumbai',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
    addressCountry: 'IN',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '18:00',
  },
  priceRange: '₹₹₹',
});

/**
 * Generate Product/Service Schema
 * Describe what services you offer
 */
export const generateServiceSchema = (services) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((service, i) => ({
    '@type': 'Service',
    position: i + 1,
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Craftech Engineers',
    },
  })),
});

/**
 * Generate Article Schema (for case studies)
 */
export const generateArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Organization',
    name: 'Craftech Engineers',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Craftech Engineers',
    logo: {
      '@type': 'ImageObject',
      url: `${SEO_CONFIG.siteUrl}/logo.png`,
    },
  },
});

/**
 * Generate BreadcrumbList Schema
 * Improves navigation in search results
 */
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: `${SEO_CONFIG.siteUrl}${crumb.url}`,
  })),
});

/**
 * Generate FAQ Schema
 * Shows rich snippets in search results
 */
export const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Generate Aggregate Rating Schema
 * Shows star ratings in search results
 */
export const generateAggregateRatingSchema = (rating) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: rating.value,
  ratingCount: rating.count,
  reviewCount: rating.reviewCount,
  bestRating: 5,
  worstRating: 1,
});

/**
 * Meta tags object for common pages
 */
export const META_TAGS = {
  home: {
    title: 'Craftech Engineers | Premium Construction & MEP Solutions in Mumbai',
    description: 'Award-winning construction, MEP execution, and interior fit-outs. 12+ years of excellence delivering landmark projects across Mumbai.',
    keywords: 'construction, MEP, fit-out, architecture, builders, Mumbai',
    ogImage: `${SEO_CONFIG.siteUrl}/og-home.jpg`,
    ogType: 'website',
  },
  about: {
    title: 'About Craftech | Engineering Excellence Since 2012',
    description: 'Discover how Craftech Engineers has been transforming visions into iconic structures with precision engineering and architectural brilliance.',
    keywords: 'about craftech, construction company, MEP engineers',
    ogImage: `${SEO_CONFIG.siteUrl}/og-about.jpg`,
  },
  portfolio: {
    title: 'Portfolio | Craftech Engineering Projects',
    description: 'Explore our landmark construction projects, luxury fit-outs, and MEP installations across Mumbai.',
    keywords: 'construction projects, case studies, portfolio',
    ogImage: `${SEO_CONFIG.siteUrl}/og-portfolio.jpg`,
  },
  contact: {
    title: 'Contact Craftech | Get Your Free Quote',
    description: 'Get in touch with our team. We respond within 24 hours. Call +91 93248 77493 or WhatsApp for instant consultation.',
    keywords: 'contact craftech, construction quote, project enquiry',
    ogImage: `${SEO_CONFIG.siteUrl}/og-contact.jpg`,
  },
};

/**
 * Helper: Set meta tags dynamically
 * Use with React Helmet
 */
export const getMetaTags = (pageKey) => {
  const tags = META_TAGS[pageKey] || META_TAGS.home;
  return {
    title: tags.title,
    meta: [
      { name: 'description', content: tags.description },
      { name: 'keywords', content: tags.keywords },
      { property: 'og:title', content: tags.title },
      { property: 'og:description', content: tags.description },
      { property: 'og:image', content: tags.ogImage },
      { property: 'og:type', content: tags.ogType || 'website' },
      { property: 'og:url', content: SEO_CONFIG.siteUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: tags.title },
      { name: 'twitter:description', content: tags.description },
      { name: 'twitter:image', content: tags.ogImage },
      { name: 'twitter:creator', content: SEO_CONFIG.twitterHandle },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#0A2647' },
    ],
  };
};

/**
 * Canonical URL generator
 * Prevents duplicate content issues
 */
export const getCanonicalUrl = (path) => `${SEO_CONFIG.siteUrl}${path}`;

/**
 * JSON-LD Script generator
 * Wrap schema in script tag for HTML injection
 */
export const generateJsonLD = (schema) => ({
  __html: JSON.stringify(schema),
});

export default {
  SEO_CONFIG,
  META_TAGS,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  getMetaTags,
  getCanonicalUrl,
  generateJsonLD,
};
