import React from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';
import AppText from '../../../components/ui/AppText';
import { useLeaveRequestDetail } from '../../../hooks/attendance/leaveRequest/useLeaveRequestDetail';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function LeaveRequestDetailScreen() {
  const { title, fields } = useLeaveRequestDetail();

  return (
    <Screen
      backgroundColor={colors.background}
      style={styles.screen}
      edges={['left', 'right', 'bottom']}
      keyboardAvoiding
      keyboardVerticalOffset={0}
    >
      <Header title={title} showBack backgroundColor="#FFFFFF" />

      <View style={styles.body}>
        <View style={styles.card}>
          {fields.map((item, index) => (
            <React.Fragment key={item.label}>
              <Row label={item.label} value={item.value} />
              {index < fields.length - 1 && <Divider />}
            </React.Fragment>
          ))}
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
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
