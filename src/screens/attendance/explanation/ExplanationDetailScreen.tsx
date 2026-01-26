import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function ExplanationDetailScreen() {
    const route = useRoute<any>();
    const id = route.params?.id;

    const title = useMemo(() => 'Chi tiết đơn yêu cầu', []);

    return (
        <Screen
            backgroundColor={colors.background}
            style={{ paddingHorizontal: 0, paddingTop: 0 }}
            edges={['left', 'right', 'bottom']}
        >
            <Header title={title} showBack variant="primary" />

            <View style={styles.card}>
                <Text style={styles.title}>Giải trình (ID: {id ?? '-'})</Text>
                <Text style={styles.sub}>Loại đơn: Thiếu chấm công</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Lý do</Text>
                <Text style={styles.value}>
                    (mock) Đi sớm về muộn do công việc đột xuất...
                </Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Người duyệt</Text>
                <Text style={styles.value}>(mock) Cao Anh Chiến</Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: spacing.lg,
        padding: spacing.lg,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    title: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    sub: {
        marginTop: 6,
        ...typography.small,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.lg,
    },
    label: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    value: {
        ...typography.body,
        color: colors.textPrimary,
    },
});
