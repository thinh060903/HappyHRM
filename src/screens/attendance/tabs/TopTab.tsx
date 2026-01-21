import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../components/ui/AppText';
import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function TopTab({
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
            <AppText style={[styles.tabText, active && styles.tabTextActive]}>{label}</AppText>
            {active && <View style={styles.tabUnderline} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
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
});
