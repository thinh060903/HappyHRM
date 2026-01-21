import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import AppText from '../ui/AppText';
import { sameDay, pad2 } from '../../utils/date';

export type AttendanceStatus = 'success' | 'error' | 'off';

export type AttendanceDayItem = {
    id: string;
    date: Date;

    // hiển thị
    checkCode?: string; // "000897"
    shiftLabel?: string; // "Ca 5A"
    totalShift?: string; // "8 giờ"

    // tổng thực tế
    workedText?: string; // "07 giờ 15 phút"

    status: AttendanceStatus;

    // cảnh báo khi thiếu công nhưng chưa tạo đơn/giải trình
    showWarning?: boolean;

    // điều hướng nhanh từ icon cảnh báo
    warningTarget?: 'leave_request' | 'explanation';

    // bấm chi tiết
    onPressDetail?: () => void;
    onPressWarning?: () => void;
};

const formatVNDate = (d: Date) =>
    `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;


export default function AttendanceDayCard({ item }: { item: AttendanceDayItem }) {
    const isOff = item.status === 'off';
    const isError = item.status === 'error';
    const isSuccess = item.status === 'success';

    const leftBarColor = isOff
        ? colors.border
        : isError
            ? (colors.danger)
            : (colors.success);

    const timeColor = isOff
        ? colors.textSecondary
        : isError
            ? (colors.danger)
            : (colors.success);

    const containerBg = colors.surface;
    const today = new Date();

    return (
        <View style={[styles.wrap, { backgroundColor: containerBg }]}>
            {/* left status bar */}
            <View style={[styles.leftBar, { backgroundColor: leftBarColor }]} />

            <View style={styles.content}>
                {/* top row */}
                <View style={styles.rowTop}>
                    <View style={{ flex: 1 }}>
                        <AppText style={[styles.dateText, isOff && { color: colors.textSecondary }]}>
                            {sameDay(item.date, today)
                                ? `Hôm nay, ${formatVNDate(item.date)}`
                                : formatVNDate(item.date)}
                        </AppText>

                        <View style={styles.metaRow}>
                            <AppText style={styles.metaText}>
                                {item.checkCode ? `Mã chấm công: ${item.checkCode}` : '—'}
                            </AppText>
                            <View style={styles.dot} />
                            <AppText style={styles.metaText}>{item.shiftLabel ?? '—'}</AppText>
                            <View style={styles.dot} />
                            <AppText style={styles.metaText}>{item.totalShift ?? '—'}</AppText>
                        </View>
                    </View>

                    {/* right time + warning */}
                    <View style={styles.rightTop}>
                        {!isOff && (
                            <View style={styles.timeRow}>
                                {item.showWarning && (
                                    <Pressable
                                        onPress={item.onPressWarning}
                                        hitSlop={10}
                                        style={styles.warnBtn}
                                    >
                                        <Ionicons
                                            name="warning-outline"
                                            size={16}
                                            color={colors.danger ?? '#E53935'}
                                        />
                                    </Pressable>
                                )}

                                <AppText style={[styles.timeText, { color: timeColor }]}>
                                    {item.workedText ?? ''}
                                </AppText>
                            </View>
                        )}

                        <Pressable
                            onPress={item.onPressDetail}
                            disabled={isOff}
                            style={({ pressed }) => [
                                styles.detailBtn,
                                isOff && { opacity: 0.4 },
                                pressed && !isOff && { opacity: 0.7 },
                            ]}
                        >
                            <AppText style={styles.detailText}>Chi tiết</AppText>
                            <Ionicons name="chevron-forward" size={14} color={colors.brand?.[500] ?? colors.primary} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    leftBar: { width: 4 },
    content: { flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md },

    rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },

    dateText: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 13,
        color: colors.textPrimary,
    },

    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    metaText: {
        fontFamily: typography.fontFamily?.regular,
        fontSize: 11,
        color: colors.textSecondary,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },

    rightTop: { alignItems: 'flex-end', justifyContent: 'space-between' },

    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    warnBtn: { padding: 2 },

    timeText: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 12,
    },

    detailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    detailText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.brand?.[500] ?? colors.primary,
    },
});
