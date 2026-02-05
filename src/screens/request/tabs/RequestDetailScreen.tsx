import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

import Header from '../../../components/layout/Header';
import Screen from '../../../components/layout/Screen';
import RequestCard from '../../../components/request/RequestCard';

import { useRequestDetail } from '../../../hooks/request/tabs/useRequestDetail';

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '-'}</Text>
    </View>
  );
}

export default function RequestDetailScreen() {
  const { item, detail } = useRequestDetail();

  return (
    <Screen
      backgroundColor={colors.backgroundRow} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      <Header title="Chi tiết đơn yêu cầu" showBack backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top summary card */}
        <RequestCard item={item} onPress={() => {}} />

        {/* Info section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            {item.type === 'LEAVE' && (
              <Row label="Loại nghỉ phép" value={detail.leaveTypeLabel} />
            )}
            <Row label="Thời gian" value={item.timeText} />
            <Row label="Ngày tạo" value={detail.createdDate} />
            <Row
              label="Số giờ / Số ngày"
              value={item.type === 'LEAVE' ? 'Có phép' : '—'}
            />
            <Row label="Người duyệt" value={detail.approverName} />
            <Row label="CC" value={detail.ccName} />

            <View style={styles.divider} />

            <Text style={styles.noteLabel}>Nội dung</Text>
            <Text style={styles.noteText}>{detail.reason}</Text>
          </View>
        </View>

        {/* Actions (demo) */}
        {item.status === 'pending' && (
          <View style={styles.actionsWrap}>
            <Pressable
              style={[styles.btn, styles.btnOutline]}
              onPress={() => {}}
            >
              <Text style={[styles.btnText, styles.btnOutlineText]}>
                Hủy đơn
              </Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => {}}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText]}>
                Chỉnh sửa
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },

  section: {
    gap: spacing.sm,
  },

  sectionCard: {
    backgroundColor: '#fff',
    // borderRadius: 16,
    // borderWidth: 1,
    // borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.body,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  noteLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  noteText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  actionsWrap: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...typography.bodyMedium,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  btnOutlineText: {
    color: colors.primary,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    color: '#fff',
  },
});
