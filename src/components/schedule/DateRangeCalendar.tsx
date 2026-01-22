import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import spacing from '../../themes/spacing';
import { colors } from '../../themes/color';
import typography from '../../themes/typography';
import { WEEKDAYS } from '../../constants/weekdays';
import { useDateRangeCalendar } from './hooks';
export * from '../schedule/hooks/useDateRangeCalendar';
export * from '../schedule/hooks/useDateRangePicker';


import { pad2, toISO, sameDay, sameMonth } from '../../utils/date';

type Props = {
  monthCursor: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;

  rangeStart: Date | null;
  rangeEnd: Date | null;

  onPickDay: (d: Date) => void;
};

export default function DateRangeCalendar({
  monthCursor,
  onPrevMonth,
  onNextMonth,
  rangeStart,
  rangeEnd,
  onPickDay,
}: Props) {

  const { visibleWeeks, uiStart, uiEnd } = useDateRangeCalendar(
    monthCursor,
    rangeStart,
    rangeEnd,
  );

  return (
    <View style={styles.panel}>
      {/* Month header */}
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={10} style={styles.navBtn}>
          <Text style={styles.navText}>{'‹'}</Text>
        </Pressable>

        <Text style={styles.title}>
          {`Tháng ${monthCursor.getMonth() + 1}/${monthCursor.getFullYear()}`}
        </Text>

        <Pressable onPress={onNextMonth} hitSlop={10} style={styles.navBtn}>
          <Text style={styles.navText}>{'›'}</Text>
        </Pressable>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map(w => (
          <Text key={w} style={styles.weekdayText}>
            {w}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {visibleWeeks.map((week, rowIdx) => {
          // find range segment in this row
          let first = -1;
          let last = -1;

          if (uiStart && uiEnd) {
            for (let c = 0; c < 7; c++) {
              const d = week[c];
              const inRange = d >= uiStart && d <= uiEnd;
              if (inRange && first === -1) first = c;
              if (inRange) last = c;
            }
          }

          const showBar = first !== -1 && last !== -1;

          return (
            <View key={`row-${rowIdx}`} style={styles.weekRow}>
              {showBar && (
                <View
                  style={[
                    styles.rowRangeBar,
                    {
                      left: `${(first * 100) / 7}%`,
                      width: `${((last - first + 1) * 100) / 7}%`,
                      // bo tròn ở mép hàng để nhìn mềm
                      borderTopLeftRadius: first === 0 ? 18 : 18,
                      borderBottomLeftRadius: first === 0 ? 18 : 18,
                      borderTopRightRadius: last === 6 ? 18 : 18,
                      borderBottomRightRadius: last === 6 ? 18 : 18,
                    },
                  ]}
                />
              )}

              {week.map(d => {
                const isDim = !sameMonth(d, monthCursor);
                const isStart = uiStart ? sameDay(d, uiStart) : false;
                const isEnd = uiEnd ? sameDay(d, uiEnd) : false;

                return (
                  <Pressable
                    key={toISO(d)}
                    onPress={() => onPickDay(d)}
                    style={styles.cell}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        (isStart || isEnd) && styles.dayCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isDim && styles.dayTextDim,
                          (isStart || isEnd) && styles.dayTextActive,
                        ]}
                      >
                        {pad2(d.getDate())}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#fff',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  navBtn: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  navText: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.fontFamily?.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },

  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  rowRangeBar: {
    position: 'absolute',
    height: 36,
    top: '50%',
    marginTop: -18,
    backgroundColor: 'rgba(244, 148, 89, 0.18)',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.brand?.[500] ?? colors.primary,
  },

  dayText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  dayTextDim: { color: '#B0B0B0' },
  dayTextActive: { color: '#fff' },
});
