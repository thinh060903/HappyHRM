import { useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { AttendanceDayItem } from '../../components/attendance/AttendanceDayCard';
import { startOfMonth, endOfMonth, sameMonth } from '../../utils/date';
import { QuickFilter } from '../../types/attendance/quickFilter';
import { addDays, formatRangeShort } from '../../utils/date';
import { AttendanceStatus } from '../../types/attendance/attendanceStatus';

function buildMockAttendanceForRange(
  start: Date,
  end: Date,
): AttendanceDayItem[] {
  const out: AttendanceDayItem[] = [];
  let cur = new Date(start);

  while (cur <= end) {
    const day = cur.getDate();

    // Demo logic:
    // - OFF cho vài ngày
    // - ERROR cho vài ngày thiếu công
    // - SUCCESS cho còn lại
    let status: AttendanceStatus = 'success';
    let workedText: string | undefined = '08 giờ';
    let showWarning = false;
    let warningTarget: AttendanceDayItem['warningTarget'] = undefined;

    if (day % 10 === 0 || day % 9 === 0) {
      status = 'off';
      workedText = undefined;
    } else if (day % 7 === 0 || day % 11 === 0) {
      status = 'error';
      workedText = day % 2 === 0 ? '07 giờ' : '07 giờ 15 phút';
      // thiếu công + chưa tạo đơn/giải trình
      showWarning = true;
      warningTarget = day % 2 === 0 ? 'leave_request' : 'explanation';
    } else {
      status = 'success';
      workedText = '08 giờ';
    }

    out.push({
      id: `${cur.toISOString()}`,
      date: new Date(cur),

      checkCode: status === 'off' ? undefined : '000897',
      shiftLabel: status === 'off' ? undefined : 'Ca 5A',
      totalShift: status === 'off' ? undefined : '8 giờ',

      workedText,
      status,

      showWarning,
      warningTarget,
    });

    cur = addDays(cur, 1);
  }

  // sắp xếp: nhân viên mới -> cũ (ngày mới nhất lên đầu)
  return out.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function useTimekeepingData() {
  const navigation = useNavigation<any>();

  // ✅ default month = hiện tại
  const now = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => startOfMonth(now), [now]);
  const defaultEnd = useMemo(() => endOfMonth(now), [now]);

  // View range (range đang xem)
  const [viewStart, setViewStart] = useState<Date | null>(defaultStart);
  const [viewEnd, setViewEnd] = useState<Date | null>(defaultEnd);

  // Picker state
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState<Date>(now);

  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // flags (đúng props ActionDateRangeCalendar)
  const [isSearching, setIsSearching] = useState(false);
  const [_didSearch, setDidSearch] = useState(false);
  const [_mode, setMode] = useState<'week' | 'range'>('range');

  // filter chip
  const [filter, setFilter] = useState<QuickFilter>('all');

  const s = viewStart ?? defaultStart;
  const e = viewEnd ?? defaultEnd;

  const data = useMemo(() => buildMockAttendanceForRange(s, e), [s, e]);

  const filteredData = useMemo(() => {
    if (filter === 'all') return data;

    if (filter === 'missing') {
      return data.filter(x => x.status === 'error');
    }

    // "Chưa tạo đơn": ngày lỗi + có cảnh báo (thiếu công nhưng chưa tạo đơn/giải trình)
    if (filter === 'no_request') {
      return data.filter(x => x.status === 'error' && x.showWarning);
    }

    return data;
  }, [data, filter]);

  const titleText = useMemo(() => {
    // Hiển thị giống ảnh: "Tháng 9, 2023: 01/09 → 12/09"
    // Nếu người dùng chọn range khác tháng, vẫn hiển thị theo viewStart/viewEnd.
    const monthLabel = sameMonth(s, e)
      ? `Tháng ${s.getMonth() + 1}, ${s.getFullYear()}`
      : `Tháng ${s.getMonth() + 1}/${s.getFullYear()}`;
    return `${monthLabel}:  ${formatRangeShort(s, e)}`;
  }, [s, e]);

  const onPressDetail = (item: AttendanceDayItem) => {
    navigation.navigate('TimekeepingDetail', {
      tab: 'info',
      date: item.date.toISOString(),
      item, // ✅ thêm
    });
  };

  const onPressWarning = (item: AttendanceDayItem) => {
    if (item.warningTarget === 'leave_request') {
      navigation.navigate('TimekeepingDetail', {
        tab: 'leave_request',
        date: item.date.toISOString(),
        item, // ✅ thêm
      });
      return;
    }
    if (item.warningTarget === 'explanation') {
      navigation.navigate('TimekeepingDetail', {
        tab: 'explanation',
        date: item.date.toISOString(),
        item, // ✅ thêm
      });
    }
  };
  return {
    viewStart,
    viewEnd,
    monthPickerOpen,
    monthCursor,
    rangeStart,
    rangeEnd,
    isSearching,
    filteredData,
    titleText,
    setViewStart,
    setViewEnd,
    setMonthPickerOpen,
    setMonthCursor,
    setRangeStart,
    setRangeEnd,
    setIsSearching,
    setDidSearch,
    setMode,
    filter,
    setFilter,
    onPressDetail,
    onPressWarning,
  };
}
