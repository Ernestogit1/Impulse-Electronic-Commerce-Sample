/**
 * Design tokens — the single source of truth for the Impulse visual identity.
 *
 * Brand: electric cyan/teal on deep navy — derived directly from the Impulse Software
 * Solutions logo (a circuit-etched cloud split by a lightning bolt). Dark is the default;
 * a light theme mirrors the same tokens.
 *
 * Consumed by MUI (muiTheme.ts) and Tailwind (tailwind.config.ts + styles/index.css CSS vars).
 */

export const brand = {
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
} as const;

export const ink = {
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
} as const;

export const status = {
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#38BDF8',
} as const;

export interface SemanticTokens {
  canvas: string;
  surface: string;
  elevated: string;
  line: string;
  content: string;
  muted: string;
  brand: string;
  brandContrast: string;
}

export const darkTheme: SemanticTokens = {
  canvas: '#070F17',
  surface: '#0E1925',
  elevated: '#142231',
  line: '#1E2E3C',
  content: '#EAF2F6',
  muted: '#8FA3B0',
  brand: brand[400],
  brandContrast: '#06121A',
};

export const lightTheme: SemanticTokens = {
  canvas: '#F6F9FB',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  line: '#E2E9EE',
  content: ink[900],
  muted: ink[500],
  brand: brand[600],
  brandContrast: '#FFFFFF',
};

export const fonts = {
  display: '"Sora", ui-sans-serif, system-ui, sans-serif',
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
} as const;

export const themes: Record<'dark' | 'light', SemanticTokens> = {
  dark: darkTheme,
  light: lightTheme,
};
