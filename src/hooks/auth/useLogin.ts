import { useMemo, useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigations/AuthStack';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  onLoginSuccess?: () => void;
};
export function useLogin({ navigation, onLoginSuccess }: Props) {
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
  return {
    username,
    setUsername,
    password,
    onPasswordChange,
    secure,
    setSecure,
    rightIconName,
    remember,
    setRemember,
    loading,
    passwordError,
    canSubmit,
    handleLogin,
    goForgotPassword,
    goNewEmployeeForm,
    clearPasswordErrorOnly,
  };
}
