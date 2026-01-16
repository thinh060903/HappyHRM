import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import { colors } from '../../themes/color';

export default function QrScanScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [locked, setLocked] = useState(false);
  const [asking, setAsking] = useState(false);

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

  // ✅ Chưa có quyền: hiển thị màn xin quyền + nút
  if (!hasPermission) {
    return (
      <Screen
        backgroundColor={colors.background}
        style={styles.screen}
        edges={['left', 'right', 'bottom']}
      >
        <Header title="Quét QR" showBack variant="primary" />

        <View style={styles.center}>
          <Text style={styles.title}>Cần quyền Camera để quét QR</Text>

          <Text style={styles.desc}>
            {asking ? 'Đang xin quyền camera...' : 'Hãy cấp quyền để tiếp tục.'}
          </Text>

          <Pressable
            style={styles.btn}
            onPress={async () => {
              setAsking(true);
              await requestPermission();
              setAsking(false);
            }}
          >
            <Text style={styles.btnText}>Cấp quyền</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.btnGhost]}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.btnText}>Mở Cài đặt</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // ✅ Có quyền nhưng không có camera sau
  if (!device) {
    return (
      <Screen
        backgroundColor={colors.background}
        style={styles.screen}
        edges={['left', 'right', 'bottom']}
      >
        <Header title="Quét QR" showBack variant="primary" />
        <View style={styles.center}>
          <Text>Không tìm thấy camera sau.</Text>
        </View>
      </Screen>
    );
  }

  // ✅ Có quyền + có device => render camera
  return (
    <Screen
      backgroundColor={colors.background}
      style={styles.screen}
      edges={['left', 'right', 'bottom']}
    >
      <Header title="Quét QR" showBack variant="primary" />

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        codeScanner={codeScanner}
      />

      <View style={styles.hint}>
        <Text style={styles.hintText}>Đưa mã QR vào khung để mở website</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },

  title: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 14, opacity: 0.8, textAlign: 'center' },

  btn: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#111',
    minWidth: 160,
    alignItems: 'center',
  },
  btnGhost: { backgroundColor: '#444' },
  btnText: { color: '#fff', fontSize: 14 },

  hint: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  hintText: { color: '#fff', fontSize: 14 },
});
