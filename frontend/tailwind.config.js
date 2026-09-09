/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'hsl(var(--color-surface-alt) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        'border-strong': 'hsl(var(--color-border-strong) / <alpha-value>)',
        text: 'hsl(var(--color-text) / <alpha-value>)',
        'text-muted': 'hsl(var(--color-text-muted) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
        danger: 'hsl(var(--color-danger) / <alpha-value>)',
        success: 'hsl(var(--color-success) / <alpha-value>)',
        warning: 'hsl(var(--color-warning) / <alpha-value>)',
        weather: 'hsl(var(--color-weather) / <alpha-value>)',
        calendar: 'hsl(var(--color-calendar) / <alpha-value>)',
        income: 'hsl(var(--color-income) / <alpha-value>)',
        expense: 'hsl(var(--color-expense) / <alpha-value>)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
