import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '../../components/layout/Screen';
import AppText from '../../components/ui/AppText';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState('');
  const canSubmit = useMemo(() => username.trim().length > 0, [username]);

  const onNext = () => {
    // TODO: gọi API gửi OTP
    // navigation.navigate('OtpScreen', { username: username.trim() });
  };

  const onGoLogin = () => {
    navigation.goBack();
  };

  return (
    <Screen backgroundColor={colors.surface} style={styles.screen}>
      {/* Header: nút back */}
      <View style={styles.header}>
        <AppButton
          title=""
          variant="link"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          leftIcon={
            <FontAwesome5
              name="arrow-left"
              size={20}
              color={colors.textPrimary}
            />
          }
        />
      </View>

      {/* Title */}
      <AppText variant="title" weight="semibold" style={styles.title}>
        Quên mật khẩu
      </AppText>

      <AppText
        variant="body"
        color={colors.textSecondary}
        style={styles.subtitle}
      >
        Thông tin tài khoản
      </AppText>

      {/* Form */}
      <View style={styles.form}>
        <AppInput
          label="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          leftIcon={
            <FontAwesome5 name="user" size={20} color={colors.textPrimary} />
          }
          // Nếu AppInput của bạn chưa hỗ trợ label/icon, mình sẽ chỉnh tiếp theo file AppInput bạn đã gửi
        />

        <AppButton
          title="Tiếp theo"
          onPress={onNext}
          disabled={!canSubmit}
          rightIcon={
            <FontAwesome5
              name="arrow-right"
              size={18}
              color={colors.textOnPrimary}
            />
          }
          style={styles.primaryBtn}
        />

        <AppButton
          title="Đăng nhập"
          variant="link"
          onPress={onGoLogin}
          style={styles.loginLinkWrap}
          textStyle={styles.loginLinkText}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // Screen.tsx đã có paddingHorizontal + paddingTop mặc định :contentReference[oaicite:3]{index=3}
    // Nên mình set lại để giống Figma hơn:
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginTop: 60,
    backgroundColor: colors.background,
  },

  header: {
    marginBottom: spacing.sm,
  },

  backBtn: {
    alignSelf: 'flex-start',
  },

  title: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },

  subtitle: {
    marginBottom: spacing.md,
  },

  form: {
    marginTop: spacing.sm,
    // Nếu RN bạn chưa hỗ trợ gap, hãy dùng marginBottom cho từng block
    gap: spacing.md,
  },

  primaryBtn: {
    marginTop: spacing.sm,
  },

  loginLinkWrap: {
    marginTop: spacing.xs,
    alignSelf: 'center',
  },

  loginLinkText: {
    color: colors.primary,
  },
});
