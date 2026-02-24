import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { AttendanceDayItem } from '../../components/attendance/AttendanceDayCard';
import { TabKey } from '../../types/attendance/tabKey';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AttendanceStackParamList } from '../../navigations/AttendanceStack';

type Nav = NativeStackNavigationProp<
  AttendanceStackParamList,
  'TimekeepingDetail'
>;
type Rt = RouteProp<AttendanceStackParamList, 'TimekeepingDetail'>;

export default function useTimekeepingDetail() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const date = route.params?.date;
  const initialTab: TabKey = route.params?.tab ?? 'info';

  const [tab, setTab] = useState<TabKey>(initialTab);

  const item: AttendanceDayItem | undefined = route.params?.item;

  const title = useMemo(() => 'Chi tiết chấm công', []);
  return {
    navigation,
    date,
    tab,
    setTab,
    item,
    title,
  };
}
