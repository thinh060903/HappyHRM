import { useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  addDays,
  formatDDMM,
  parseISO,
  startOfMonth,
  startOfWeekMonday,
  endOfWeekSunday,
  toISO,
} from '../../../src/utils/date';

type Shift = {
  code: string; // "Ca 5A", "Ca 16A"...
  time: string; // "05h00 - 14h00"
};

type DaySchedule = {
  dateISO: string; // "2026-03-01"
  shifts: Shift[];
  isOff?: boolean;
};

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

export default function useWorkSchedule() {
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

  return {
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
    addDays,
    resetScreen,
  };
}
