import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import spacing from '../themes/spacing';
import typography from '../themes/typography';
import { colors } from '../themes/color';

// Screens (bạn thay đúng path của project bạn)
import HomeScreen from '../screens/home/HomeScreen';
import DiagramScreen from '../screens/features/DiagramScreen';
import EmployeesScreen from '../screens/features/EmployeesScreen';
import EmployeeDetailScreen from '../screens/features/EmployeeDetailScreen';
import AttendanceStack from './AttendanceStack';
import WorkScheduleScreen from '../screens/features/WorkScheduleScreen';
// import ProfileScreen from '../screens/features/ProfileScreen';
import RequestStack from './RequestStack';
// import NotificationsScreen from '../screens/features/NotificationsScreen';
import QrScanScreen from '../screens/features/QrScanScreen';

const Drawer = createDrawerNavigator();

type Props = {
  onLogout: () => void;
};

function DrawerItemRow({
  label,
  icon,
  active,
  onPress,
  rightBadgeText,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onPress: () => void;
  rightBadgeText?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.itemRow, active && styles.itemRowActive]}
    >
      <View style={styles.itemLeft}>
        {/* CỘT ICON CỐ ĐỊNH */}
        <View style={styles.iconBox}>{icon}</View>

        {/* LABEL luôn bắt đầu cùng 1 vị trí */}
        <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
          {label}
        </Text>
      </View>

      {!!rightBadgeText && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{rightBadgeText}</Text>
        </View>
      )}
    </Pressable>
  );
}

function CustomDrawerContent({ state, navigation, onLogout }: any) {
  const currentRouteName = state?.routeNames?.[state.index];
  const insets = useSafeAreaInsets();
  const isActive = (name: string) => currentRouteName === name;

  return (
    <View style={{ flex: 1 }}>
      {/* Top brand area */}
      <View style={styles.drawerHeader}>
        <Image
          source={require('../../assets/images/logo-white.png')}
          style={styles.logo}
        />

        <Pressable
          onPress={() => navigation.closeDrawer()}
          hitSlop={10}
          style={styles.closeBtn}
        >
          {<FontAwesome5 name="times" size={22} color={colors.textOnPrimary} />}
        </Pressable>
      </View>

      <DrawerContentScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.groupTitle}>DANH MỤC</Text>

        <DrawerItemRow
          label="Chấm công"
          icon={
            <FontAwesome5
              name="fingerprint"
              size={18}
              color={isActive('Attendance') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('Attendance')}
          onPress={() => navigation.navigate('Attendance')}
        />
        <DrawerItemRow
          label="Nhân viên"
          icon={
            <FontAwesome5
              name="users"
              size={18}
              color={isActive('Employees') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('Employees')}
          onPress={() => navigation.navigate('Employees')}
        />
        <DrawerItemRow
          label="Lịch làm việc"
          icon={
            <FontAwesome5
              name="calendar-alt"
              size={18}
              color={isActive('WorkSchedule') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('WorkSchedule')}
          onPress={() => navigation.navigate('WorkSchedule')}
        />
        <DrawerItemRow
          label="Tạo đơn"
          icon={
            <FontAwesome5
              name="edit"
              size={18}
              color={isActive('Requests') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('Requests')}
          onPress={() => navigation.navigate('Requests')}
        />
        <DrawerItemRow
          label="Quét QR"
          icon={
            <FontAwesome5
              name="qrcode"
              size={18}
              color={isActive('QrScan') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('QrScan')}
          onPress={() => navigation.navigate('QrScan')}
        />
        <DrawerItemRow
          label="Sơ đồ"
          icon={
            <FontAwesome5
              name="project-diagram"
              size={18}
              color={isActive('Diagram') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('Diagram')}
          onPress={() => navigation.navigate('Diagram')}
        />

        <View style={styles.divider} />

        <Text style={styles.groupTitle}>HỆ THỐNG</Text>

        <DrawerItemRow
          label="Cá nhân"
          icon={
            <FontAwesome5
              name="user"
              size={18}
              color={isActive('EmployeeDetail') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('EmployeeDetail')}
          onPress={() => navigation.navigate('EmployeeDetail')}
        />
        <DrawerItemRow
          label="Thông báo"
          icon={
            <FontAwesome5
              name="bell"
              size={18}
              color={isActive('Notifications') ? colors.primary : colors.textPrimary}
            />
          }
          active={isActive('Notifications')}
          rightBadgeText="10"
          onPress={() => navigation.navigate('Notifications')}
        />
      </DrawerContentScrollView>

      {/* Logout bottom */}
      <View
        style={[
          styles.logoutWrap,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <FontAwesome5
            name="sign-out-alt"
            size={18}
            color={colors.textOnPrimary}
          />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AppDrawer({ onLogout }: Props) {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, swipeEnabled: false }}
      drawerContent={props => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ swipeEnabled: true }} // ✅ chỉ Home cho phép vuốt
      />

      <Drawer.Screen name="Attendance" component={AttendanceStack} />
      <Drawer.Screen name="Employees" component={EmployeesScreen} />
      <Drawer.Screen
        name="EmployeeDetail"
        component={EmployeeDetailScreen}
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' }, // ẩn khỏi menu drawer
        }}
      />
      <Drawer.Screen name="WorkSchedule" component={WorkScheduleScreen} />
      <Drawer.Screen name="Requests" component={RequestStack} />
      <Drawer.Screen name="QrScan" component={QrScanScreen} />
      <Drawer.Screen name="Diagram" component={DiagramScreen} />

      {/* <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    paddingTop: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 10,
  },

  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  groupTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    ...typography.small,
    color: colors.textSecondary,
  },

  itemRow: {
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRowActive: {
    backgroundColor: '#FEE9DC', // active bg giống Figma (tông cam nhạt)
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: spacing.md,
  },
  iconBox: {
    width: 34, // cố định “cột icon”
    alignItems: 'center', // icon nằm giữa cột
    justifyContent: 'center',
    marginRight: spacing.md, // khoảng cách icon - label giống Figma
  },
  itemLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemLabelActive: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },

  badge: {
    minWidth: 22,
    height: 18,
    paddingHorizontal: 6,
    borderRadius: 999,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.small,
    color: '#fff',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    opacity: 0.9,
  },

  logoutWrap: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutBtn: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.button,
    color: '#fff',
  },
});
