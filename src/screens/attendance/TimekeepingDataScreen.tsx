import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import AppText from '../../components/ui/AppText';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import DateRangeCalendar from '../../components/schedule/DateRangeCalendar';
import ActionDateRangeCalendar from '../../components/schedule/ActionDateRangeCalendar';

import AttendanceDayCard from '../../components/attendance/AttendanceDayCard';

import Chip from '../../components/attendance/Chip';

import useTimekeepingData from '../../hooks/attendance/useTimekeepingData';

export default function TimekeepingDataScreen() {
  const {
    monthPickerOpen,
    monthCursor,
    rangeStart,
    rangeEnd,
    isSearching,
    filteredData,
    titleText,
    setViewStart,
    setViewEnd,
    setMonthPickerOpen,
    setMonthCursor,
    setRangeStart,
    setRangeEnd,
    setIsSearching,
    setDidSearch,
    setMode,
    filter,
    setFilter,
    onPressDetail,
    onPressWarning,
  } = useTimekeepingData();

  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      <Header title="Dữ liệu chấm công" showBack variant="primary" />
      {/* Month row */}
      <View style={styles.monthRow}>
        <View style={styles.monthLeft}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <AppText style={styles.monthText}>{titleText}</AppText>
        </View>

        <Pressable
          onPress={() => setMonthPickerOpen(true)}
          hitSlop={10}
          style={({ pressed }) => [
            styles.monthArrowBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="swap-vertical-outline" // icon “2 mũi tên”
            size={18}
            color={colors.brand?.[500] ?? colors.primary}
          />
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <Text style={styles.sortLabel}>Lọc theo:</Text>
        <Chip
          label="Có đơn"
          active={filter === 'all'} // em có thể đổi “Có đơn” -> “Tất cả” nếu muốn
          onPress={() => setFilter('all')}
        />
        <Chip
          label="Chưa tạo đơn"
          active={filter === 'no_request'}
          onPress={() => setFilter('no_request')}
        />
        <Chip
          label="Thiếu chấm công"
          active={filter === 'missing'}
          onPress={() => setFilter('missing')}
        />
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.map(item => (
          <AttendanceDayCard
            key={item.id}
            item={{
              ...item,
              onPressDetail: () => onPressDetail(item),
              onPressWarning: () => onPressWarning(item),
            }}
          />
        ))}
      </ScrollView>

      {/* Modal: DateRangeCalendar + ActionDateRangeCalendar */}
      <Modal visible={monthPickerOpen} transparent animationType="slide">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMonthPickerOpen(false)}
        />

        <View style={styles.modalSheet}>
          <DateRangeCalendar
            monthCursor={monthCursor}
            onPrevMonth={() =>
              setMonthCursor(
                prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            onNextMonth={() =>
              setMonthCursor(
                prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onPickDay={(d: Date) => {
              // pick logic đơn giản:
              // - nếu chưa có start -> setStart
              // - nếu có start rồi -> setEnd
              if (!rangeStart) {
                setRangeStart(d);
                setRangeEnd(null);
                return;
              }
              if (rangeStart && !rangeEnd) {
                setRangeEnd(d);
                return;
              }
              // nếu đủ rồi mà bấm tiếp: reset lại start
              setRangeStart(d);
              setRangeEnd(null);
            }}
          />

          <ActionDateRangeCalendar
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            setRangeStart={setRangeStart}
            setRangeEnd={setRangeEnd}
            setMonthPickerOpen={setMonthPickerOpen}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            setDidSearch={setDidSearch}
            setMode={setMode}
            setViewStart={setViewStart}
            setViewEnd={setViewEnd}
          />
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },
  monthRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  monthText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  monthArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  sortLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },

  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.backgroundRow,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
