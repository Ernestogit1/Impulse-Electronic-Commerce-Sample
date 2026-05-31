import { createTheme, type Theme } from '@mui/material/styles';
import { brand, ink, status, fonts, themes, type SemanticTokens } from './tokens';
import type { ThemeMode } from '@shared/types';

/** Builds an MUI theme from the shared tokens so MUI matches Tailwind exactly. */
function buildTheme(mode: ThemeMode): Theme {
  const t: SemanticTokens = themes[mode];
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: t.brand, contrastText: t.brandContrast, light: brand[300], dark: brand[700] },
      secondary: { main: ink[isDark ? 100 : 800] },
      background: { default: t.canvas, paper: t.surface },
      text: { primary: t.content, secondary: t.muted },
      divider: t.line,
      success: { main: status.success },
      warning: { main: status.warning },
      error: { main: status.danger },
      info: { main: status.info },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: fonts.sans,
      h1: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.03em' },
      h2: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.025em' },
      h3: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h4: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontFamily: fonts.display, fontWeight: 600 },
      h6: { fontFamily: fonts.display, fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: { styleOverrides: { body: { backgroundColor: t.canvas, color: t.content } } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 18, paddingBlock: 9, fontWeight: 600 },
          containedPrimary: {
            color: t.brandContrast,
            boxShadow: '0 8px 24px -10px rgba(45,212,225,0.6)',
            '&:hover': { backgroundColor: brand[300] },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', border: `1px solid ${t.line}` },
          rounded: { borderRadius: 16 },
        },
      },
      MuiCard: { styleOverrides: { root: { borderRadius: 16, border: `1px solid ${t.line}` } } },
      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, backgroundColor: t.elevated } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } } },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: ink[isDark ? 700 : 900], fontSize: 12, borderRadius: 8 },
        },
      },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundColor: t.surface, borderColor: t.line } } },
    },
  });
}

export const muiThemes: Record<ThemeMode, Theme> = {
  dark: buildTheme('dark'),
  light: buildTheme('light'),
};
