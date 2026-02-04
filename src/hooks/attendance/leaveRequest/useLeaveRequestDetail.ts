import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';

type RequestField = {
  label: string;
  value: string;
};

export function useLeaveRequestDetail() {
  const route = useRoute<any>();
  const id = route.params?.id ?? '—';

  const fields = useMemo<RequestField[]>(
    () => [
      { label: 'Mã đơn', value: id },
      { label: 'Loại đơn', value: 'Đơn nghỉ phép năm' },
      { label: 'Ngày làm việc', value: '29/08/2023 - 30/08/2023' },
      { label: 'Số phút nghỉ', value: '60 phút' },
      { label: 'Lý do', value: 'Cá nhân' },
      { label: 'Nội dung', value: '…' },
      { label: 'Người duyệt', value: '[APS141215001] Cao Anh Chiến' },
    ],
    [id],
  );

  return {
    title: 'Chi tiết đơn yêu cầu',
    fields,
  };
}
