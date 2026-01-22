import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequestsScreen from '../screens/request/RequestsScreen';
import CreateRequestScreen from '../screens/request/tabs/CreateRequestScreen';
import RequestDetailScreen from '../screens/request/tabs/RequestDetailScreen';

export type RequestStackParamList = {
    RequestsHome: undefined;
    CreateRequest: undefined;
    RequestDetail: { item: any }; // bạn có thể thay "any" bằng type RequestItem sau
};

const Stack = createNativeStackNavigator<RequestStackParamList>();

export default function RequestStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RequestsHome" component={RequestsScreen} />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
            <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />
        </Stack.Navigator>
    );
}
