import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: Edge[];
  keyboardAvoiding?: boolean; // ✅ thêm
  keyboardVerticalOffset?: number; // ✅ thêm (để tránh đè header)
}

const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  backgroundColor = colors.background,
  edges = ['top'],
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
}) => {
  const content = <View style={[styles.container, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
