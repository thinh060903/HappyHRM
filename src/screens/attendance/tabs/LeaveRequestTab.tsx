import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../../components/ui/AppText';
import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function LeaveRequestTab() {
    return (
        <View style={styles.wrap}>
            <AppText style={styles.text}>TODO: View Quản lý đơn nghỉ</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { padding: spacing.lg },
    text: { fontFamily: typography.fontFamily?.regular, color: colors.textSecondary },
});
