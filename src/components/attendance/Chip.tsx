import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import AppText from '../../components/ui/AppText';

import typography from '../../themes/typography';
import { colors } from '../../themes/color';

export default function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && { opacity: 0.7 },
      ]}
    >
      <AppText style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: colors.brand?.[500] ?? colors.primary,
    backgroundColor: 'rgba(244, 148, 89, 0.10)',
  },
  chipText: {
    fontFamily: typography.fontFamily?.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.brand?.[500] ?? colors.primary,
  },
});
