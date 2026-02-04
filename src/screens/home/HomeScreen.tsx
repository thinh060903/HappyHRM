import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import HomeActionsGrid from '../../components/home/HomeActionsGrid';
import HomeUserRow from '../../components/home/HomeUserRow';
import NotificationsCard from '../../components/home/NotificationsCard';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';
import ShiftList from '../../components/schedule/ShiftList';
import WeekNavigator from '../../components/schedule/WeekNavigator';
import WeekStrip from '../../components/schedule/WeekStrip';
import SectionCard from '../../components/home/SectionCard';
import spacing from '../../themes/spacing';
import { colors } from '../../themes/color';
import { useHome } from '../../hooks/home/useHome';

export default function HomeScreen() {
  const {
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
  } = useHome();

  return (
    <Screen
      backgroundColor={colors.background}
      style={styles.screen}
      edges={['left', 'right', 'bottom']}
    >
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
          <SectionCard hideHeader>
            <HomeUserRow
              avatar={user.avatar}
              name={user.name}
              role={user.role}
              timeText={timeText}
              isOnTime={isOnTime}
              onPressProfile={goEmployeeDetail}
            />

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

          <NotificationsCard
            notices={notices}
            badgeCount={10}
            onPressAll={goNotifications}
            onPressItem={goNotifications}
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
