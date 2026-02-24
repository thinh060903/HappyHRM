import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

import Header from '../../../components/layout/Header';
import Screen from '../../../components/layout/Screen';

// ✅ dùng lịch của bạn
import DateRangeCalendar from '../../../components/schedule/DateRangeCalendar';
import BottomSheetSingleSelect from '../../../components/ui/BottomSheetSingleSelect';

import { RequestType } from '../../../types/request/requestType';
import { LeaveSubtype } from '../../../types/request/leaveSubtype';
import useCreateRequest from '../../../hooks/request/tabs/useCreateRequest';
import Field from '../../../components/ui/Field';

export default function CreateRequestScreen() {
  const {
    type,
    setType,
    typeOpen,
    setTypeOpen,
    TYPE_LABEL,
    leaveSubtype,
    setLeaveSubtype,
    leaveSubtypeOpen,
    setLeaveSubtypeOpen,
    LEAVE_SUBTYPE_LABEL,
    // setRangeStart,
    // setRangeEnd,
    calendarOpen,
    setCalendarOpen,
    dr,
    timeText,
    otStartTime,
    setOtStartTime,
    otEndTime,
    setOtEndTime,
    note,
    setNote,
    errors,
    canSubmit,
    onSubmit,
  } = useCreateRequest();

  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      <Header title="Tạo đơn yêu cầu" showBack backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Loại đơn */}
        <Field
          label="Loại đơn yêu cầu"
          value={TYPE_LABEL[type]}
          placeholder="Chọn loại đơn"
          onPress={() => setTypeOpen(true)}
        />

        {/* Leave subtype (chỉ hiện khi nghỉ phép) */}
        {type === 'LEAVE' && (
          <Field
            label="Loại nghỉ phép"
            value={LEAVE_SUBTYPE_LABEL[leaveSubtype]}
            placeholder="Chọn loại nghỉ phép"
            onPress={() => setLeaveSubtypeOpen(true)}
          />
        )}

        {/* Thời gian */}
        <Field
          label="Thời gian"
          value={timeText}
          placeholder="Chọn thời gian"
          rightIcon="calendar-alt"
          onPress={() => setCalendarOpen(true)}
          error={errors.time}
        />

        {/* OT extra */}
        {type === 'OT' && (
          <View style={{ gap: spacing.md }}>
            <Text style={styles.fieldLabel}>Giờ tăng ca</Text>

            <View style={styles.twoCols}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.subLabel}>Từ</Text>
                <TextInput
                  value={otStartTime}
                  onChangeText={setOtStartTime}
                  placeholder="18:00"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                />
              </View>

              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.subLabel}>Đến</Text>
                <TextInput
                  value={otEndTime}
                  onChangeText={setOtEndTime}
                  placeholder="21:00"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                />
              </View>
            </View>

            {!!errors.ot && <Text style={styles.errorText}>{errors.ot}</Text>}
          </View>
        )}

        {/* Nội dung */}
        <View style={{ gap: 6 }}>
          <Text style={styles.fieldLabel}>Nội dung</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Nhập nội dung..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
          />
        </View>

        {/* Submit */}
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.submitBtn, !canSubmit && { opacity: 0.4 }]}
        >
          <Text style={styles.submitText}>Gửi đơn</Text>
        </Pressable>
      </ScrollView>

      {/* Pickers */}
      <BottomSheetSingleSelect
        visible={typeOpen}
        title="Loại đơn yêu cầu"
        selected={type}
        onClose={() => setTypeOpen(false)}
        options={[
          { key: 'LEAVE', label: 'Đơn nghỉ phép' },
          { key: 'OT', label: 'Đơn tăng ca' },
          { key: 'EXPLAIN', label: 'Giải trình' },
        ]}
        onSelect={k => {
          setType(k as RequestType);
          setTypeOpen(false);
        }}
      />

      <BottomSheetSingleSelect
        visible={leaveSubtypeOpen}
        title="Loại nghỉ phép"
        selected={leaveSubtype}
        onClose={() => setLeaveSubtypeOpen(false)}
        options={[
          { key: 'ANNUAL', label: 'Nghỉ phép năm' },
          { key: 'UNPAID', label: 'Nghỉ không lương' },
          { key: 'SICK', label: 'Nghỉ ốm' },
          { key: 'MATERNITY', label: 'Nghỉ thai sản' },
          { key: 'OTHER', label: 'Khác' },
        ]}
        onSelect={k => {
          setLeaveSubtype(k as LeaveSubtype);
          setLeaveSubtypeOpen(false);
        }}
      />

      {/* Calendar dialog */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCalendarOpen(false)}
        >
          <Pressable style={styles.calendarDialog} onPress={() => {}}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Chọn thời gian</Text>
              <Pressable onPress={() => setCalendarOpen(false)} hitSlop={10}>
                <FontAwesome5
                  name="times"
                  size={18}
                  color={colors.textPrimary}
                />
              </Pressable>
            </View>

            {/* ✅ Calendar component của bạn */}
            <DateRangeCalendar
              monthCursor={dr.monthCursor}
              onPrevMonth={dr.onPrevMonth}
              onNextMonth={dr.onNextMonth}
              rangeStart={dr.rangeStart}
              rangeEnd={dr.rangeEnd}
              onPickDay={dr.onPickDay}
            />

            <View style={styles.calendarActions}>
              <Pressable
                style={[styles.btn, styles.btnOutline]}
                onPress={() => {
                  // setRangeStart(null);
                  // setRangeEnd(null);
                  dr.reset();
                  setCalendarOpen(false);
                }}
              >
                <Text style={[styles.btnText, styles.btnOutlineText]}>
                  Đóng
                </Text>
              </Pressable>

              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => setCalendarOpen(false)}
              >
                <Text style={[styles.btnText, styles.btnPrimaryText]}>
                  Xác nhận
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },

  fieldLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  subLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },

  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },

  twoCols: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  submitBtn: {
    marginTop: spacing.md,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    ...typography.bodyMedium,
    color: '#fff',
  },

  errorText: {
    ...typography.small,
    color: colors.danger,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  sheetHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  sheetRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetRowActive: {
    backgroundColor: '#FFF2EA',
  },
  sheetRowText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  sheetRowTextActive: {
    fontFamily: typography.fontFamily?.medium,
  },

  calendarDialog: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  calendarHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  calendarActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
