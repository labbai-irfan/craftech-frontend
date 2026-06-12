import React, { useRef, useEffect, useState } from 'react';
import {
  getOptimizedImageUrl,
  generateSrcSet,
  getResponsiveSizes,
  getBlurredPlaceholder,
} from '../../utils/imageOptimization';

/**
 * LazyImage Component
 * Native lazy loading + Intersection Observer for images
 * Handles blur-up effect and srcset for responsive images
 *
 * Usage:
 * <LazyImage
 *   src="https://res.cloudinary.com/.../image.jpg"
 *   alt="Description"
 *   width={1200}
 *   height={600}
 *   className="w-full object-cover"
 * />
 */
const LazyImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  priority = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy load
  useEffect(() => {
    if (priority) return; // Skip observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' } // Start loading 50px before entering viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [priority]);

  if (!src) {
    return (
      <div
        className={`bg-gray-200 animate-skeleton ${className}`}
        style={{ width, height, aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
      />
    );
  }

  const optimizedSrc = getOptimizedImageUrl(src, { width });
  const srcSet = generateSrcSet(src);
  const sizes = getResponsiveSizes();
  const blurred = getBlurredPlaceholder(src);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        aspectRatio: width && height ? `${width}/${height}` : 'auto',
      }}
    >
      {/* Blurred placeholder */}
      {!isLoaded && (
        <img
          src={blurred}
          alt=""
          className="absolute inset-0 w-full h-full blur-md scale-110"
          style={{ objectFit, objectPosition }}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isVisible ? optimizedSrc : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        srcSet={isVisible ? srcSet : ''}
        sizes={isVisible ? sizes : ''}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit,
          objectPosition,
        }}
      />
    </div>
  );
};

export default LazyImage;
