import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';

import { colors } from '../../themes/color';

export default function DiagramScreen() {
  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      {' '}
      {/* Header */}
      <Header title="Sơ đồ" showBack variant="primary" />
      {/* Body trống (nền trắng) */}
      <View style={styles.body} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  body: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
