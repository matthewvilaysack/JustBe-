export default {
  colors: {
    // Core Colors
    primary: {
      50: "#EEF1FB",
      100: "#DCE3F8",
      200: "#B9C7F0",
      300: "#96ABE9",
      400: "#7089E6", // Main brand color
      500: "#5A6DB9",
      600: "#45518C",
      700: "#2F365E",
      800: "#1A1B31",
      900: "#0D0D19",
    },

    // Brand Colors
    darkGray: "#3E4454",
    lightGray: "#AAAAAA",
    lightBlue: "#D0F2FF",
    purple: "#9E96DF",
    white: "#FFFFFF",
    testColor: "#6b85df",
    darkPurple: "#2C4DC7",
    darkBlue: "#0B3464",

    // UI States
    button: {
      primary: {
        background: "#FFFFFF",
        text: "#7089E6",
        border: "#5A77E2",
        shadow: "#344A66",
      },
      secondary: {
        background: "#FFFFFF",
        text: "#7089E6",
        border: "#5A77E2",
        shadow: "#344A66",
      },
      danger: {
        background: "#FF453A",
        backgroundHover: "#CC372E",
        backgroundPressed: "#992A23",
        text: "#FFFFFF",
      },
    },

    // App Theme
    background: {
      primary: "#FFFFFF",
      secondary: "#EEF1FB",
      tertiary: "#DCE3F8",
    },

    text: {
      primary: "#3E4454",
      secondary: "#5A6DB9",
      tertiary: "#96ABE9",
      disabled: "rgba(62, 68, 84, 0.5)",
      inverse: "#FFFFFF",
    },

    border: {
      default: "#DCE3F8",
      strong: "#B9C7F0",
    },

    status: {
      success: "#34C759",
      warning: "#FF9500",
      error: "#FF453A",
      info: "#7089E6",
    },

    // Tab Navigation
    tabBar: {
      active: "#FFFFFF",
      border: "#747474",
    },
  },

  // Typography
  typography: {
    fonts: {
      regular: "LexendDecaRegular",
      bold: "LexendDecaBold",
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Icons
  icons: {
    sizes: {
      sm: 16,
      md: 24,
      lg: 32,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    pill: 999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    button: {
      shadowColor: "#344A66",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
  },

  components: {
    arrow: {
      width: 38.8,
      height: 5,
      rotation: 1.72,
      shadow: {
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    },
  },
};
