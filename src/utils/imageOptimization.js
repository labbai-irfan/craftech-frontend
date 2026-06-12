/**
 * Image Optimization Utilities
 * Cloudinary-based image transformation for performance
 */

const CLOUDINARY_CLOUD_NAME = 'dcx2gs6mm';

/**
 * Generate optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary')) return url;

  const {
    width = 1200,
    height,
    quality = 'auto',
    format = 'auto',
    fit = 'fill',
    gravity = 'auto',
  } = options;

  // Extract public ID from URL
  const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  if (!match) return url;

  const publicId = match[1];
  const ext = url.split('.').pop();

  // Build transformation string
  let transformation = `w_${width}`;
  if (height) transformation += `,h_${height}`;
  transformation += `,q_${quality}`;
  transformation += `,f_${format}`;
  transformation += `,c_${fit}`;
  transformation += `,g_${gravity}`;

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}.${ext}`;
};

/**
 * Generate responsive image srcset
 * @param {string} url - Original image URL
 * @param {array} widths - Breakpoints for responsive images
 * @returns {string} srcset attribute value
 */
export const generateSrcSet = (url, widths = [640, 1024, 1536, 2048]) => {
  if (!url || !url.includes('cloudinary')) return '';

  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ');
};

/**
 * Get sizes attribute for responsive images
 * @returns {string} sizes attribute value
 */
export const getResponsiveSizes = () =>
  '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 80vw, 1200px';

/**
 * Generate blurred placeholder from image
 * @param {string} url - Original image URL
 * @returns {string} Tiny blurred image URL
 */
export const getBlurredPlaceholder = (url) => {
  if (!url || !url.includes('cloudinary')) return '';
  return getOptimizedImageUrl(url, { width: 20, height: 20, quality: 20 });
};

/**
 * Generate critical LCP image (high quality, optimized)
 * @param {string} url - Original image URL
 * @returns {string} Optimized URL for above-the-fold
 */
export const getCriticalImage = (url) =>
  getOptimizedImageUrl(url, { width: 1920, quality: 85, format: 'webp' });

/**
 * Preload image for performance
 * @param {string} url - Image URL
 */
export const preloadImage = (url) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Prefetch image (lower priority)
 * @param {string} url - Image URL
 */
export const prefetchImage = (url) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

export default {
  getOptimizedImageUrl,
  generateSrcSet,
  getResponsiveSizes,
  getBlurredPlaceholder,
  getCriticalImage,
  preloadImage,
  prefetchImage,
};
