import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import { colors } from '../../themes/color';
import typography from '../../themes/typography';

export type Employee = {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  avatar?: string;
  createdAt: number;
};

function getInitials(name: String) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

export default function EmployeeRow({ item }: { item: Employee }) {
  const hasAvatar = !!item.avatar;

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        {hasAvatar ? (
          <Image source={{ uri: item.avatar! }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {getInitials(item.name)}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.metaRow}>
          <FontAwesome5 name="envelope" size={12} color={colors.primary} />
          <Text style={styles.metaText}>{item.email}</Text>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome5 name="briefcase" size={12} color={colors.primary} />
          <Text style={styles.metaText}>{item.title}</Text>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome5
            name="map-marker-alt"
            size={12}
            color={colors.primary}
          />
          <Text style={styles.metaText}>{item.department}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },

  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: 44, height: 44 },
  avatarFallback: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },

  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
