import { useMemo } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { RequestItem } from '../../../types/request/requestItem';

type ParamList = {
  RequestDetail: { item: RequestItem };
};

export function useRequestDetail() {
  const route = useRoute<RouteProp<ParamList, 'RequestDetail'>>();
  const item = route.params?.item;

  // mock detail fallback
  const detail = useMemo(() => {
    return {
      leaveTypeLabel:
        item.leaveTypeLabel ??
        (item.type === 'LEAVE' ? 'Nghỉ phép năm' : undefined),
      approverName: item.approverName ?? 'Cấp trên',
      ccName: item.ccName ?? 'Cá nhân',
      createdDate: item.createdDate ?? '25/08/2023',
      reason:
        item.reason ??
        (item.type === 'LEAVE'
          ? 'Xin nghỉ theo kế hoạch cá nhân.'
          : item.type === 'OT'
          ? 'Tăng ca hoàn thành công việc tồn.'
          : 'Giải trình chấm công.'),
    };
  }, [item]);

  return {
    item,
    detail,
  };
}
