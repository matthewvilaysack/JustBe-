import theme from '../theme/theme';

declare global {
  namespace ReactNativePaper {
    interface Theme {
      custom: typeof theme;
    }
  }
} 