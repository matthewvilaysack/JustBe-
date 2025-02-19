import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';
import theme from './theme';

// Declare the custom theme type globally
declare global {
  namespace ReactNativePaper {
    interface MD3Theme {
      custom: typeof theme;
    }
  }
}

export const paperTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary[400],
    onPrimary: theme.colors.white,
    primaryContainer: theme.colors.white,
    onPrimaryContainer: theme.colors.primary[400],
    surface: theme.colors.white,
    onSurface: theme.colors.text.primary,
    surfaceVariant: theme.colors.primary[200],
    onSurfaceVariant: theme.colors.white,

    // Primary and background colors
    background: theme.colors.background.primary,
    onBackground: theme.colors.text.primary,

    // Surface colors
    surfaceDisabled: theme.colors.primary[100],

    // Secondary colors
    secondary: theme.colors.primary[200],
    onSecondary: theme.colors.white,
    secondaryContainer: theme.colors.primary[100],
    onSecondaryContainer: theme.colors.primary[800],

    // Error states
    error: theme.colors.status.error,
    onError: theme.colors.white,
    errorContainer: theme.colors.status.error + '40',
    onErrorContainer: theme.colors.white,

    // Other UI colors
    outline: theme.colors.border.default,
    outlineVariant: theme.colors.border.strong,
    inverseSurface: theme.colors.primary[900],
    inverseOnSurface: theme.colors.white,
    inversePrimary: theme.colors.primary[200],
    shadow: theme.colors.button.primary.shadow,
    scrim: 'rgba(0, 0, 0, 0.3)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: theme.typography.fonts.regular,
    },
    medium: {
      fontFamily: theme.typography.fonts.regular,
      fontWeight: '500',
    },
    light: {
      fontFamily: theme.typography.fonts.regular,
      fontWeight: '300',
    },
    thin: {
      fontFamily: theme.typography.fonts.regular,
      fontWeight: '100',
    },
  },
  // Use your theme's spacing and sizing
  spacing: {
    xs: theme.spacing.xs,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
    xl: theme.spacing.xl,
  },
  roundness: 1, // Set to 1 to use the full border radius values
  elevation: {
    level0: theme.shadows.sm,
    level1: theme.shadows.md,
    level2: theme.shadows.lg,
    level3: theme.shadows.button,
    level4: {
      ...theme.shadows.lg,
      shadowOpacity: 0.25,
    },
    level5: {
      ...theme.shadows.lg,
      shadowOpacity: 0.3,
    },
  },
  custom: theme
}; 