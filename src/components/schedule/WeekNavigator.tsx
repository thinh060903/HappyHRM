import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import { addDays, formatRange } from '../../utils/date';

type Props = {
  /** dùng để HIỂN THỊ text range giữa */
  start: Date;
  end: Date;

  containerStyle?: ViewStyle;

  /** Week mode: màn cha đưa anchor + setter vào đây */
  weekAnchor?: Date;
  setWeekAnchor?: React.Dispatch<React.SetStateAction<Date>>;

  /** Range mode (WorkSchedule): màn cha đưa state viewStart/viewEnd + setter */
  mode?: 'week' | 'range';
  viewStart?: Date | null;
  viewEnd?: Date | null;
  setViewStart?: React.Dispatch<React.SetStateAction<Date | null>>;
  setViewEnd?: React.Dispatch<React.SetStateAction<Date | null>>;

  /** (Optional) Home: nếu muốn bấm đổi tuần thì selectedDate nhảy theo đúng “thứ” */
  setSelectedDate?: React.Dispatch<React.SetStateAction<Date>>;
};

export default function WeekNavigator({
  start,
  end,
  containerStyle,

  setWeekAnchor,

  mode = 'week',
  viewStart,
  viewEnd,
  setViewStart,
  setViewEnd,

  setSelectedDate,
}: Props) {
  const shift = (deltaWeeks: number) => {
    const deltaDays = deltaWeeks * 7;

    // Range mode: dịch viewStart/viewEnd
    if (
      mode === 'range' &&
      viewStart &&
      viewEnd &&
      setViewStart &&
      setViewEnd
    ) {
      setViewStart(prev => (prev ? addDays(prev, deltaDays) : prev));
      setViewEnd(prev => (prev ? addDays(prev, deltaDays) : prev));
      return;
    }

    // Week mode: dịch weekAnchor
    if (setWeekAnchor) {
      setWeekAnchor(prev => addDays(prev, deltaDays));
    }

    // Optional: Home giữ selectedDate đi theo tuần
    if (setSelectedDate) {
      setSelectedDate(prev => addDays(prev, deltaDays));
    }
  };

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Pressable onPress={() => shift(-1)} hitSlop={10} style={styles.navBtn}>
        <Text style={styles.navBtnText}>{'‹'}</Text>
      </Pressable>

      <Text style={styles.rangeText}>{formatRange(start, end)}</Text>

      <Pressable onPress={() => shift(1)} hitSlop={10} style={styles.navBtn}>
        <Text style={styles.navBtnText}>{'›'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navBtn: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  navBtnText: {
    fontSize: 22,
    color: colors.primary,
  },
  rangeText: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
});
