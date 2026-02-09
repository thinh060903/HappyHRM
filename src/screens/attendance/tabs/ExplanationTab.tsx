import React from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';
import ExplanationCard from '../../../components/attendance/explanation/ExplanationCard';
import { ExplanationItem } from '../../../types/attendance/explanation';
import { explanationMockData } from '../../../data/attendance/explanationItem.mock';
import ExplanationEmptyState from '../../../components/attendance/explanation/ExplanationEmptyState';

export default function ExplanationTab({
  onPressCreate,
  onPressItem,
}: {
  onPressCreate: () => void;
  onPressItem: (it: ExplanationItem) => void;
}) {
  const isEmpty = explanationMockData.length === 0;

  return (
    <View style={styles.container}>
      {isEmpty ? (
        <ExplanationEmptyState
          title="Bạn không có đơn giải trình"
          desc="Với những ngày làm thiếu giờ, hệ thống sẽ hiển thị và bạn có thể tạo đơn giải trình."
        />
      ) : (
        <FlatList
          data={explanationMockData}
          keyExtractor={it => it.id}
          contentContainerStyle={{ paddingBottom: 90 }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item: it }) => (
            <ExplanationCard item={it} onPress={() => onPressItem(it)} />
          )}
        />
      )}

      {/* ✅ FAB “Tạo đơn” */}
      <Pressable onPress={onPressCreate} style={styles.fab} hitSlop={10}>
        <FontAwesome5 name="pen" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    ...typography.small,
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
