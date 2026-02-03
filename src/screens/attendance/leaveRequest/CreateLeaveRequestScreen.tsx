import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';
import AppText from '../../../components/ui/AppText';
import { useCreateRequest } from './hooks/useCreateRequest';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function CreateLeaveRequestScreen() {
  const { typeLabel, dateText, selectType, submit } = useCreateRequest();

  return (
    <Screen
      backgroundColor={colors.background}
      style={styles.screen}
      edges={['left', 'right', 'bottom']}
      keyboardAvoiding
      keyboardVerticalOffset={0}
    >
      <Header title="Tạo đơn yêu cầu" showBack backgroundColor="#FFFFFF" />

      <View style={styles.body}>
        <AppText style={styles.sectionTitle}>Loại đơn yêu cầu</AppText>

        <Pressable onPress={selectType} style={styles.selectBox}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.label}>Loại đơn</AppText>
            <AppText style={styles.valueMuted}>{typeLabel}</AppText>
          </View>

          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>

        <View style={{ height: spacing.lg }} />
        <AppText style={styles.sectionTitle}>Thông tin đơn yêu cầu</AppText>

        <View style={styles.card}>
          <AppText style={styles.label}>Thời gian</AppText>
          <AppText style={styles.valueMuted}>{dateText}</AppText>
        </View>

        <View style={{ flex: 1 }} />
        <Pressable
          onPress={submit}
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && { opacity: 0.9 },
          ]}
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
