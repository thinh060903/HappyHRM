import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppText from '../../ui/AppText';
import { colors } from '../../../themes/color';
import typography from '../../../themes/typography';
import spacing from '../../../themes/spacing';

export default function LeaveRequestEmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Ionicons
          name="chatbubbles-outline"
          size={34}
          color={colors.textSecondary}
        />
      </View>

      <AppText style={styles.emptyTitle}>Chưa có thông tin đơn nghỉ</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
