import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';
import AppText from '../../../components/ui/AppText';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function LeaveRequestDetailScreen() {
    const route = useRoute<any>();
    const id = route.params?.id ?? '—';

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title="Chi tiết đơn yêu cầu" showBack variant="primary" />

            <View style={styles.body}>
                <View style={styles.card}>
                    <Row label="Mã đơn" value={id} />
                    <Divider />
                    <Row label="Loại đơn" value="Đơn nghỉ phép năm" />
                    <Divider />
                    <Row label="Ngày làm việc" value="29/08/2023 - 30/08/2023" />
                    <Divider />
                    <Row label="Số phút nghỉ" value="60 phút" />
                    <Divider />
                    <Row label="Lý do" value="Cá nhân" />
                    <Divider />
                    <Row label="Nội dung" value="…" />
                    <Divider />
                    <Row label="Người duyệt" value="[APS141215001] Cao Anh Chiến" />
                </View>
            </View>
        </Screen>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.row}>
            <AppText style={styles.label}>{label}</AppText>
            <AppText style={styles.value}>{value}</AppText>
        </View>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },
    body: { padding: spacing.lg },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        gap: spacing.md,
    },

    row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg },
    label: {
        fontFamily: typography.fontFamily?.regular,
        fontSize: 12,
        color: colors.textSecondary,
    },
    value: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: 'right',
        flexShrink: 1,
    },

    divider: { height: 1, backgroundColor: colors.border },
});
