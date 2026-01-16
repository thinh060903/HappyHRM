import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';

type ButtonVariant = 'primary' | 'outline' | 'link';

interface AppButtonProps {
  title: string;
  onPress: () => void;

  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const disabledBg = (colors as any).buttonDisabledBg ?? '#F3F4F6';
  const disabledText = (colors as any).buttonDisabledText ?? '#9CA3AF';

  const showSpinner = loading && variant !== 'link';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        isDisabled && variant !== 'link' && { backgroundColor: disabledBg },
        style,
      ]}
    >
      {showSpinner ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.textOnPrimary}
        />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              isDisabled && variant !== 'link' && { color: disabledText },
              textStyle,
            ]}
          >
            {title}
          </Text>

          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  /* ===== VARIANTS ===== */
  primary: {
    backgroundColor: colors.primary,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  link: {
    height: undefined,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },

  /* ===== CONTENT ===== */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconLeft: {
    marginRight: spacing.sm,
  },

  iconRight: {
    marginLeft: spacing.sm,
  },

  /* ===== TEXT ===== */
  text: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
  },

  text_primary: {
    color: colors.textOnPrimary,
  },

  text_outline: {
    color: colors.primary,
  },
  text_link: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
});
