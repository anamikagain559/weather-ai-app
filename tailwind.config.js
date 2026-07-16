/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#03060f',
        surface: '#07101f',
        panel: '#0b1628',
        panel2: '#0f1c33',
        accent: '#2af5c8',
        accent2: '#3a8eff',
        accent3: '#ff6b35',
        textPrimary: '#b8cce8',
        muted: '#4a6585',
        whiteBright: '#e8f2ff',
        borderTint: 'rgba(42,245,200,0.09)',
        borderTint2: 'rgba(58,142,255,0.1)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(100deg, #2af5c8 0%, #3a8eff 55%, #a78bfa 100%)',
      }
    },
  },
  plugins: [],
}
