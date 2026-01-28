import React, { useMemo, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppText from '../ui/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';


type RequestType = 'LEAVE' | 'OT' | 'EXPLAIN';
type RequestStatus = 'pending' | 'approved' | 'rejected';

type RequestItem = {
    id: string;
    type: RequestType;
    title: string; // hiển thị dòng tiêu đề: "Đơn nghỉ phép năm", "Đơn tăng ca"...
    timeText: string; // "05/11 - 11/11/2023" hoặc "05/11/2023"
    createdAtText: string; // "25/08/2023, 2 giờ"
    status: RequestStatus;
    notePreview?: string;
};

function getStatusUI(status: RequestStatus) {
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

export default function RequestCard({
    item,
    onPress,
}: {
    item: RequestItem;
    onPress: () => void;
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
                    <AppText style={styles.metaText}>{item.timeText}</AppText>

                    <View style={{ width: spacing.md }} />

                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <AppText style={styles.metaText}>{item.createdAtText}</AppText>
                </View>

                <View style={styles.noteWrap}>
                    <FontAwesome5 name="pen" size={12} color={colors.textSecondary} />
                    <AppText numberOfLines={1} style={styles.note}>
                        {item.notePreview}
                    </AppText>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    titleWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
    noteWrap: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    note: {
        fontFamily: typography.fontFamily?.regular,
        fontSize: 11,
        color: colors.textSecondary,
    },
});
