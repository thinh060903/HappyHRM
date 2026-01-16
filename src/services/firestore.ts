import firestore from '@react-native-firebase/firestore';

export const employeesCol = firestore().collection('employees');
