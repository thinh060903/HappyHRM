import React from 'react';
import { StyleSheet, View } from 'react-native';

import spacing from '../../themes/spacing';
import HomeActionItem from './HomeActionItem';

export type HomeAction = {
  key: string;
  label: string;
  iconName: string;
  onPress: () => void;
};

type Props = {
  actions: HomeAction[];
};

export default function HomeActionsGrid({ actions }: Props) {
  return (
    <View style={styles.grid}>
      {actions.map(a => (
        <HomeActionItem
          key={a.key}
          label={a.label}
          iconName={a.iconName}
          onPress={a.onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
});
