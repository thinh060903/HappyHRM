import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({ open, onClose, onConfirm }: Props) {
  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIcon}>
            <FontAwesome5 name="check" size={18} color="#0D7A3B" />
          </View>

          <Text style={styles.modalTitle}>Cập nhật đơn giải trình?</Text>
          <Text style={styles.modalDesc}>
            Bạn xác nhận gửi/cập nhật đơn giải trình chấm công này chứ?
          </Text>

          <View style={styles.modalActions}>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>
                Hủy
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  modalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E7F6EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  modalDesc: {
    marginTop: spacing.sm,
    ...typography.small,
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  btn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnText: {
    ...typography.button,
  },
});
