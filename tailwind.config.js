/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Enhanced Color Palette
      colors: {
        navy: '#0A2647',
        'navy-dark': '#061b36',
        'navy-light': '#144272',
        accent: '#C41B1F',
        'accent-soft': 'rgba(196, 27, 31, 0.08)',
        'accent-dim': 'rgba(196, 27, 31, 0.15)',
        gold: '#D4AF37',
        'gold-light': 'rgba(212, 175, 55, 0.1)',
        dark: '#08080c',
        'dark-2': '#12121a',
        mid: '#64748b',
        light: '#f8fafc',
        surface: '#111827',
        'surface-2': '#1f2937',
        'surface-3': '#374151',
      },

      // Premium Typography
      fontFamily: {
        display: '"Playfair Display", serif',
        poppins: ['Poppins', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: '"Fira Code", monospace',
      },

      fontSize: {
        // Responsive typography with clamp
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0em' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
      },

      // Premium Spacing Scale
      spacing: {
        'gutter': 'var(--gutter, 2rem)',
      },

      // Enhanced Shadows
      boxShadow: {
        none: 'none',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'premium-hover': '0 30px 60px rgba(0, 0, 0, 0.2)',
        'navy-glow': '0 0 30px rgba(10, 38, 71, 0.2)',
        'accent-glow': '0 0 30px rgba(196, 27, 31, 0.15)',
      },

      // Border Radius
      borderRadius: {
        sms: '8px',
        md: '16px',
        lg: '32px',
        xl: '48px',
      },

      // Transitions
      transitionDuration: {
        250: '250ms',
        350: '350ms',
        400: '400ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // Gradient overlays
      backgroundImage: {
        'gradient-navy-accent': 'linear-gradient(135deg, #0A2647 0%, #C41B1F 100%)',
        'gradient-to-accent': 'linear-gradient(to right, rgba(10, 38, 71, 0.9), rgba(196, 27, 31, 0.1))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
      },

      // Aspect ratios
      aspectRatio: {
        video: '16 / 9',
        portrait: '3 / 4',
        golden: '1.618 / 1',
      },
    },
  },

  plugins: [
    // Custom plugin for premium utilities
    function({ addComponents, theme }) {
      addComponents({
        // Premium text styles
        '.text-display': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '700',
          letterSpacing: theme('letterSpacing.tight'),
        },
        '.text-uppercase-tight': {
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.75rem',
          fontWeight: '700',
        },
        '.text-uppercase-wide': {
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '0.65rem',
          fontWeight: '900',
        },

        // Premium button base
        '.btn-premium': {
          '@apply px-8 py-4 rounded-lg font-bold uppercase tracking-wider transition-all duration-300': {},
          '&:hover': {
            '@apply shadow-premium': {},
          },
        },

        // Card elevation
        '.card-elevated': {
          '@apply rounded-2xl bg-white shadow-lg hover:shadow-premium transition-shadow duration-300': {},
        },

        '.card-glass': {
          '@apply rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20': {},
        },
      });
    },
  ],
}
