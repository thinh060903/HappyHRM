import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../themes/color';

type Shift = {
  id: string;
  room: string; // ví dụ: 5A, 10B
  start: string; // "08:00"
  end: string; // "11:00"
};

type Notice = {
  id: string;
  title: string;
  timeText: string; // "9:00AM - 11:00AM" hoặc "24/10/2022, 8:33am"
  metaRight?: string; // "Phòng họp lớn" hoặc "10 phút"
  statusText?: string; // "Chưa duyệt"
  statusColor?: string; // colors.warning / colors.success / ...
  createdAt: number; // sort mới -> cũ
};

// ====== Helpers ======
const pad2 = (n: number) => String(n).padStart(2, '0');

const formatHHMMSS = (d: Date) =>
  `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, days: number) =>
  new Date(d.getTime() + days * 86400000);

const startOfWeekMonday = (d: Date) => {
  const x = new Date(d);
  const jsDay = x.getDay(); // 0 Sun ... 6 Sat
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function useHome() {
  const navigation = useNavigation<any>();

  // ====== Mock user ======
  const user = useMemo(
    () => ({
      name: 'Cameron',
      role: 'Quản lý buồng phòng',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60',
    }),
    [],
  );

  // ====== Realtime clock ======
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeText = useMemo(() => formatHHMMSS(now), [now]);

  // ====== Check-in status (mock rule) ======
  // <= 08:00:00 => đúng giờ, > 08:00 => đi muộn (giống ảnh 6:20 đúng giờ / 8:20 đi muộn)
  const isOnTime = useMemo(() => {
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const total = h * 3600 + m * 60 + s;
    const threshold = 8 * 3600; // 08:00:00
    return total <= threshold;
  }, [now]);

  // ====== Week days (7 ngày, bắt đầu từ hôm nay - 2 đến +4 cho đẹp) ======
  const today = useMemo(() => startOfDay(now), [now]);

  const [weekAnchor, setWeekAnchor] = useState<Date>(today);

  const weekStart = useMemo(() => startOfWeekMonday(weekAnchor), [weekAnchor]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    // Nếu qua ngày mới, tự reset về "hôm nay"
    if (!isSameDay(selectedDate, today)) return;
    // nothing
  }, [today, selectedDate]);

  // ====== Mock shifts by date (bạn thay bằng API sau) ======
  const shiftsByDate = useMemo<Record<string, Shift[]>>(() => {
    const key = (d: Date) => d.toISOString().slice(0, 10);

    const t0 = key(today);
    const t1 = key(addDays(today, 1));
    const t_1 = key(addDays(today, -1));

    return {
      [t0]: [
        { id: 's1', room: '5A, 10B', start: '08:00', end: '11:00' },
        { id: 's2', room: '3C', start: '13:00', end: '16:00' },
      ],
      [t1]: [{ id: 's3', room: '2A', start: '08:00', end: '12:00' }],
      [t_1]: [{ id: 's4', room: '7B', start: '14:00', end: '18:00' }],
    };
  }, [today]);

  const selectedKey = useMemo(
    () => selectedDate.toISOString().slice(0, 10),
    [selectedDate],
  );

  const selectedShifts = shiftsByDate[selectedKey] ?? [];

  // ====== Notifications (mock, sort new -> old, max 3) ======
  const notices = useMemo<Notice[]>(() => {
    const base = Date.now();
    return [
      {
        id: 'n1',
        title: 'Họp nhân sự',
        timeText: '9:00AM - 11:00AM',
        metaRight: 'Phòng họp lớn',
        createdAt: base - 1 * 60 * 1000,
      },
      {
        id: 'n2',
        title: 'Điểm danh muộn',
        timeText: 'Hôm nay, 8:33am',
        metaRight: '10 phút',
        createdAt: base - 10 * 60 * 1000,
        statusText: '',
      },
      {
        id: 'n3',
        title: 'Phê duyệt đơn xin nghỉ',
        timeText: 'Hôm nay, 13:00pm - 16:00pm',
        statusText: 'Chưa duyệt',
        statusColor: colors.warning,
        createdAt: base - 60 * 60 * 1000,
      },
      {
        id: 'n4',
        title: 'Thông báo khác (không hiện vì quá 3)',
        timeText: 'Hôm nay, 17:00',
        createdAt: base - 2 * 60 * 60 * 1000,
      },
    ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
  }, []);

  // ====== Actions ======
  const goWorkSchedule = () => navigation.navigate('WorkSchedule');
  const goNotifications = () => navigation.navigate('Notifications');

  const goFeature = (routeName: string) => navigation.navigate(routeName);

  const goEmployeeDetail = () =>
    navigation.navigate('EmployeeDetail', {
      employee: {
        id: 'e01',
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        location: 'Trụ sở Hà Nội',
        status: 'Đang làm việc',
        code: 'APG221031001',
        email: 'henrycr@apec.com.vn',
        department: 'API - Phòng Quản lý Thiết kế',
        birthday: '24/05/1990',
        phone: '(+84) 123 456 789',
        citizenId: '0312001489',
        issuedPlace: 'Công An Hải Phòng',
        issuedDate: '15/10/2016',
        contracts: [],
      },
    });

  return {
    user,
    timeText,
    isOnTime,
    weekStart,
    weekEnd,
    weekAnchor,
    setWeekAnchor,
    today,
    selectedDate,
    setSelectedDate,
    selectedShifts,
    notices,
    goNotifications,
    goWorkSchedule,
    goFeature,
    goEmployeeDetail,
  };
}
