import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';
import { Shift } from '../../types/schedule';

type Props = {
  shifts: Shift[];
  emptyText?: string;
};

export default function ShiftList({
  shifts,
  emptyText = 'Hôm nay chưa có ca làm việc.',
}: Props) {
  return (
    <View style={styles.wrap}>
      {shifts.length === 0 ? (
        <Text style={styles.empty}>{emptyText}</Text>
      ) : (
        shifts.map(s => (
          <View key={s.id} style={styles.row}>
            <Text style={styles.text}>
              {`• ${s.start} - ${s.end}: `}
              <Text style={styles.room}>{s.room}</Text>
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
  },
  row: {
    paddingVertical: 4,
  },
  text: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  room: {
    ...typography.caption,
    color: '#0D7A3B', // bạn có thể đổi sang colors.success nếu đã có
  },
  empty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
