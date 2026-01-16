import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

type Mode = 'week' | 'range';

type Props = {
  // range state
  rangeStart: Date | null;
  rangeEnd: Date | null;
  setRangeStart: (d: Date | null) => void;
  setRangeEnd: (d: Date | null) => void;

  // modal open
  setMonthPickerOpen: (open: boolean) => void;

  // searching flags
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  setDidSearch: (v: boolean) => void;

  // mode + view range
  setMode: (m: Mode) => void;
  setViewStart: (d: Date | null) => void;
  setViewEnd: (d: Date | null) => void;
};

function minDate(a: Date, b: Date) {
  return a.getTime() <= b.getTime() ? a : b;
}
function maxDate(a: Date, b: Date) {
  return a.getTime() >= b.getTime() ? a : b;
}

export default function ActionDateRangeCalendar({
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  setMonthPickerOpen,
  isSearching,
  setIsSearching,
  setDidSearch,
  setMode,
  setViewStart,
  setViewEnd,
}: Props) {
  const onCancelPicker = useCallback(() => {
    setMonthPickerOpen(false);
    setRangeStart(null);
    setRangeEnd(null);
  }, [setMonthPickerOpen, setRangeStart, setRangeEnd]);

  const onSearchPicker = useCallback(async () => {
    // bắt buộc phải có ít nhất 1 ngày
    if (!rangeStart) return;

    setIsSearching(true);
    setDidSearch(true);

    // demo loading
    await new Promise<void>(resolve => setTimeout(resolve, 700));

    const start = rangeStart; // nếu chỉ chọn 1 ngày
    const end = rangeEnd ?? start;

    const s = minDate(start, end);
    const e = maxDate(start, end);

    setMode('range');
    setViewStart(s);
    setViewEnd(e);

    setMonthPickerOpen(false);
    setIsSearching(false);
  }, [
    rangeStart,
    rangeEnd,
    setIsSearching,
    setDidSearch,
    setMode,
    setViewStart,
    setViewEnd,
    setMonthPickerOpen,
  ]);

  const searchDisabled = !rangeStart || isSearching;
  return (
    <View style={styles.modalActions}>
      <Pressable onPress={onCancelPicker} style={styles.actionBtn}>
        <Text style={styles.actionTextMuted}>Huỷ</Text>
      </Pressable>

      <Pressable
        onPress={onSearchPicker}
        style={styles.actionBtn}
        disabled={searchDisabled}
      >
        <Text
          style={[styles.actionTextPrimary, searchDisabled && { opacity: 0.5 }]}
        >
          Tìm kiếm
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.sm },
  actionTextMuted: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionTextPrimary: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 13,
    color: colors.brand?.[500] ?? colors.primary,
  },
});
