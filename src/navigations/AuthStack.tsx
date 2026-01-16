import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
// import OtpScreen from '../screens/auth/OtpScreen';
// import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false, // Auth screen không cần header mặc định
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* <Stack.Screen name="Otp" component={OtpScreen} />

      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
    </Stack.Navigator>
  );
}
