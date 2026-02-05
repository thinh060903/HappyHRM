import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { RequestType } from '../../../types/request/requestType';
import { LeaveSubtype } from '../../../types/request/leaveSubtype';

// ✅ dùng lịch của bạn
import { useDateRangePicker } from '../../../hooks/schedule/useDateRangePicker';

const TYPE_LABEL: Record<RequestType, string> = {
  LEAVE: 'Đơn nghỉ phép',
  OT: 'Đơn tăng ca',
  EXPLAIN: 'Giải trình',
};

const LEAVE_SUBTYPE_LABEL: Record<LeaveSubtype, string> = {
  ANNUAL: 'Nghỉ phép năm',
  UNPAID: 'Nghỉ không lương',
  SICK: 'Nghỉ ốm',
  MATERNITY: 'Nghỉ thai sản',
  OTHER: 'Khác',
};

function formatDDMMYYYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function useCreateRequest() {
  const navigation = useNavigation<any>();
  const dr = useDateRangePicker();

  const [type, setType] = useState<RequestType>('LEAVE');
  const [typeOpen, setTypeOpen] = useState(false);

  // Leave subtype
  const [leaveSubtype, setLeaveSubtype] = useState<LeaveSubtype>('ANNUAL');
  const [leaveSubtypeOpen, setLeaveSubtypeOpen] = useState(false);

  // Date range picked from calendar
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // OT specific (demo)
  const [otStartTime, setOtStartTime] = useState(''); // "18:00"
  const [otEndTime, setOtEndTime] = useState(''); // "21:00"

  // Note
  const [note, setNote] = useState('');

  const timeText = useMemo(() => {
    if (!rangeStart) return '';
    const s = formatDDMMYYYY(rangeStart);
    const e = rangeEnd ? formatDDMMYYYY(rangeEnd) : s;
    return rangeEnd && e !== s ? `${s} - ${e}` : s;
  }, [rangeStart, rangeEnd]);

  const errors = useMemo(() => {
    const e: { time?: string; ot?: string } = {};
    if (!rangeStart) e.time = 'Vui lòng chọn thời gian';

    if (type === 'OT') {
      if (!otStartTime.trim() || !otEndTime.trim()) {
        e.ot = 'Vui lòng nhập giờ bắt đầu/kết thúc';
      }
    }
    return e;
  }, [rangeStart, type, otStartTime, otEndTime]);

  const canSubmit = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const onSubmit = () => {
    if (!canSubmit) return;

    // TODO: call API create request
    // Demo: back
    navigation.goBack();
  };
  return {
    type,
    setType,
    typeOpen,
    setTypeOpen,
    TYPE_LABEL,
    leaveSubtype,
    setLeaveSubtype,
    leaveSubtypeOpen,
    setLeaveSubtypeOpen,
    LEAVE_SUBTYPE_LABEL,
    rangeStart,
    rangeEnd,
    setRangeStart,
    setRangeEnd,
    calendarOpen,
    setCalendarOpen,
    dr,
    timeText,
    otStartTime,
    setOtStartTime,
    otEndTime,
    setOtEndTime,
    note,
    setNote,
    errors,
    canSubmit,
    onSubmit,
  };
}
