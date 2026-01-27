import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimekeepingDataScreen from '../screens/attendance/TimekeepingDataScreen';
import TimekeepingDetailScreen from '../screens/attendance/TimekeepingDetailScreen';

import CreateLeaveRequestScreen from '../screens/attendance/leaverequest/CreateLeaveRequestScreen';
import LeaveRequestDetailScreen from '../screens/attendance/leaverequest/LeaveRequestDetailScreen';

import CreateExplanationScreen from '../screens/attendance/explanation/CreateExplanationScreen';
import ExplanationDetailScreen from '../screens/attendance/explanation/ExplanationDetailScreen';

export type AttendanceStackParamList = {
    TimekeepingData: undefined;
    TimekeepingDetail: { tab?: 'info' | 'leave_request' | 'explanation'; date?: string };

    CreateLeaveRequest: { date?: string };
    LeaveRequestDetail: { id?: string };

    CreateExplanation: { date?: string; item?: any };
    ExplanationDetail: { id?: string };
};

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export default function AttendanceStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TimekeepingData" component={TimekeepingDataScreen} />
            <Stack.Screen name="TimekeepingDetail" component={TimekeepingDetailScreen} />
            <Stack.Screen name="CreateLeaveRequest" component={CreateLeaveRequestScreen} />
            <Stack.Screen name="LeaveRequestDetail" component={LeaveRequestDetailScreen} />
            <Stack.Screen name="CreateExplanation" component={CreateExplanationScreen} />
            <Stack.Screen name="ExplanationDetail" component={ExplanationDetailScreen} />
        </Stack.Navigator>
    );
}
