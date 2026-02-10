import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { AttendanceDayItem } from '../../components/attendance/AttendanceDayCard';
import { TabKey } from '../../types/attendance/tabKey';

export default function useTimekeepingDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
