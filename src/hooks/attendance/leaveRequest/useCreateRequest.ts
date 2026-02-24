import { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { parseISO, formatVNDate } from '../../../utils/date';

export function useCreateRequest() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [typeLabel, setTypeLabel] = useState<string>('Chọn loại đơn');

  // const dateText = useMemo(() => {
  //   const date = route.params?.date;
  //   return date ? `Ngày: ${date}` : 'Ngày bắt đầu -> Ngày kết thúc';
  // }, [route.params?.date]);

  const dateText = useMemo(() => {
    const raw = route.params?.date;
    if (!raw) return 'Ngày bắt đầu -> Ngày kết thúc';

    try {
      const d = raw.includes('T') ? new Date(raw) : parseISO(raw);
      if (Number.isNaN(d.getTime())) return 'Ngày không hợp lệ';
      return `Ngày: ${formatVNDate(d)}`;
    } catch {
      return 'Ngày không hợp lệ';
    }
  }, [route.params?.date]);

  const selectType = () => {
    // TODO: open BottomSheet chọn loại đơn
    setTypeLabel('Nghỉ phép năm');
  };

  const submit = () => {
    navigation.goBack();
  };

  return {
    typeLabel,
    dateText,
    selectType,
    submit,
  };
}
