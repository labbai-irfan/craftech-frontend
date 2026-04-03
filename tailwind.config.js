/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0A2647',
          dark: '#061b36',
          light: '#144272',
        },
        accent: {
          DEFAULT: '#C41B1F',
          soft: 'rgba(196, 27, 31, 0.08)',
        },
        gold: '#D4AF37',
        dark: '#08080c',
        'dark-2': '#12121a',
        mid: '#64748b',
        light: '#f8fafc',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'sms': '8px',
        'md': '16px',
        'lg': '32px',
      },
      boxShadow: {
        'sm': '0 4px 12px rgba(0,0,0,0.05)',
        'DEFAULT': '0 20px 50px rgba(10,38,71,0.08)',
        'lg': '0 30px 80px rgba(10,38,71,0.15)',
      },
    },
  },
  plugins: [],
}
