import React, { useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import WeekStrip from '../../components/schedule/WeekStrip';
import WeekNavigator from '../../components/schedule/WeekNavigator';
import DateRangeCalendar from '../../components/schedule/DateRangeCalendar';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function parseISO(iso: string) {
  const [y, m, dd] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, dd || 1);
}
function formatDDMM(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

// Week bắt đầu từ Monday
function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const jsDay = x.getDay(); // 0 Sun ... 6 Sat
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfWeekSunday(d: Date) {
  return addDays(startOfWeekMonday(d), 6);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Mock lịch làm việc (demo) */
function buildMockScheduleForWeek(weekStart: Date) {
  // Tạo vài ngày có ca, vài ngày nghỉ, vài ngày rỗng để demo "Không tìm thấy kết quả"
  const list: DaySchedule[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    const iso = toISO(d);

    // Demo logic:
    // - Thứ 2,3,4 có 2 ca
    // - Thứ 5 có 1 ca
    // - Chủ nhật nghỉ
    const jsDay = d.getDay(); // 0 Sun
    if (jsDay === 0) {
      list.push({ dateISO: iso, shifts: [], isOff: true });
    } else if (jsDay >= 1 && jsDay <= 3) {
      list.push({
        dateISO: iso,
        shifts: [
          { code: 'Ca 5A', time: '05h00 - 14h00' },
          { code: 'Ca 16A', time: '16h00 - 23h59' },
        ],
      });
    } else if (jsDay === 4) {
      list.push({
        dateISO: iso,
        shifts: [{ code: 'Ca 5A', time: '05h00 - 14h00' }],
      });
    } else {
      // Thứ 6,7: rỗng để demo “không có lịch”
      list.push({ dateISO: iso, shifts: [] });
    }
  }
  return list;
}

function buildMockScheduleForDate(d: Date): DaySchedule {
  const iso = toISO(d);
  const jsDay = d.getDay();

  if (jsDay === 0) return { dateISO: iso, shifts: [], isOff: true };

  if (jsDay >= 1 && jsDay <= 3) {
    return {
      dateISO: iso,
      shifts: [
        { code: 'Ca 5A', time: '05h00 - 14h00' },
        { code: 'Ca 16A', time: '16h00 - 23h59' },
      ],
    };
  }

  if (jsDay === 4) {
    return {
      dateISO: iso,
      shifts: [{ code: 'Ca 5A', time: '05h00 - 14h00' }],
    };
  }

  return { dateISO: iso, shifts: [] };
}

function buildMockScheduleForRange(start: Date, end: Date) {
  const list: DaySchedule[] = [];
  let cur = new Date(start);
  cur.setHours(0, 0, 0, 0);

  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  while (cur <= last) {
    list.push(buildMockScheduleForDate(cur));
    cur = addDays(cur, 1);
  }
  return list;
}

export default function WorkScheduleScreen() {
  // Lấy "tuần này" theo thời gian máy, nhưng ép năm = 2026 để demo
  const today = useMemo(() => {
    const t = new Date(); // lấy ngày hiện tại của máy
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [weekAnchor, setWeekAnchor] = useState<Date>(today);

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState<Date>(startOfMonth(today));
  const [isSearching, setIsSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);

  const weekStart = useMemo(() => startOfWeekMonday(weekAnchor), [weekAnchor]);
  const weekEnd = useMemo(() => endOfWeekSunday(weekAnchor), [weekAnchor]);

  // ===== Range picker states =====
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // Mặc định vẫn là tuần. Khi bấm tìm kiếm theo khoảng -> chuyển sang range
  const [mode, setMode] = useState<'week' | 'range'>('week');

  // Khoảng đang hiển thị ngoài màn chính (khi mode='range')
  const [viewStart, setViewStart] = useState<Date | null>(null);
  const [viewEnd, setViewEnd] = useState<Date | null>(null);

  const schedules = useMemo(() => {
    if (mode === 'range' && viewStart && viewEnd) {
      return buildMockScheduleForRange(viewStart, viewEnd);
    }
    return buildMockScheduleForWeek(weekStart);
  }, [mode, viewStart, viewEnd, weekStart]);

  const hasAnyShift = schedules.some(d => d.shifts.length > 0);

  const toggleMonthPicker = () => {
    if (monthPickerOpen) {
      setMonthPickerOpen(false);
      return;
    }

    // mở: cursor theo tháng của tuần đang xem
    setMonthCursor(startOfMonth(weekAnchor));
    setRangeStart(null);
    setRangeEnd(null);
    setMonthPickerOpen(true);
  };

  const onPickDay = (d: Date) => {
    // Nếu chưa chọn gì, hoặc đã chọn đủ 2 ngày rồi -> chọn lại từ đầu
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d);
      setRangeEnd(null);
      return;
    }

    // Nếu đã có start mà chưa có end -> set end
    setRangeEnd(d);
  };

  const resetScreen = useCallback(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);

    setWeekAnchor(t);

    setMode('week');
    setViewStart(null);
    setViewEnd(null);

    setDidSearch(false);
    setIsSearching(false);

    setMonthPickerOpen(false);
    setMonthCursor(startOfMonth(t));
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetScreen(); // ✅ mỗi lần vào lại màn là reset
    }, [resetScreen]),
  );

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
          schedules.map(day => <DayRow key={day.dateISO} data={day} />)
        )}
      </ScrollView>
    </Screen>
  );
}

function DayRow({ data }: { data: DaySchedule }) {
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
