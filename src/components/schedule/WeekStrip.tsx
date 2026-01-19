import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import { WEEKDAYS } from '../../constants/weekdays';

import { sameDay, pad2 } from '../../utils/date';
import { useWeekStrip } from './hooks';

type Props = {
  /** ngày bắt đầu tuần (Mon) */
  weekStart: Date;

  /** HomeScreen: ngày được chọn (vẽ ring) */
  selectedDate?: Date;
  /** HomeScreen: enable chọn ngày nếu có hàm này */
  onSelectDate?: (d: Date) => void;

  /** Today: vẽ dot vàng */
  today?: Date;

  showWeekdayHeader?: boolean;
  showDivider?: boolean;
  containerStyle?: ViewStyle;
};

export default function WeekStrip({
  weekStart,
  selectedDate,
  onSelectDate,
  today,
  showWeekdayHeader = true,
  showDivider = true,
  containerStyle,
}: Props) {
  const { days, selectable } = useWeekStrip(weekStart, onSelectDate);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {showWeekdayHeader && (
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map(w => (
            <Text key={w} style={styles.weekdayText}>
              {w}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.dateRow}>
        {days.map(d => {
          const isSelected = sameDay(d, selectedDate); // RING
          const isToday = sameDay(d, today); // DOT

          const Cell = selectable ? Pressable : View;

          return (
            <Cell
              key={`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`}
              onPress={selectable ? () => onSelectDate?.(d) : undefined}
              style={styles.cell}
              hitSlop={10}
            >
              {/* Ring cho selected */}
              <View
                style={[
                  styles.ring,
                  isSelected && styles.ringActive,
                  isToday && styles.ringBackGroundToday,
                ]}
              >
                <Text
                  style={[styles.dateText, isToday && styles.dateTextToday]}
                >
                  {pad2(d.getDate())}
                </Text>
              </View>
            </Cell>
          );
        })}
      </View>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
}

const RING_SIZE = 34;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },

  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.small,
    color: colors.textSecondary,
  },

  dateRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },

  // vòng tròn (ring)
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ringActive: {
    borderColor: colors.border,
  },

  ringBackGroundToday: {
    backgroundColor: colors.primary,
  },

  dateText: {
    ...typography.small,
    color: colors.textPrimary,
  },
  dateTextToday: {
    color: colors.textOnPrimary,
  },

  divider: {
    marginTop: spacing.md,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.border,
  },
});
