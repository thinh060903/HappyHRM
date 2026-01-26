import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppText from '../../../components/ui/AppText';
import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

type LeaveRequestItem = {
    id: string;
    title: string;      // ví dụ: "Đơn nghỉ phép năm"
    dateText: string;   // ví dụ: "29/08/2023 - 30/08/2023"
    durationText: string; // ví dụ: "4 giờ"
    notePreview?: string;
    status: LeaveStatus;
};

function getStatusUI(status: LeaveStatus) {
    switch (status) {
        case 'pending':
            return {
                label: 'Chưa duyệt',
                bg: colors.warningSoft ?? 'rgba(255, 193, 7, 0.15)',
                fg: colors.warning ?? '#F5A623',
            };
        case 'approved':
            return {
                label: 'Đã duyệt',
                bg: colors.successSoft ?? 'rgba(46, 125, 50, 0.12)',
                fg: colors.success ?? '#2E7D32',
            };
        case 'rejected':
            return {
                label: 'Từ chối',
                bg: colors.dangerSoft ?? 'rgba(229, 57, 53, 0.12)',
                fg: colors.danger ?? '#E53935',
            };
    }
}

export default function LeaveRequestTab({
    // sau này bạn nhận date/employeeId để gọi API
    onPressCreate,
    onPressItem,
}: {
    onPressCreate?: () => void;
    onPressItem?: (item: LeaveRequestItem) => void;
}) {
    // ✅ TẠM mock data để chạy UI giống hình
    const data = useMemo<LeaveRequestItem[]>(
        () => [
            {
                id: '1',
                title: 'Đơn nghỉ phép năm',
                dateText: '30/08/2023',
                durationText: '4 giờ',
                notePreview: 'Sidebar has been collecting the best design links of th...',
                status: 'pending',
            },
            {
                id: '2',
                title: 'Nghỉ bù',
                dateText: '30/08/2023',
                durationText: '4 giờ',
                notePreview: 'Sidebar has been collecting the best design links of th...',
                status: 'rejected',
            },
            {
                id: '3',
                title: 'Nghỉ bệnh',
                dateText: '29/08/2023 - 30/08/2023',
                durationText: '4 giờ',
                notePreview: 'Sidebar has been collecting the best design links of th...',
                status: 'approved',
            },
        ],
        []
    );

    const isEmpty = data.length === 0;

    return (
        <View style={styles.wrap}>
            {isEmpty ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={it => it.id}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                    renderItem={({ item }) => (
                        <LeaveRequestRow
                            item={item}
                            onPress={() => onPressItem?.(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* FAB tạo đơn */}
            <Pressable
                onPress={onPressCreate}
                style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9 }]}
            >
                <Ionicons name="pencil" size={18} color="#fff" />
            </Pressable>
        </View>
    );
}

function LeaveRequestRow({
    item,
    onPress,
}: {
    item: LeaveRequestItem;
    onPress?: () => void;
}) {
    const ui = getStatusUI(item.status);

    return (
        <Pressable onPress={onPress} style={styles.row}>
            <View style={{ flex: 1 }}>
                <View style={styles.rowHeader}>
                    <View style={styles.titleWrap}>
                        <View style={[styles.leftBar, { backgroundColor: ui.fg }]} />
                        <AppText style={styles.title}>{item.title}</AppText>
                    </View>

                    <View style={[styles.pill, { backgroundColor: ui.bg }]}>
                        <AppText style={[styles.pillText, { color: ui.fg }]}>
                            {ui.label}
                        </AppText>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <AppText style={styles.metaText}>{item.dateText}</AppText>

                    <View style={{ width: spacing.md }} />

                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <AppText style={styles.metaText}>{item.durationText}</AppText>
                </View>

                {!!item.notePreview && (
                    <AppText numberOfLines={1} style={styles.note}>
                        {item.notePreview}
                    </AppText>
                )}
            </View>
        </Pressable>
    );
}

function EmptyState() {
    return (
        <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
                <Ionicons name="chatbubbles-outline" size={34} color={colors.textSecondary} />
            </View>

            <AppText style={styles.emptyTitle}>Chưa có thông tin đơn nghỉ</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.background },

    listContent: { padding: spacing.xs, paddingBottom: 96 },
    sep: { height: spacing.md },

    row: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
    },

    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },

    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    // dot: {
    //     width: 8,
    //     height: 8,
    //     borderRadius: 2,
    //     backgroundColor: colors.brand?.[500] ?? colors.primary,
    // },
    leftBar: { width: 4, height: 16, borderRadius: 2 },

    title: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 13,
        color: colors.textPrimary,
    },

    pill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: 999,
    },
    pillText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 11,
    },

    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: {
        fontFamily: typography.fontFamily?.regular,
        fontSize: 11,
        color: colors.textSecondary,
    },

    note: {
        marginTop: spacing.sm,
        fontFamily: typography.fontFamily?.regular,
        fontSize: 11,
        color: colors.textSecondary,
    },

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },

    fab: {
        position: 'absolute',
        right: spacing.xs,
        bottom: spacing.xs,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.brand?.[500] ?? colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});
