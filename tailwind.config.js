/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1E40AF',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          500: '#059669',
          600: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#D97706',
          600: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#DC2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
