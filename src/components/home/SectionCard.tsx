import React, { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import Card from '../common/Card';

type Props = {
  title?: string;
  rightText?: string;
  onPressRight?: () => void;
  badgeCount?: number; // ví dụ: 10
  children: ReactNode;

  // ✅ NEW
  badgeBgColor?: string;
  badgeTextColor?: string;

  // cho phép tuỳ biến nếu cần
  style?: StyleProp<ViewStyle>;

  hideHeader?: Boolean;
};

export default function SectionCard({
  title,
  rightText,
  onPressRight,
  badgeCount,
  badgeBgColor = '#E11D48', // ✅ default giống HomeScreen cũ
  badgeTextColor = '#fff',
  children,
  style,
  hideHeader = false,
}: Props) {
  const hasRight = !!rightText && !!onPressRight;
  const hasBadge = typeof badgeCount === 'number';
  const hasTitle = !!title;

  const showHeader = !hideHeader && (hasTitle || hasRight || hasBadge);
  return (
    <Card style={style}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {hasTitle && <Text style={styles.title}>{title}</Text>}

            {hasBadge && (
              <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
                <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                  {badgeCount}
                </Text>
              </View>
            )}
          </View>

          {hasRight && (
            <Pressable onPress={onPressRight} hitSlop={10}>
              <Text style={styles.right}>{rightText}</Text>
            </Pressable>
          )}
        </View>
      )}

      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  right: {
    ...typography.caption,
    color: colors.primary,
  },
  badge: {
    minWidth: 22,
    height: 18,
    paddingHorizontal: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.small,
    color: '#fff',
  },
});
