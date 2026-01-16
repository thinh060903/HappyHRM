import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeActionsGrid from '../../components/home/HomeActionsGrid';
import HomeUserRow from '../../components/home/HomeUserRow';
import NotificationsCard from '../../components/home/NotificationsCard';

import spacing from '../../themes/spacing';
import { colors } from '../../themes/color';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';
import WeekStrip from '../../components/schedule/WeekStrip';
import WeekNavigator from '../../components/schedule/WeekNavigator';
import SectionCard from '../../components/home/SectionCard';
import ShiftList from '../../components/schedule/ShiftList';

// ====== Types (mock) ======
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

export default function HomeScreen() {
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

  return (
    <Screen
      backgroundColor={colors.background}
      style={styles.screen}
      edges={['left', 'right', 'bottom']} // ✅ không safe-area top nữa
    >
      {/* HEADER (custom) */}
      <Header
        title="Trang chủ"
        showMenu
        variant="primary"
        rightIconName="notifications-outline"
        onRightPress={goNotifications}
      />

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TOP CARD */}
          <SectionCard hideHeader>
            <HomeUserRow
              avatar={user.avatar}
              name={user.name}
              role={user.role}
              timeText={formatHHMMSS(now)}
              isOnTime={isOnTime}
              onPressProfile={goEmployeeDetail}
            />

            {/* ICON GRID */}
            <HomeActionsGrid
              actions={[
                {
                  key: 'attendance',
                  label: 'Chấm công',
                  iconName: 'fingerprint',
                  onPress: () => goFeature('Attendance'),
                },
                {
                  key: 'employees',
                  label: 'Nhân viên',
                  iconName: 'users',
                  onPress: () => goFeature('Employees'),
                },
                {
                  key: 'schedule',
                  label: 'Lịch làm việc',
                  iconName: 'calendar-alt',
                  onPress: goWorkSchedule,
                },
                {
                  key: 'requests',
                  label: 'Tạo đơn',
                  iconName: 'edit',
                  onPress: () => goFeature('Requests'),
                },
                {
                  key: 'qr',
                  label: 'Quét QR',
                  iconName: 'qrcode',
                  onPress: () => goFeature('QrScan'),
                },
                {
                  key: 'diagram',
                  label: 'Sơ đồ',
                  iconName: 'project-diagram',
                  onPress: () => goFeature('Diagram'),
                },
                {
                  key: 'more',
                  label: 'Xem thêm',
                  iconName: 'plus-square',
                  onPress: () => {},
                },
              ]}
            />
          </SectionCard>

          {/* WORK SCHEDULE */}
          <SectionCard
            title="Lịch làm việc"
            rightText="Chi tiết"
            onPressRight={goWorkSchedule}
            style={{ marginTop: spacing.lg }}
          >
            <WeekNavigator
              start={weekStart}
              end={weekEnd}
              weekAnchor={weekAnchor}
              setWeekAnchor={setWeekAnchor}
              setSelectedDate={setSelectedDate}
            />

            <WeekStrip
              weekStart={weekStart}
              today={today}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <ShiftList shifts={selectedShifts} />
          </SectionCard>

          {/* NOTIFICATIONS */}
          <NotificationsCard
            notices={notices}
            badgeCount={10}
            onPressAll={goNotifications}
            onPressItem={() => goNotifications()} // hoặc mở detail sau
          />

          <View style={{ height: spacing.xxxl }} />
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
  },
});
