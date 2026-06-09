import { Platform } from 'react-native';

export const Colors = {
  primary: '#5B6EF5',       // Primary Slate Blue
  secondary: '#4C5DE8',     // Primary Dark
  primaryLight: '#EEF2FF',  // Primary Light

  background: '#F8FAFC',    // Slate 50 background
  cardBg: '#FFFFFF',        // Pure White surface cards
  border: '#E2E8F0',        // Slate 200 border
  borderLight: '#F8FAFC',

  text: '#0F172A',           // Text Primary (#0F172A)
  textSecondary: '#64748B',  // Text Secondary (#64748B)
  textMuted: '#94A3B8',      // Slate 400

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  priority: {
    High: '#EF4444',        // Red (Danger)
    Medium: '#F59E0B',      // Amber (Warning)
    Low: '#22C55E',         // Green (Success)
  },

  status: {
    Pending: '#F59E0B',
    Completed: '#22C55E',
  },

  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#5B6EF5',          // Slate Blue

  overlay: 'rgba(15, 23, 42, 0.3)', // Neutral dark overlay with opacity for modals
};

export const Typography = {
  fontFamily: {
    regular: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 32,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  }
};

// Premium subtle drop-shadow definitions (Linear/Notion style)
export const Shadows = {
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
};
