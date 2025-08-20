/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      colors: {
        rak: {
          // Soft Pink variations
          pink: {
            50: '#fdf2f5',
            100: '#fce7ed',
            200: '#f9d0dc',
            300: '#f4b8c8',
            400: '#E8CBD5', // Main Soft Pink
            500: '#dba3b8',
            600: '#c8859b',
            700: '#b06a82',
            800: '#93576c',
            900: '#7c4a5a',
          },
          // Deep Magenta variations
          magenta: {
            50: '#fdf2f6',
            100: '#fce7ee',
            200: '#f8d0de',
            300: '#f2aac4',
            400: '#e97ba3',
            500: '#dc4c82',
            600: '#B36A85', // Main Deep Magenta
            700: '#a85577',
            800: '#8d4762',
            900: '#753d53',
          },
          // Warm Beige variations
          beige: {
            50: '#fefcf9',
            100: '#fdf8f1',
            200: '#fbf1e3',
            300: '#F4E7D6', // Main Warm Beige
            400: '#ead5c1',
            500: '#dfc3ab',
            600: '#d1a888',
            700: '#c08d65',
            800: '#a67354',
            900: '#8a5f47',
          },
          // Clean White (keeping standard white)
          white: '#FFFFFF',
          // Additional healthcare colors for status indicators
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          }
        },
        primary: {
          50: '#fdf2f5',
          100: '#fce7ed',
          200: '#f9d0dc',
          300: '#f4b8c8',
          400: '#E8CBD5',
          500: '#dba3b8',
          600: '#B36A85',
          700: '#a85577',
          800: '#8d4762',
          900: '#753d53',
        },
        secondary: {
          50: '#fefcf9',
          100: '#fdf8f1',
          200: '#fbf1e3',
          300: '#F4E7D6',
          400: '#ead5c1',
          500: '#dfc3ab',
          600: '#d1a888',
          700: '#c08d65',
          800: '#a67354',
          900: '#8a5f47',
        },
        medical: {
          red: '#ef4444',
          amber: '#f59e0b',
          green: '#10b981',
          blue: '#3b82f6',
          teal: '#14b8a6',
          gray: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'medical': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medical-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};