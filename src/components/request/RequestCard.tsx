import React, { useMemo, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';


import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

type RequestType = 'LEAVE' | 'OT' | 'EXPLAIN';
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type RequestItem = {
    id: string;
    type: RequestType;
    title: string; // hiển thị dòng tiêu đề: "Đơn nghỉ phép năm", "Đơn tăng ca"...
    timeText: string; // "05/11 - 11/11/2023" hoặc "05/11/2023"
    createdAtText: string; // "25/08/2023, 2 giờ"
    status: RequestStatus;
};

const STATUS_STYLE: Record<
    RequestStatus,
    { bg: string; text: string; border?: string }
> = {
    PENDING: { bg: '#FFF3D6', text: '#9A6700', border: '#FFE2A8' },
    APPROVED: { bg: '#E8F7EF', text: '#0D7A3B', border: '#CFEFDB' },
    REJECTED: { bg: '#FDE8EA', text: '#B42318', border: '#FAC5CC' },
};

const STATUS_LABEL: Record<RequestStatus, string> = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
};

export default function RequestCard({
    item,
    onPress,
}: {
    item: RequestItem;
    onPress: () => void;
}) {
    const ss = STATUS_STYLE[item.status];

    return (
        <Pressable onPress={onPress} style={styles.card} android_ripple={{ color: '#00000010' }}>
            <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <View
                    style={[
                        styles.statusPill,
                        { backgroundColor: ss.bg, borderColor: ss.border ?? ss.bg },
                    ]}
                >
                    <Text style={[styles.statusText, { color: ss.text }]}>
                        {STATUS_LABEL[item.status]}
                    </Text>
                </View>
            </View>

            <Text style={styles.cardTime}>{item.timeText}</Text>

            <View style={styles.cardBottom}>
                <Text style={styles.cardMeta}>{item.createdAtText}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    cardTitle: {
        flex: 1,
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    statusPill: {
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        ...typography.small,
    },
    cardTime: {
        marginTop: spacing.sm,
        ...typography.body,
        color: colors.textSecondary,
    },
    cardBottom: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardMeta: {
        ...typography.small,
        color: colors.textSecondary,
    },
});
