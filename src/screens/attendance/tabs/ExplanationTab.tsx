import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';
import ExplanationCard, { ExplanationItem } from '../../../components/attendance/ExplanationCard';


function EmptyState({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
                <FontAwesome5 name="file-alt" size={22} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>{title}</Text>
            <Text style={styles.emptyDesc}>{desc}</Text>
        </View>
    );
}

export default function ExplanationTab({
    onPressCreate,
    onPressItem,
}: {
    onPressCreate: () => void;
    onPressItem: (it: ExplanationItem) => void;
}) {
    // ✅ MOCK theo Figma (sau này thay bằng API)
    const data: ExplanationItem[] = useMemo(
        () => [
            {
                id: '1',
                title: 'Quên checkin về',
                dateText: '30/08/2023',
                timeText: '08:05 - 17:20',
                status: 'approved',
                statusLabel: 'Đã duyệt',
                notePreview: 'Sidebar has been collecting the best design links of th...',

            },
            {
                id: '2',
                title: 'Giải trình đi muộn',
                dateText: '30/08/2023',
                timeText: '09:10 - 18:00',
                status: 'rejected',
                statusLabel: 'Từ chối',
                notePreview: 'Sidebar has been collecting the best design links of th...',

            },
            {
                id: '3',
                title: 'Xin ra ngoài',
                dateText: '30/08/2023',
                timeText: '14:00 - 15:00',
                status: 'pending',
                statusLabel: 'Chờ duyệt',
                notePreview: 'Sidebar has been collecting the best design links of th...',

            },
        ],
        []
    );

    const isEmpty = data.length === 0;

    return (
        <View style={styles.container}>
            {isEmpty ? (
                <EmptyState
                    title="Bạn không có đơn giải trình"
                    desc="Với những ngày làm thiếu giờ, hệ thống sẽ hiển thị và bạn có thể tạo đơn giải trình."
                />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(it) => it.id}
                    contentContainerStyle={{ paddingBottom: 90 }}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    renderItem={({ item: it }) => (
                        <ExplanationCard item={it} onPress={() => onPressItem(it)} />
                    )}
                />
            )}

            {/* ✅ FAB “Tạo đơn” */}
            <Pressable onPress={onPressCreate} style={styles.fab} hitSlop={10}>
                <FontAwesome5 name="pen" size={16} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    row: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    rowTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    rowSub: {
        marginTop: 4,
        ...typography.small,
        color: colors.textSecondary,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.lg,
    },

    pill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    pillText: {
        ...typography.small,
    },

    emptyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    emptyDesc: {
        marginTop: spacing.sm,
        ...typography.small,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
});
