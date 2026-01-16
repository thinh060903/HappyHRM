import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import typography from '../../themes/typography';
import { colors } from '../../themes/color';

type Props = {
  label: string;
  iconName: string; // FontAwesome5 name
  onPress: () => void;
};

export default function HomeActionItem({ label, iconName, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.iconItem} hitSlop={8}>
      <View style={styles.iconCircle}>
        <FontAwesome5
          name={iconName as any}
          size={18}
          color={colors.textPrimary}
        />
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconItem: {
    width: '20%',
    minWidth: 72,
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    ...typography.small,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
