import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';
import ConfirmModal from './components/ConfirmModal';
import { useCreateExplanation } from '../../../hooks/attendance/explanation/useCreateExplanation';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

export default function CreateExplanationScreen() {
  const {
    content,
    setContent,
    confirmOpen,
    canSubmit,
    onSubmit,
    closeConfirm,
    onConfirm,
  } = useCreateExplanation();

  return (
    <Screen
      backgroundColor={colors.background}
      style={{ paddingHorizontal: 0, paddingTop: 0 }}
      edges={['left', 'right', 'bottom']}
      keyboardAvoiding
      keyboardVerticalOffset={0}
    >
      <Header title="Giải trình chấm công" showBack backgroundColor="#FFFFFF" />

      <View style={styles.form}>
        <Text style={styles.label}>Nội dung giải trình</Text>

        <View style={styles.textAreaWrap}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="VD: Đi sớm về muộn vì..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={styles.textArea}
          />
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
        >
          <Text style={styles.submitText}>Cập nhật</Text>
        </Pressable>
      </View>

      <ConfirmModal
        open={confirmOpen}
        onClose={closeConfirm}
        onConfirm={onConfirm}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: spacing.lg,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  textAreaWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 140,
  },
  textArea: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: spacing.xl,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitText: {
    ...typography.button,
    color: '#fff',
  },
});
