import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import AppText from '../../components/ui/AppText';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import type { AttendanceDayItem } from '../../components/attendance/AttendanceDayCard';
import { pad2, sameDay } from '../../utils/date';
import Ionicons from 'react-native-vector-icons/Ionicons';


type TabKey = 'info' | 'leave_request' | 'explanation';
const formatVNDate = (d: Date) =>
    `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

export default function TimekeepingDetailScreen() {
    const route = useRoute<any>();
    const initialTab: TabKey = route.params?.tab ?? 'info';

    const [tab, setTab] = useState<TabKey>(initialTab);

    const item: AttendanceDayItem | undefined = route.params?.item;

    const title = useMemo(() => 'Chi tiết chấm công', []);

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title={title} showBack variant="primary" />
            {/* tab bar sát header */}
            <View style={styles.tabBar}>
                <TopTab label="Thông tin" active={tab === 'info'} onPress={() => setTab('info')} />
                <TopTab
                    label="Quản lý đơn nghỉ"
                    active={tab === 'leave_request'}
                    onPress={() => setTab('leave_request')}
                />
                <TopTab
                    label="Quản lý giải trình"
                    active={tab === 'explanation'}
                    onPress={() => setTab('explanation')}
                />
            </View>

            {/* content (tạm để trống / placeholder) */}
            <View style={styles.body}>
                {tab === 'info' && <InfoTab item={item} />}
                {tab === 'leave_request' && (
                    <AppText style={styles.placeholder}>TODO: View Quản lý đơn nghỉ</AppText>
                )}
                {tab === 'explanation' && (
                    <AppText style={styles.placeholder}>TODO: View Quản lý giải trình</AppText>
                )}
            </View>
        </Screen>
    );
}
function InfoTab({ item }: { item?: AttendanceDayItem }) {
    const today = new Date();

    // fallback nếu chưa có item (tránh crash)
    const d = item?.date ? new Date(item.date) : today;

    const status = item?.status ?? 'off';
    const workedText = item?.workedText ?? '--';

    // 3 trạng thái hiển thị:
    const timeColor =
        status === 'error'
            ? (colors.danger ?? '#E53935')       // thiếu công -> đỏ
            : status === 'success'
                ? (colors.success ?? '#2E7D32')    // đủ công -> xanh
                : colors.textSecondary;

    // có dấu chấm than CHỈ khi: thiếu công + chưa tạo đơn/giải trình
    const showExclamation = status === 'error' && !!item?.showWarning;

    return (
        <View style={{ gap: spacing.md }}>
            {/* CARD 1: Thông tin ca (giống phần trên ảnh) */}
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[styles.leftBar, { backgroundColor: timeColor }]} />
                        <AppText style={styles.cardTitle}>
                            {sameDay(d, today) ? `Hôm nay, ${formatVNDate(d)}` : formatVNDate(d)}
                        </AppText>
                    </View>

                    <AppText style={styles.linkText}>
                        {item?.checkCode ? `Mã chấm công: ${item.checkCode}` : 'Mã chấm công: —'}
                    </AppText>
                </View>

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Mã ca</AppText>
                    <AppText style={styles.value}>{item?.shiftLabel ?? '5A (10:00 → 18:00)'}</AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Tổng thời gian ca</AppText>
                    <AppText style={styles.value}>{item?.totalShift ?? '8 giờ'}</AppText>
                </View>
            </View>

            {/* CARD 2: Thông tin chấm công (giống phần dưới ảnh) */}
            <View style={styles.card}>
                <AppText style={styles.sectionTitle}>Thông tin chấm công</AppText>

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Tổng thời gian thực tế</AppText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {showExclamation && (
                            <Ionicons
                                name="alert-circle" // dấu chấm than trong vòng tròn
                                size={16}
                                color={colors.danger ?? '#E53935'}
                            />
                        )}

                        <AppText style={[styles.value, { color: timeColor }]}>
                            {workedText}
                        </AppText>
                    </View>

                </View>

                <View style={styles.grayBox}>
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.grayLabel}>Chấm lần đầu</AppText>
                        <AppText style={styles.grayValue}>10:00</AppText>
                    </View>

                    <View style={styles.graySplit} />

                    <View style={{ flex: 1 }}>
                        <AppText style={styles.grayLabel}>Chấm lần cuối</AppText>
                        <AppText style={styles.grayValue}>17:15</AppText>
                    </View>
                </View>

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Tổng thời gian nghỉ</AppText>
                    <AppText style={styles.value}>0</AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Giờ làm việc</AppText>
                    <AppText style={styles.value}>10:00</AppText>
                </View>
            </View>
        </View>
    );
}

function TopTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={styles.tabItem}>
            <AppText style={[styles.tabText, active && styles.tabTextActive]}>{label}</AppText>
            {active && <View style={styles.tabUnderline} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
    tabText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.brand?.[500] ?? colors.primary,
        fontFamily: typography.fontFamily?.semibold,
    },
    tabUnderline: {
        marginTop: 8,
        height: 2,
        width: '60%',
        borderRadius: 2,
        backgroundColor: colors.brand?.[500] ?? colors.primary,
    },

    body: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
    placeholder: { fontFamily: typography.fontFamily?.regular, color: colors.textSecondary },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
    },

    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    leftBar: { width: 4, height: 16, borderRadius: 2 },

    cardTitle: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 13,
        color: colors.textPrimary,
    },
    linkText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.brand?.[500] ?? colors.primary,
    },

    rowLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    label: { fontFamily: typography.fontFamily?.regular, fontSize: 12, color: colors.textSecondary },
    value: { fontFamily: typography.fontFamily?.medium, fontSize: 12, color: colors.textPrimary },

    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },

    sectionTitle: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 13,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },

    grayBox: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    graySplit: { width: 1, height: 36, backgroundColor: '#D8D8D8', marginHorizontal: spacing.md },
    grayLabel: { fontFamily: typography.fontFamily?.regular, fontSize: 11, color: colors.textSecondary },
    grayValue: { fontFamily: typography.fontFamily?.semibold, fontSize: 12, color: colors.textPrimary },
});