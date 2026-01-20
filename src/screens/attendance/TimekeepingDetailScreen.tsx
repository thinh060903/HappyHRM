import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import AppText from '../../components/ui/AppText';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

type TabKey = 'info' | 'leave_request' | 'explanation';

export default function TimekeepingDetailScreen() {
    const route = useRoute<any>();
    const initialTab: TabKey = route.params?.tab ?? 'info';

    const [tab, setTab] = useState<TabKey>(initialTab);

    const title = useMemo(() => 'Chi tiết chấm công', []);

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title={title} showBack variant="primary" />
            {/* tab bar sát header */}
            <View style={styles.tabBar}>
                <TopTab label="Thông tin" active={tab === 'info'} onPress={() => setTab('info')} />
                <TopTab
                    label="Quản lý đơn nghỉ"
                    active={tab === 'leave_request'}
                    onPress={() => setTab('leave_request')}
                />
                <TopTab
                    label="Quản lý giải trình"
                    active={tab === 'explanation'}
                    onPress={() => setTab('explanation')}
                />
            </View>

            {/* content (tạm để trống / placeholder) */}
            <View style={styles.body}>
                {tab === 'info' && <AppText style={styles.placeholder}>TODO: View Thông tin</AppText>}
                {tab === 'leave_request' && (
                    <AppText style={styles.placeholder}>TODO: View Quản lý đơn nghỉ</AppText>
                )}
                {tab === 'explanation' && (
                    <AppText style={styles.placeholder}>TODO: View Quản lý giải trình</AppText>
                )}
            </View>
        </Screen>
    );
}

function TopTab({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.tabItem}>
            <AppText style={[styles.tabText, active && styles.tabTextActive]}>
                {label}
            </AppText>
            {active && <View style={styles.tabUnderline} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    tabText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.brand?.[500] ?? colors.primary,
        fontFamily: typography.fontFamily?.semibold,
    },
    tabUnderline: {
        marginTop: 8,
        height: 2,
        width: '60%',
        borderRadius: 2,
        backgroundColor: colors.brand?.[500] ?? colors.primary,
    },

    body: { flex: 1, padding: spacing.lg, backgroundColor: colors.background },
    placeholder: {
        fontFamily: typography.fontFamily?.regular,
        color: colors.textSecondary,
    },
});
