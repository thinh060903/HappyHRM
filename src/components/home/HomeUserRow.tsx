import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

type Props = {
  avatar: string;
  name: string;
  role: string;

  timeText: string; // "09:44:12"
  isOnTime: boolean; // true/false
  onPressProfile: () => void;
};

export default function HomeUserRow({
  avatar,
  name,
  role,
  timeText,
  isOnTime,
  onPressProfile,
}: Props) {
  const iconName = isOnTime ? 'check-circle' : 'times-circle';

  return (
    <View style={styles.userRow}>
      <Pressable onPress={onPressProfile} style={styles.userPress} hitSlop={10}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.helloText}>Xin chào {name}!</Text>
          <Text style={styles.roleText}>{role}</Text>
        </View>
      </Pressable>

      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{timeText}</Text>

        <View
          style={[
            styles.status,
            { backgroundColor: isOnTime ? '#0D7A3B' : '#C81D25' },
          ]}
        >
          <View style={styles.statusPill}>
            <FontAwesome5
              name={iconName}
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.statusPillText}>
              {isOnTime ? 'Đúng giờ' : 'Đi muộn'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  userPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand[50],
  },
  helloText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  roleText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusPillText: {
    ...typography.small,
    color: '#fff',
  },
});
