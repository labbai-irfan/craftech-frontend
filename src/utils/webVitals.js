/**
 * Web Vitals & Performance Monitoring
 * Tracks Core Web Vitals and custom metrics
 *
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): ≤ 2.5s
 * - FID (First Input Delay): ≤ 100ms
 * - CLS (Cumulative Layout Shift): ≤ 0.1
 */

const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  FID: { good: 100, poor: 300 },   // milliseconds
  CLS: { good: 0.1, poor: 0.25 },  // no unit
  TTFB: { good: 600, poor: 1800 }, // Time to First Byte (ms)
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint (ms)
};

/**
 * Track Core Web Vitals
 * Requires web-vitals library (optional, can use native APIs)
 */
export const trackWebVitals = (onMetric) => {
  // LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        onMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: lastEntry.renderTime <= VITALS_THRESHOLDS.LCP.good ? 'good' : 'poor',
          delta: lastEntry.renderTime || lastEntry.loadTime,
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
    } catch (e) {
      console.debug('LCP monitoring not supported');
    }

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            onMetric({
              name: 'CLS',
              value: clsValue,
              rating: clsValue <= VITALS_THRESHOLDS.CLS.good ? 'good' : 'poor',
              delta: entry.value,
            });
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
    } catch (e) {
      console.debug('CLS monitoring not supported');
    }

    // FID (First Input Delay) — deprecated, using INP instead
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          onMetric({
            name: 'FID',
            value: entry.processingDuration,
            rating: entry.processingDuration <= VITALS_THRESHOLDS.FID.good ? 'good' : 'poor',
            delta: entry.processingDuration,
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'], buffered: true });
    } catch (e) {
      console.debug('FID monitoring not supported');
    }

    // INP (Interaction to Next Paint)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        onMetric({
          name: 'INP',
          value: lastEntry.duration,
          rating: lastEntry.duration <= VITALS_THRESHOLDS.INP.good ? 'good' : 'poor',
          delta: lastEntry.duration,
        });
      });
      inpObserver.observe({ entryTypes: ['event'], buffered: true });
    } catch (e) {
      console.debug('INP monitoring not supported');
    }
  }

  // Navigation Timing (TTFB, DOM Interactive, etc.)
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      const dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
      const load = timing.loadEventEnd - timing.navigationStart;

      onMetric({ name: 'TTFB', value: ttfb, rating: ttfb <= VITALS_THRESHOLDS.TTFB.good ? 'good' : 'poor' });
      onMetric({ name: 'DCL', value: dcl, delta: dcl });
      onMetric({ name: 'Load', value: load, delta: load });
    });
  }
};

/**
 * Send metrics to analytics backend
 * @param {object} metric - Metric object with name, value, rating
 */
export const reportMetric = async (metric) => {
  // Only send in production
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[Vitals]', metric.name, metric.value, `(${metric.rating})`);
    return;
  }

  try {
    // Send to your analytics endpoint (could be Google Analytics, custom API, etc.)
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
      keepalive: true, // Continue sending even if page unloads
    });
  } catch (error) {
    console.error('Failed to report metric:', error);
  }
};

/**
 * Monitor long tasks (tasks > 50ms)
 * Useful for identifying bottlenecks
 */
export const monitorLongTasks = (threshold = 50) => {
  if ('PerformanceObserver' in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            console.warn(`[Long Task] ${entry.duration.toFixed(2)}ms:`, entry);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.debug('Long task monitoring not supported');
    }
  }
};

/**
 * Get performance summary
 */
export const getPerformanceSummary = () => {
  if (!window.performance || !window.performance.timing) return null;

  const timing = window.performance.timing;
  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.navigationStart,
    download: timing.responseEnd - timing.responseStart,
    domInteractive: timing.domInteractive - timing.navigationStart,
    domComplete: timing.domComplete - timing.navigationStart,
    loadComplete: timing.loadEventEnd - timing.navigationStart,
  };
};

/**
 * Initialize all performance tracking
 */
export const initPerformanceTracking = () => {
  trackWebVitals(reportMetric);
  monitorLongTasks();

  // Log performance summary on load
  window.addEventListener('load', () => {
    const summary = getPerformanceSummary();
    if (summary && process.env.NODE_ENV !== 'production') {
      console.table(summary);
    }
  });
};

export default {
  trackWebVitals,
  reportMetric,
  monitorLongTasks,
  getPerformanceSummary,
  initPerformanceTracking,
  VITALS_THRESHOLDS,
};
