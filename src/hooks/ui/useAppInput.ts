import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, TextInputProps } from 'react-native';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';

type UseAppInputParams = Pick<
  TextInputProps,
  'value' | 'onFocus' | 'onBlur'
> & {
  error?: boolean;
  leftIcon?: React.ReactNode;
};

export function useAppInput({
  value,
  error = false,
  leftIcon,
  onFocus,
  onBlur,
}: UseAppInputParams) {
  const [focused, setFocused] = useState(false);

  const isFloating = useMemo(
    () => focused || !!(value && String(value).length > 0),
    [focused, value],
  );

  const anim = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFloating ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [anim, isFloating]);

  const borderColor = useMemo(() => {
    if (error) return colors.danger;
    if (focused) return colors.primary;
    return colors.border;
  }, [error, focused]);

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -12],
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

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    e => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    e => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  return {
    focused,
    borderColor,
    labelTop,
    labelFontSize,
    labelColor,
    labelBackgroundColor,
    labelLeft,
    handleFocus,
    handleBlur,
  };
}
