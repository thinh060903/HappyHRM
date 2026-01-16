import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import SectionCard from './SectionCard';

export type Notice = {
  id: string;
  title: string;
  timeText: string;
  metaRight?: string;
  statusText?: string;
  statusColor?: string;
  createdAt: number;
};

type Props = {
  notices: Notice[];
  badgeCount?: number;
  onPressAll?: () => void;

  // optional (nếu sau này muốn bấm vào item / menu ⋯)
  onPressItem?: (notice: Notice) => void;
  onPressMore?: (notice: Notice) => void;
};

export default function NotificationsCard({
  notices,
  badgeCount,
  onPressAll,
  onPressItem,
  onPressMore,
}: Props) {
  return (
    <SectionCard
      title="Thông báo"
      rightText="Tất cả"
      onPressRight={onPressAll}
      badgeCount={badgeCount}
      style={{ marginTop: spacing.lg }}
      badgeBgColor="#E11D48"
    >
      <View>
        {notices.map((n, idx) => (
          <View key={n.id} style={styles.itemWrap}>
            <Pressable style={styles.itemRow} onPress={() => onPressItem?.(n)}>
              <View style={styles.leftBar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.time}>{n.timeText}</Text>

                {!!n.statusText && (
                  <Text
                    style={[
                      styles.status,
                      { color: n.statusColor ?? colors.textSecondary },
                    ]}
                  >
                    {n.statusText}
                  </Text>
                )}
              </View>

              <View style={styles.right}>
                {!!n.metaRight && (
                  <Text style={styles.meta}>{n.metaRight}</Text>
                )}

                <Pressable hitSlop={10} onPress={() => onPressMore?.(n)}>
                  <Text style={styles.dots}>⋯</Text>
                </Pressable>
              </View>
            </Pressable>

            {idx !== notices.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  itemWrap: {
    position: 'relative',
  },
  itemRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  leftBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  time: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  status: {
    ...typography.small,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  meta: {
    ...typography.small,
    color: colors.primary,
  },
  dots: {
    fontSize: 18,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.7,
  },
});
