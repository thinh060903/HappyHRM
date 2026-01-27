import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import AppText from '../../../components/ui/AppText';
import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

import LeaveRequestCard from '../../../components/attendance/LeaveRequestCard';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

type LeaveRequestItem = {
    id: string;
    title: string;      // ví dụ: "Đơn nghỉ phép năm"
    dateText: string;   // ví dụ: "29/08/2023 - 30/08/2023"
    durationText: string; // ví dụ: "4 giờ"
    notePreview?: string;
    status: LeaveStatus;
};

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
        <View style={styles.container}>
            {isEmpty ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={it => it.id}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    renderItem={({ item }) => (
                        <LeaveRequestCard
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
                <FontAwesome5 name="pen" size={16} color="#fff" />
            </Pressable>
        </View>
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
    container: { flex: 1 },

    listContent: { paddingBottom: 96 },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.lg,
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
