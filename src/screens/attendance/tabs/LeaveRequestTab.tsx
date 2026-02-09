import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import { colors } from '../../../themes/color';

import LeaveRequestCard from '../../../components/attendance/leaveRequest/LeaveRequestCard';
import { LeaveRequestItem } from '../../../types/attendance/leaveRequestItem';
import { leaveRequestMockData } from '../../../data/attendance/leaveRequestItem.mock';
import LeaveRequestEmptyState from '../../../components/attendance/leaveRequest/LeaveRequestEmptyState';

export default function LeaveRequestTab({
  // sau này bạn nhận date/employeeId để gọi API
  onPressCreate,
  onPressItem,
}: {
  onPressCreate?: () => void;
  onPressItem?: (item: LeaveRequestItem) => void;
}) {
  const isEmpty = leaveRequestMockData.length === 0;

  return (
    <View style={styles.container}>
      {isEmpty ? (
        <LeaveRequestEmptyState />
      ) : (
        <FlatList
          data={leaveRequestMockData}
          keyExtractor={it => it.id}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => (
            <LeaveRequestCard item={item} onPress={() => onPressItem?.(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB tạo đơn */}
      <Pressable
        onPress={onPressCreate}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9 }]}
      >
        <FontAwesome5 name="pen" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  listContent: { paddingBottom: 96 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },

  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
