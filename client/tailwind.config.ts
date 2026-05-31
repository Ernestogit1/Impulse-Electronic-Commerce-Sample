import type { Config } from 'tailwindcss'

/**
 * Tailwind shares the SAME design tokens as MUI (src/theme/tokens.ts).
 * - Fixed brand scales (brand = cyan, ink = navy) are hard hex values.
 * - Theme-aware semantic colors read CSS variables the ThemeModeProvider swaps on <html>.
 * - `preflight` is off so MUI's <CssBaseline> owns the global reset.
 */
const config: Config = {
  darkMode: ['class', '.theme-dark'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFEFF',
          100: '#CFFBFE',
          200: '#A2F4FB',
          300: '#66E7F2',
          400: '#2DD4E1',
          500: '#14B8CB',
          600: '#0E97AC',
          700: '#11788A',
          800: '#155E6E',
          900: '#164E5C',
        },
        ink: {
          0: '#FFFFFF',
          50: '#F4F7F9',
          100: '#E4EAEF',
          200: '#C7D2DB',
          300: '#9DB0BD',
          400: '#6B8190',
          500: '#475A68',
          600: '#2E3F4B',
          700: '#1C2A34',
          800: '#122029',
          900: '#0B1620',
          950: '#060E15',
        },
        canvas: 'var(--c-canvas)',
        surface: 'var(--c-surface)',
        elevated: 'var(--c-elevated)',
        line: 'var(--c-line)',
        content: 'var(--c-content)',
        muted: 'var(--c-muted)',
        'brand-contrast': 'var(--c-brand-contrast)',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.10)',
        card: '0 10px 34px -8px rgba(0,0,0,0.45)',
        elevated: '0 24px 60px -12px rgba(0,0,0,0.55)',
        brand: '0 10px 34px -8px rgba(45,212,225,0.35)',
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      maxWidth: { '8xl': '88rem' },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
