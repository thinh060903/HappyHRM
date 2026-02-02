import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import spacing from '../themes/spacing';
import typography from '../themes/typography';
import { colors } from '../themes/color';

// Screens (giữ nguyên như AppDrawer)
import HomeScreen from '../screens/home/HomeScreen';
import DiagramScreen from '../screens/features/DiagramScreen';
import EmployeesScreen from '../screens/features/EmployeesScreen';
import EmployeeDetailScreen from '../screens/features/EmployeeDetailScreen';
import AttendanceStack from './AttendanceStack';
import WorkScheduleScreen from '../screens/features/WorkScheduleScreen';
import RequestStack from './RequestStack';
import QrScanScreen from '../screens/features/QrScanScreen';

type Props = {
  onLogout: () => void;
};

export type AppStackParamList = {
  Home: undefined;
  Menu: undefined;

  Attendance: undefined;
  Employees: undefined;
  EmployeeDetail: undefined;

  WorkSchedule: undefined;
  Requests: undefined;
  QrScan: undefined;
  Diagram: undefined;

  // Notifications: undefined;
  // Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

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
    <Pressable onPress={onPress} style={[styles.itemRow, active && styles.itemRowActive]}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{label}</Text>
      </View>

      {!!rightBadgeText && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{rightBadgeText}</Text>
        </View>
      )}
    </Pressable>
  );
}

/**
 * MenuScreen: thay cho DrawerContent (giữ y hệt UI drawer cũ)
 * - Bạn mở menu bằng: navigation.navigate('Menu')
 * - Tắt menu bằng: navigation.goBack()
 */
function MenuScreen({ navigation, onLogout }: any) {
  const insets = useSafeAreaInsets();

  // Nếu muốn highlight active như drawer thì cần state route hiện tại.
  // Trong Stack không có state.routeNames/index kiểu Drawer, nên tạm bỏ active.
  // Khi cần highlight chuẩn, mình sẽ làm bằng: useNavigationState()
  const isActive = (_name: keyof AppStackParamList) => false;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image source={require('../../assets/images/logo-white.png')} style={styles.logo} />

        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.closeBtn}>
          <FontAwesome5 name="times" size={22} color={colors.textOnPrimary} />
        </Pressable>
      </View>

      <ScrollView
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
              color={isActive('Home') ? colors.primary : colors.textPrimary}
            />
          }
          active={false}
          rightBadgeText="10"
          onPress={() => {
            // navigation.navigate('Notifications');
            // tạm thời bạn chưa bật screen này
          }}
        />
      </ScrollView>

      <View style={[styles.logoutWrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <FontAwesome5 name="sign-out-alt" size={18} color={colors.textOnPrimary} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AppStack({ onLogout }: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Home */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Menu (thay drawer) */}
      <Stack.Screen name="Menu">
        {props => <MenuScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>

      {/* Feature stacks / screens */}
      <Stack.Screen name="Attendance" component={AttendanceStack} />
      <Stack.Screen name="Employees" component={EmployeesScreen} />
      <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
      <Stack.Screen name="WorkSchedule" component={WorkScheduleScreen} />
      <Stack.Screen name="Requests" component={RequestStack} />
      <Stack.Screen name="QrScan" component={QrScanScreen} />
      <Stack.Screen name="Diagram" component={DiagramScreen} />

      {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
    </Stack.Navigator>
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
    backgroundColor: '#FEE9DC',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
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
