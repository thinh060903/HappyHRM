import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import { colors } from '../../themes/color';
import { useQrScanScreen } from '../../hooks/features/useQrScan';

export default function QrScanScreen() {
  const {
    device,
    hasPermission,
    asking,
    codeScanner,
    setAsking,
    requestPermission,
  } = useQrScanScreen();

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
