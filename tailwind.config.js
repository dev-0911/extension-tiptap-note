/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FCD34D',
          hover: '#FBBF24',
          dark: '#F59E0B', // Darker yellow for dark mode
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
          dark: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
          }
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          dark: '#1F2937',
          darkSecondary: '#374151',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
          dark: '#4B5563',
          darkLight: '#6B7280',
        },
        tag: {
          blue: {
            light: '#DBEAFE',
            dark: '#1E40AF',
            textLight: '#1E40AF',
            textDark: '#93C5FD',
          },
          green: {
            light: '#DCFCE7',
            dark: '#166534',
            textLight: '#166534',
            textDark: '#86EFAC',
          },
          purple: {
            light: '#F3E8FF',
            dark: '#6B21A8',
            textLight: '#6B21A8',
            textDark: '#D8B4FE',
          },
          yellow: {
            light: '#FEF9C3',
            dark: '#854D0E',
            textLight: '#854D0E',
            textDark: '#FDE047',
          },
          pink: {
            light: '#FCE7F3',
            dark: '#9D174D',
            textLight: '#9D174D',
            textDark: '#FBCFE8',
          },
          indigo: {
            light: '#E0E7FF',
            dark: '#3730A3',
            textLight: '#3730A3',
            textDark: '#A5B4FC',
          },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'dark-card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'dark-card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}