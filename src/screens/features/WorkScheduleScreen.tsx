import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import WeekStrip from '../../components/schedule/WeekStrip';
import WeekNavigator from '../../components/schedule/WeekNavigator';
import DateRangeCalendar from '../../components/schedule/DateRangeCalendar';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useWorkSchedule from '../../hooks/features/useWorkSchedule';

// Nếu typography của bạn export default là typography, dùng như dưới:
import typography from '../../themes/typography';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';
import ActionDateRangeCalendar from '../../components/schedule/ActionDateRangeCalendar';

type Shift = {
  code: string; // "Ca 5A", "Ca 16A"...
  time: string; // "05h00 - 14h00"
};

type DaySchedule = {
  dateISO: string; // "2026-03-01"
  shifts: Shift[];
  isOff?: boolean;
};

export default function WorkScheduleScreen() {
  const {
    schedules,
    weekStart,
    weekEnd,
    today,
    weekAnchor,
    setWeekAnchor,
    monthPickerOpen,
    setMonthPickerOpen,
    toggleMonthPicker,
    monthCursor,
    setMonthCursor,
    rangeStart,
    rangeEnd,
    setRangeStart,
    setRangeEnd,
    onPickDay,
    isSearching,
    setIsSearching,
    didSearch,
    setDidSearch,
    mode,
    setMode,
    viewStart,
    setViewStart,
    viewEnd,
    setViewEnd,
    hasAnyShift,
    formatDDMM,
    parseISO,
  } = useWorkSchedule();

  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      {/* Header */}
      <Header title="Lịch làm việc" showBack variant="primary" />
      {!monthPickerOpen && (
        <>
          {/* Week range + arrows */}
          <WeekNavigator
            start={mode === 'range' && viewStart ? viewStart : weekStart}
            end={mode === 'range' && viewEnd ? viewEnd : weekEnd}
            mode={mode}
            weekAnchor={weekAnchor}
            setWeekAnchor={setWeekAnchor}
            viewStart={viewStart}
            viewEnd={viewEnd}
            setViewStart={setViewStart}
            setViewEnd={setViewEnd}
          />

          <WeekStrip weekStart={weekStart} today={today} />

          {/* Option */}
          <View style={styles.optionRow}>
            <View style={{ flex: 1 }} />
            <FontAwesome5 name="edit" size={16} color="#2E7D5A" />
            <Pressable onPress={toggleMonthPicker} style={styles.optionBtn}>
              <Text style={styles.optionBtnText}>Tuỳ chọn</Text>
            </Pressable>
          </View>
        </>
      )}
      {/* Month picker modal */}
      {monthPickerOpen && (
        <>
          <DateRangeCalendar
            monthCursor={monthCursor}
            onPrevMonth={() =>
              setMonthCursor(
                new Date(
                  monthCursor.getFullYear(),
                  monthCursor.getMonth() - 1,
                  1,
                ),
              )
            }
            onNextMonth={() =>
              setMonthCursor(
                new Date(
                  monthCursor.getFullYear(),
                  monthCursor.getMonth() + 1,
                  1,
                ),
              )
            }
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onPickDay={onPickDay}
          />

          {/* Actions */}
          <ActionDateRangeCalendar
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            setRangeStart={setRangeStart}
            setRangeEnd={setRangeEnd}
            setMonthPickerOpen={setMonthPickerOpen}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            setDidSearch={setDidSearch}
            setMode={setMode}
            setViewStart={setViewStart}
            setViewEnd={setViewEnd}
          />
        </>
      )}
      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
      >
        {/* Nếu đã search mà không có kết quả -> empty */}
        {didSearch && !isSearching && !hasAnyShift ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Pressable
              onPress={() => {
                setDidSearch(false);
                setMode('week');
                setViewStart(null);
                setViewEnd(null);
                setWeekAnchor(today);
              }}
            >
              <Text style={styles.tryAgain}>Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          schedules.map(day => (
            <DayRow
              key={day.dateISO}
              data={day}
              parseISO={parseISO}
              formatDDMM={formatDDMM}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function DayRow({
  data,
  parseISO,
  formatDDMM,
}: {
  data: DaySchedule;
  parseISO: (iso: string) => Date;
  formatDDMM: (d: Date) => string;
}) {
  const d = parseISO(data.dateISO);
  const labelVN = (() => {
    const jsDay = d.getDay(); // 0 CN
    const map: Record<number, string> = {
      1: 'Thứ 2',
      2: 'Thứ 3',
      3: 'Thứ 4',
      4: 'Thứ 5',
      5: 'Thứ 6',
      6: 'Thứ 7',
      0: 'CN',
    };
    return `${map[jsDay]}, ${formatDDMM(d)}`;
  })();

  return (
    <View style={styles.dayCard}>
      <View style={styles.dayLeftBar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.dayLabel}>{labelVN}</Text>

        {data.isOff ? (
          <Text style={styles.offText}>Nghỉ</Text>
        ) : data.shifts.length === 0 ? (
          <Text style={styles.noShiftText}>—</Text>
        ) : (
          <View style={styles.shiftRow}>
            {data.shifts.map((s, idx) => (
              <React.Fragment key={`${s.code}-${idx}`}>
                <Text style={styles.shiftCode}>{s.code}:</Text>
                <Text style={styles.shiftTime}>{s.time}</Text>
                {idx === 0 && data.shifts.length > 1 ? (
                  <View style={styles.dividerVertical} />
                ) : null}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  optionRow: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
  },
  optionBtnText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 13,
    color: '#2E7D5A', // xanh “Tuỳ chọn” giống ảnh
  },

  listContent: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayLeftBar: {
    width: 4,
    borderRadius: 999,
    backgroundColor: colors.success,
    marginRight: spacing.md,
    alignSelf: 'stretch',
  },
  dayLabel: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  shiftCode: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  shiftTime: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.brand?.[500] ?? colors.primary,
  },
  dividerVertical: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },

  offText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  noShiftText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },

  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tryAgain: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 13,
    color: colors.brand?.[500] ?? colors.primary,
  },

  pickerPanel: {
    backgroundColor: '#fff',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  loadingInline: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
