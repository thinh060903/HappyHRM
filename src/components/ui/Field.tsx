import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../../themes/color';
import typography from '../../themes/typography';
import spacing from '../../themes/spacing';

export default function Field({
  label,
  value,
  placeholder,
  onPress,
  rightIcon = 'chevron-down',
  error,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
  rightIcon?: string;
  error?: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <Pressable
        disabled={!onPress}
        onPress={onPress}
        style={[
          styles.fieldBox,
          !!error && { borderColor: colors.danger },
          !onPress && { opacity: 1 },
        ]}
      >
        <Text
          style={[styles.fieldText, !value && { color: colors.textSecondary }]}
        >
          {value || placeholder || ''}
        </Text>

        {onPress ? (
          <FontAwesome5
            name={rightIcon as any}
            size={14}
            color={colors.textSecondary}
          />
        ) : (
          <View />
        )}
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  fieldBox: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  fieldText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
  },
});
