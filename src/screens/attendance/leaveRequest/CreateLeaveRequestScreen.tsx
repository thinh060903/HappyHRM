import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';
import AppText from '../../../components/ui/AppText';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function CreateLeaveRequestScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const [typeLabel, setTypeLabel] = useState<string>('Chọn loại đơn');

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title="Tạo đơn yêu cầu" showBack variant="primary" />

            <View style={styles.body}>
                {/* Section: Loại đơn yêu cầu */}
                <AppText style={styles.sectionTitle}>Loại đơn yêu cầu</AppText>

                <Pressable
                    onPress={() => {
                        // TODO: mở BottomSheet chọn loại đơn
                        // tạm demo:
                        setTypeLabel('Nghỉ phép năm');
                    }}
                    style={styles.selectBox}
                >
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.label}>Loại đơn</AppText>
                        <AppText style={styles.valueMuted}>{typeLabel}</AppText>
                    </View>

                    <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                </Pressable>

                {/* Section: Thông tin đơn */}
                <View style={{ height: spacing.lg }} />
                <AppText style={styles.sectionTitle}>Thông tin đơn yêu cầu</AppText>

                {/* (Tạm placeholder) */}
                <View style={styles.card}>
                    <AppText style={styles.label}>Thời gian</AppText>
                    <AppText style={styles.valueMuted}>
                        {route.params?.date ? `Ngày: ${route.params.date}` : 'Ngày bắt đầu → Ngày kết thúc'}
                    </AppText>
                </View>

                {/* Submit button (tạm) */}
                <View style={{ flex: 1 }} />
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.9 }]}
                >
                    <AppText style={styles.submitText}>Gửi đơn</AppText>
                </Pressable>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },
    body: { flex: 1, padding: spacing.lg },

    sectionTitle: {
        fontFamily: typography.fontFamily?.semibold,
        fontSize: 13,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },

    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.lg,
    },

    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.lg,
    },

    label: {
        fontFamily: typography.fontFamily?.regular,
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 6,
    },
    valueMuted: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },

    submitBtn: {
        height: 44,
        borderRadius: 10,
        backgroundColor: colors.brand?.[500] ?? colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        fontFamily: typography.fontFamily?.semibold,
        color: '#fff',
        fontSize: 13,
    },
});
