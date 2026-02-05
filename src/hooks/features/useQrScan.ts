import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, BackHandler } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

export function useQrScanScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [locked, setLocked] = useState(false);
  const [asking, setAsking] = useState(false);
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        // Nếu đang ở QrScan thì quay về Home, không thoát app
        navigation.navigate('Home');
        return true; // ✅ chặn hành vi mặc định (thoát app)
      });

      return () => sub.remove();
    }, [navigation]),
  );

  // ✅ Khi vào màn hình: nếu chưa có quyền thì xin 1 lần
  useEffect(() => {
    if (hasPermission) return;

    let mounted = true;
    (async () => {
      setAsking(true);
      await requestPermission(); // hệ điều hành sẽ popup hỏi
      if (mounted) setAsking(false);
    })();

    return () => {
      mounted = false;
    };
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (locked) return;
      const value = codes?.[0]?.value;
      if (!value) return;

      setLocked(true);

      if (value.startsWith('http://') || value.startsWith('https://')) {
        Linking.openURL(value);
      } else {
        Alert.alert('QR không phải link web', value);
      }

      // tránh quét liên tục -> mở web nhiều tab
      setTimeout(() => setLocked(false), 1500);
    },
  });
  return {
    device,
    hasPermission,
    asking,
    codeScanner,
    setAsking,
    requestPermission,
  };
}
