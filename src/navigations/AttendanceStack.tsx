import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimekeepingDataScreen from '../screens/attendance/TimekeepingDataScreen';
import TimekeepingDetailScreen from '../screens/attendance/TimekeepingDetailScreen';

export type AttendanceStackParamList = {
    TimekeepingData: undefined;
    TimekeepingDetail: { tab?: 'info' | 'leave_request' | 'explanation'; date?: string };
};

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export default function AttendanceStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TimekeepingData" component={TimekeepingDataScreen} />
            <Stack.Screen name="TimekeepingDetail" component={TimekeepingDetailScreen} />
        </Stack.Navigator>
    );
}
