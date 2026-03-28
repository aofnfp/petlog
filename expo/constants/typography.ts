import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  displayLarge: {
    fontFamily: 'DM Serif Display',
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.72,
  },
  displayMedium: {
    fontFamily: 'DM Serif Display',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.56,
  },
  displaySmall: {
    fontFamily: 'DM Serif Display',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.48,
  },
  titleLarge: {
    fontFamily: 'DM Sans',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  titleMedium: {
    fontFamily: 'DM Sans',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  bodyLarge: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: 'DM Sans',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  label: {
    fontFamily: 'DM Sans',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'DM Sans',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
} as const;
