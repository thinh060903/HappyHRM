// Font, kiểu chữ cho toàn app

import { Platform } from 'react-native';

/**
 * FONT FAMILY
 * - iOS: SF Pro Display (system)
 * - Android: Inter (custom font)
 */
const fontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Display',
    android: 'Inter-Regular',
  })!,
  medium: Platform.select({
    ios: 'SF Pro Display',
    android: 'Inter-Medium',
  })!,
  semibold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Inter-SemiBold',
  })!,
  bold: Platform.select({
    ios: 'SF Pro Display',
    android: 'Inter-Bold',
  })!,
};

/**
 * FONT SIZE SCALE
 * Theo chuẩn mobile UI (iOS-first)
 */
const fontSize = {
  xs: 12,
  sm: 14,
  md: 16, // body chuẩn
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * LINE HEIGHT
 * Luôn lớn hơn fontSize ~ 1.4–1.5 lần
 */
const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 32,
  xxxl: 40,
};

/**
 * TYPOGRAPHY SYSTEM
 */
const typography = {
  /* ========= HEADINGS ========= */
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },

  /* ========= BODY ========= */
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },

  /* ========= BUTTON ========= */
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },

  /* ========= INPUT ========= */
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },

  /* ========= EXPORT SCALE ========= */
  fontFamily,
  fontSize,
  lineHeight,
};

export default typography;
