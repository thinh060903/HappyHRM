import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';

type AppInputProps = TextInputProps & {
  label: string; // dùng label thay cho placeholder
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  errorText?: string; // nếu bạn muốn show sau này
};

export default function AppInput({
  label,
  value,
  onChangeText,

  leftIcon,
  rightIcon,
  onPressRightIcon,

  secureTextEntry,

  containerStyle,
  style,

  error = false,

  onFocus,
  onBlur,

  ...rest
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  // Khi focus hoặc có value => label nổi lên
  const isFloating = useMemo(
    () => focused || !!(value && String(value).length > 0),
    [focused, value],
  );

  // Animated: 0 = label nằm trong ô, 1 = label nổi lên
  const anim = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFloating ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // vì animate top/fontSize
    }).start();
  }, [isFloating, anim]);

  const borderColor = useMemo(() => {
    if (error) return colors.danger;
    if (focused) return colors.primary; // cam/vàng
    return colors.border;
  }, [error, focused]);

  // Label style animate: top + fontSize + color
  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -12], // 14: nằm trong ô | -12: nhảy lên trên border
  });

  const labelFontSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [typography.fontSize.md, typography.fontSize.sm],
  });

  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPlaceholder, colors.textPrimary],
  });

  const labelBackgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textOnPrimary, colors.background],
  });

  const leftIconWidth = leftIcon ? 24 + spacing.sm : 0;
  const leftWhenRest = spacing.md + leftIconWidth;
  const leftWhenFloat = spacing.md + 4;

  const labelLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [leftWhenRest, leftWhenFloat],
  });

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          { borderColor },
          focused && styles.focusedShadow,
        ]}
      >
        {/* Floating label */}
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.label,
            {
              top: labelTop,
              left: labelLeft,
              fontSize: labelFontSize,
              color: labelColor,
              // nền để “đè” lên border giống hình Figma
              backgroundColor: labelBackgroundColor,
            },
          ]}
        >
          {label}
        </Animated.Text>

        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, style]}
          placeholder={focused ? '' : ''} // không dùng placeholder nữa, label sẽ thay placeholder
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={!!secureTextEntry}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {rightIcon ? (
          <Pressable
            onPress={onPressRightIcon}
            disabled={!onPressRightIcon}
            style={styles.rightIcon}
            hitSlop={10}
          >
            {rightIcon}
          </Pressable>
        ) : null}
      </View>

      {/* Nếu muốn show lỗi sau này:
      {error && errorText ? <AppText variant="caption" color={colors.danger}>{errorText}</AppText> : null}
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52, // nhỉnh hơn 48 để label nổi lên không bị chật
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  label: {
    position: 'absolute',
    paddingHorizontal: 6, // nền che border đẹp hơn
    fontFamily: typography.fontFamily.regular,
  },

  input: {
    flex: 1,
    paddingVertical: 0,
    marginTop: 6, // đẩy text xuống 1 chút để giống Figma khi có label
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },

  leftIcon: {
    width: 24,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightIcon: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  // nếu bạn muốn “cảm giác focus” giống Figma hơn
  focusedShadow: {
    borderWidth: 1.5,
  },
});
