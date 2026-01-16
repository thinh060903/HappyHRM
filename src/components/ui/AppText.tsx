import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../../themes/color';
import typography from '../../themes/typography';

interface AppTextProps extends TextProps {
  variant?: 'body' | 'title' | 'caption' | 'label';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  color = colors.textPrimary,
  weight = 'regular',
  style,
  ...rest
}) => {
  return (
    <Text
      {...rest}
      style={[styles.base, styles[variant], styles[weight], { color }, style]}
    >
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
  },

  /* Variant */
  body: {
    fontSize: typography.fontSize.md,
    lineHeight: 22,
  },
  title: {
    fontSize: typography.fontSize.xl,
    lineHeight: 28,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  label: {
    fontSize: typography.fontSize.md,
  },

  /* Weight */
  regular: {
    fontFamily: typography.fontFamily.regular,
  },
  medium: {
    fontFamily: typography.fontFamily.medium,
  },
  semibold: {
    fontFamily: typography.fontFamily.semibold,
  },
  bold: {
    fontFamily: typography.fontFamily.bold,
  },
});
