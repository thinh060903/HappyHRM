import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import AppText from '../../components/ui/AppText';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
// import typography from '../../themes/typography';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type Props = {
  navigation?: any;
  onLoginSuccess?: () => void; // nếu bạn muốn bắn lên RootNavigator setLoggedIn(true)
};

export default function LoginScreen({ navigation, onLoginSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // lỗi hiển thị như mockup “Nhập sai”
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      username.trim().length > 0 && password.trim().length > 0 && !passwordError
    );
  }, [username, password, passwordError]);

  const handleLogin = () => {
    if (!canSubmit || loading) return;

    setPasswordError(null);
    setLoading(true);

    // DEMO loading + lỗi (bạn thay bằng API thật)
    setTimeout(() => {
      const ok = password === '123456'; // giả lập điều kiện đúng

      setLoading(false);

      if (!ok) {
        setPasswordError("Nhập lại mật khẩu hoặc chọn 'Quên mật khẩu'");
        return;
      }

      // Nếu bạn đang dùng RootNavigator (isLoggedIn) thì gọi callback:
      onLoginSuccess?.();

      // Hoặc nếu dùng navigation:
      // navigation?.replace?.('AppDrawer');
    }, 1200);
  };

  const goForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const goNewEmployeeForm = () => {
    // navigation?.navigate?.('NewEmployeeForm');
  };

  const iconName = secure ? 'eye' : 'eye-slash';
  const rightIconName = passwordError ? 'exclamation-circle' : iconName;

  const clearPasswordErrorOnly = () => {
    setPasswordError(null);
  };

  const onPasswordChange = (t: string) => {
    // Chỉ khi đang có lỗi + người dùng xóa sạch (tức nhấn nút xóa đến hết)
    if (passwordError && t.length === 0) {
      setPasswordError(null);
    }
    setPassword(t);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={require('../../../assets/images/logo-mark.png')}
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <AppText variant="title" weight="bold" style={styles.title}>
          Welcome to Happy HRM
        </AppText>
        <AppText
          variant="caption"
          color={colors.textSecondary}
          style={styles.subtitle}
        >
          Đăng nhập vào tài khoản của bạn.
        </AppText>

        {/* Username */}
        <View style={styles.field}>
          <AppInput
            value={username}
            onChangeText={setUsername}
            label="Tên đăng nhập"
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={
              <FontAwesome5 name="user" size={20} color={colors.textPrimary} />
            }
          />
        </View>

        {/* Password */}

        <View style={styles.field}>
          <AppInput
            value={password}
            onChangeText={onPasswordChange}
            label="Nhập mật khẩu"
            secureTextEntry={secure}
            error={!!passwordError}
            leftIcon={
              <FontAwesome5 name="lock" size={20} color={colors.textPrimary} />
            }
            rightIcon={
              <FontAwesome5
                name={rightIconName}
                size={20}
                color={passwordError ? colors.danger : colors.textPrimary}
              />
            }
            onPressRightIcon={() => {
              // Nếu đang lỗi -> bấm icon (!) sẽ xóa password + xóa lỗi
              if (passwordError) {
                clearPasswordErrorOnly();
                return;
              }
              // Nếu không lỗi -> là eye/eye-slash (ẩn/hiện)
              setSecure(prev => !prev);
            }}
          />
        </View>

        {passwordError ? (
          <AppText
            variant="caption"
            color={colors.danger}
            style={styles.errorText}
          >
            {passwordError}
          </AppText>
        ) : null}

        {/* Remember */}
        <Pressable
          onPress={() => setRemember(r => !r)}
          style={styles.rememberRow}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember ? (
              <AppText
                color={colors.textOnPrimary}
                weight="bold"
                style={styles.tick}
              >
                ✓
              </AppText>
            ) : null}
          </View>
          <AppText variant="caption" color={colors.textSecondary}>
            Lưu thông tin đăng nhập
          </AppText>
        </Pressable>

        {/* Login button */}
        <AppButton
          title="Đăng nhập"
          onPress={handleLogin}
          disabled={!canSubmit}
          style={[styles.loginBtn, !canSubmit && styles.loginBtnDisabled]}
        />

        {/* New employee form */}
        <AppButton
          title="Form thông tin nhân sự mới"
          onPress={goNewEmployeeForm}
          style={styles.newFormBtn}
        />

        {/* Forgot */}
        <Pressable onPress={goForgotPassword} style={styles.forgotWrap}>
          <AppText variant="caption" color={colors.primary} weight="semibold">
            Quên mật khẩu?
          </AppText>
        </Pressable>

        {/* Loading overlay */}
        {loading ? (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginTop: 60,
  },

  logoWrap: {
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },

  title: {
    // AppText title đã có size, đây chỉ chỉnh spacing
    marginBottom: 6,
  },

  subtitle: {
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  leftIconBox: {
    width: 32,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputFlex: {
    flex: 1,
  },

  eyeBtn: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    marginTop: 6,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tick: {
    fontSize: 12,
    lineHeight: 12,
  },

  loginBtn: {
    borderRadius: 10, // mockup bo hơn AppButton default
    height: 48,
  },

  loginBtnDisabled: {
    opacity: 0.6,
    backgroundColor: colors.textDisabled,
  },

  newFormBtn: {
    marginTop: spacing.md,
    borderRadius: 10,
    height: 48,
  },

  forgotWrap: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  field: {
    marginBottom: spacing.xxl,
  },
});
