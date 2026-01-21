import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppText from '../../../components/ui/AppText';
import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

import type { AttendanceDayItem } from '../../../components/attendance/AttendanceDayCard';
import { pad2, sameDay } from '../../../utils/date';

const formatVNDate = (d: Date) =>
    `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

export default function InfoTab({ item }: { item?: AttendanceDayItem }) {
    const today = new Date();
    const d = item?.date ? new Date(item.date) : today;

    const status = item?.status ?? 'off';
    const workedText = item?.workedText ?? '--';

    // ✅ đúng rule 3 trạng thái:
    // - thiếu công: đỏ
    // - đủ công: xanh
    const timeColor =
        status === 'error'
            ? colors.danger
            : status === 'success'
                ? colors.success
                : colors.textSecondary;

    // - chỉ hiện dấu chấm than khi: thiếu công + chưa tạo đơn/giải trình
    const showExclamation = status === 'error' && !!item?.showWarning;

    return (
        <View style={{ gap: spacing.md }}>
            {/* CARD 1 */}
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

            {/* CARD 2 */}
            <View style={styles.card}>
                <AppText style={styles.sectionTitle}>Thông tin chấm công</AppText>

                <View style={styles.rowLine}>
                    <AppText style={styles.label}>Tổng thời gian thực tế</AppText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {showExclamation && (
                            <Ionicons name="alert-circle" size={16} color={colors.danger} />
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

const styles = StyleSheet.create({
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
