import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';

type ExplanationDetail = {
  id: string;
  requestType: string;
  reason: string;
  approver: string;
};

const mockExplanation: Omit<ExplanationDetail, 'id'> = {
  requestType: 'Thiếu chấm công',
  reason: '(mock) Đi sớm về muộn do công việc đột xuất...',
  approver: '(mock) Cao Anh Chiến',
};

export function useExplanationDetail() {
  const route = useRoute<any>();
  const id = route.params?.id ?? '-';

  const detail = useMemo<ExplanationDetail>(
    () => ({
      id,
      ...mockExplanation,
    }),
    [id],
  );

  return {
    title: 'Chi tiết đơn yêu cầu',
    detail,
  };
}
