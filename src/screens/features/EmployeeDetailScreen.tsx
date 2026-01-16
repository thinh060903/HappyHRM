import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';

type Employee = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  status: 'Đang làm việc' | 'Nghỉ việc' | 'Tạm nghỉ';
  code: string;
  email: string;
  department: string;
  birthday: string;
  phone: string;
  citizenId: string;
  issuedPlace: string;
  issuedDate: string;
  contracts: {
    id: string;
    title: string;
    range?: string; // "27/9/2022 - 27/11/2022"
    inactive?: boolean;
  }[];
};

// Fake data demo (sau này bạn thay bằng API/Firebase)
const EMPLOYEES: Employee[] = [
  {
    id: 'e01',
    name: 'Courtney Henry',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    role: 'Python Developer',
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
    contracts: [
      {
        id: 'c1',
        title: 'Hợp đồng lao động 2',
        range: '27/9/2022 - 27/11/2022',
      },
      { id: 'c2', title: 'Hợp đồng bảo mật', range: '27/9/2022 - 27/11/2022' },
      { id: 'c3', title: 'Hợp đồng Thử việc', inactive: true },
    ],
  },
];

type RouteParams = {
  employeeId?: string;
  employee?: Employee; // nếu bạn truyền thẳng object
};

export default function EmployeeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params ?? {}) as RouteParams;

  const employee = useMemo(() => {
    if (params.employee) return params.employee;
    if (params.employeeId)
      return EMPLOYEES.find(e => e.id === params.employeeId);
    return EMPLOYEES[0];
  }, [params.employee, params.employeeId]);

  if (!employee) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>Không tìm thấy nhân viên.</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor =
    employee.status === 'Đang làm việc'
      ? colors.success ?? '#34C759'
      : colors.error ?? colors.danger ?? '#FF3B30';

  const contracts = employee?.contracts ?? [];

  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      {' '}
      {/* Header */}
      <Header title="Thông tin nhân viên" showBack variant="primary" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card trên cùng */}
        <View style={styles.topCard}>
          <Image source={{ uri: employee.avatar }} style={styles.avatar} />

          <Text style={styles.name}>{employee.name}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <FontAwesome5
                name="briefcase"
                size={12}
                color={colors.success ?? '#16A34A'}
              />
              <Text style={styles.badgeText}>{employee.role}</Text>
            </View>

            <View style={styles.badge}>
              <FontAwesome5
                name="map-marker-alt"
                size={12}
                color={colors.primary}
              />
              <Text style={styles.badgeText}>{employee.location}</Text>
            </View>
          </View>
        </View>

        {/* Khối thông tin */}
        <View style={styles.infoCard}>
          <InfoRow
            label="Mã nhân viên"
            value={employee.code}
            rightIcon="copy"
          />
          <InfoRow
            label="Trạng thái"
            value={employee.status}
            valueStyle={{ color: statusColor }}
          />
          <InfoRow label="Email" value={employee.email} rightIcon="copy" />
          <InfoRow label="Phòng ban" value={employee.department} />

          <Divider />

          <InfoRow label="Ngày sinh" value={employee.birthday} />
          <InfoRow
            label="Số điện thoại"
            value={employee.phone}
            rightIcon="copy"
          />
          <InfoRow label="Số CMND/CCCD" value={employee.citizenId} />
          <InfoRow label="Nơi cấp" value={employee.issuedPlace} />
          <InfoRow label="Ngày cấp" value={employee.issuedDate} />
        </View>

        {/* Thông tin hợp đồng */}
        <Text style={styles.sectionTitle}>Thông tin hợp đồng</Text>

        <View style={styles.contractWrap}>
          {contracts.map(c => (
            <Pressable
              key={c.id}
              style={[
                styles.contractItem,
                c.inactive && styles.contractItemInactive,
              ]}
              onPress={() => {
                // TODO: mở file hợp đồng / download
                // navigation.navigate('ContractViewer', { contractId: c.id })
              }}
            >
              <View style={styles.contractLeft}>
                <View
                  style={[
                    styles.docIconBox,
                    c.inactive && styles.docIconBoxInactive,
                  ]}
                >
                  <FontAwesome5
                    name="file-alt"
                    size={16}
                    color={c.inactive ? '#6B7280' : colors.success ?? '#16A34A'}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.contractTitle,
                      c.inactive && styles.contractTitleInactive,
                    ]}
                  >
                    {c.title}
                  </Text>

                  {!!c.range && !c.inactive && (
                    <View style={styles.contractSubRow}>
                      <FontAwesome5
                        name="calendar-alt"
                        size={12}
                        color="#6B7280"
                      />
                      <Text style={styles.contractSubText}>{c.range}</Text>
                    </View>
                  )}

                  {c.inactive && (
                    <View style={styles.contractSubRow}>
                      <FontAwesome5
                        name="exclamation-triangle"
                        size={12}
                        color="#6B7280"
                      />
                      <Text style={styles.contractSubText}>Hết hiệu lực</Text>
                    </View>
                  )}
                </View>
              </View>

              <FontAwesome5 name="download" size={16} color="#6B7280" />
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

/** ---------- Sub components ---------- */

function InfoRow({
  label,
  value,
  valueStyle,
  rightIcon,
}: {
  label: string;
  value: string;
  valueStyle?: any;
  rightIcon?: string; // copy icon
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>

      <View style={styles.rowRight}>
        <Text style={[styles.rowValue, valueStyle]} numberOfLines={1}>
          {value}
        </Text>

        {rightIcon ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              // TODO: copy value
              // Clipboard.setString(value)
            }}
          >
            <FontAwesome5 name={rightIcon as any} size={14} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/** ---------- Styles ---------- */

const ORANGE = colors.brand?.[500] ?? colors.primary ?? '#EE8241';

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  scrollContent: {
    padding: spacing.lg,
  },

  topCard: {
    backgroundColor: colors.surface ?? '#FFFFFF',
    borderRadius: 18,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: spacing.sm,
  },
  name: {
    ...(typography.h2 ?? { fontSize: 20, fontWeight: '800' }),
    color: colors.textPrimary ?? '#111827',
    marginBottom: spacing.sm,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F9FAFB',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badgeText: {
    ...(typography.small ?? { fontSize: 12, fontWeight: '500' }),
    color: colors.textSecondary ?? '#374151',
  },

  infoCard: {
    backgroundColor: colors.surface ?? '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  row: {
    paddingVertical: spacing.lg - 4, // ~12
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: {
    ...(typography.caption ?? { fontSize: 13, fontWeight: '500' }),
    // color: colors.textMuted ?? '#6B7280',
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1.3,
    justifyContent: 'flex-end',
  },
  rowValue: {
    ...(typography.bodyMedium ?? { fontSize: 14, fontWeight: '600' }),
    color: colors.textPrimary ?? '#111827',
    maxWidth: 220,
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border ?? '#E5E5EA',
    marginVertical: spacing.sm,
  },

  sectionTitle: {
    ...(typography.bodyMedium ?? { fontSize: 14, fontWeight: '700' }),
    color: colors.textPrimary ?? '#111827',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },

  contractWrap: {
    gap: spacing.sm,
  },
  contractItem: {
    backgroundColor: colors.surface ?? '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contractItemInactive: {
    opacity: 0.8,
  },
  contractLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    paddingRight: spacing.md,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBoxInactive: {
    backgroundColor: '#F3F4F6',
  },
  contractTitle: {
    ...(typography.bodyMedium ?? { fontSize: 14, fontWeight: '600' }),
    color: colors.textPrimary ?? '#111827',
    marginBottom: 2,
  },
  contractTitleInactive: {
    color: colors.textSecondary ?? '#374151',
  },
  contractSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contractSubText: {
    ...(typography.small ?? { fontSize: 12, fontWeight: '500' }),
    // color: colors.textMuted ?? '#6B7280',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errText: {
    ...(typography.body ?? { fontSize: 14 }),
    color: colors.textPrimary ?? '#111827',
    marginBottom: spacing.md,
  },
  backBtn: {
    backgroundColor: ORANGE,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  backBtnText: {
    ...(typography.button ?? { fontSize: 14, fontWeight: '700' }),
    color: '#fff',
  },
});
