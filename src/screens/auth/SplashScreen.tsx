// src/screens/auth/SplashScreen.jsx
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Nếu bạn đã có theme giống các file trước đó:
import { colors } from '../../themes/color';
import AppText from '../../components/ui/AppText';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const t = setTimeout(() => {
      // Chuyển sang Login và không cho back về Splash
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Center logo + text */}
      <View style={styles.center}>
        {/* Nếu bạn có file logo, bỏ comment và sửa đúng path */}
        <Image
          source={require('../../../assets/images/logo-mark.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <AppText weight="bold" style={styles.title}>
          HAPPY HRM
        </AppText>
      </View>

      {/* Bottom loading */}
      <View
        style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 14) }]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // trắng
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 86,
    height: 86,
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    letterSpacing: 1,
    color: colors.textPrimary ?? '#1E1E1E',
  },

  bottom: {
    // paddingBottom: 36,
    marginBottom: 100,
    alignItems: 'center',
  },
});
