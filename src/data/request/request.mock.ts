import { RequestItem } from '../../types/request/requestItem';

export const MOCK_REQUESTS: RequestItem[] = [
  {
    id: 'r1',
    type: 'LEAVE',
    title: 'Đơn nghỉ phép năm',
    timeText: '05/11 - 11/11/2023',
    createdAtText: '25/08/2023, 2 giờ',
    status: 'approved',
    notePreview: 'Sidebar has been collecting the best design links of th...',
  },
  {
    id: 'r2',
    type: 'LEAVE',
    title: 'Nghỉ bù',
    timeText: '28/05/2023',
    createdAtText: '25/08/2023, 4 giờ',
    status: 'rejected',
    notePreview: 'Sidebar has been collecting the best design links of th...',
  },
  {
    id: 'r3',
    type: 'EXPLAIN',
    title: 'Nghỉ bệnh',
    timeText: '24/10/2022',
    createdAtText: '25/08/2023, 4 giờ',
    status: 'approved',
    notePreview: 'Sidebar has been collecting the best design links of th...',
  },
  {
    id: 'r4',
    type: 'OT',
    title: 'Đơn tăng ca',
    timeText: '05/11/2023',
    createdAtText: '25/08/2023, 1 ngày',
    status: 'pending',
    notePreview: 'Sidebar has been collecting the best design links of th...',
  },
  {
    id: 'r5',
    type: 'LEAVE',
    title: 'Đơn nghỉ phép năm',
    timeText: '26/08/2023',
    createdAtText: '25/08/2023, 2 ngày',
    status: 'pending',
    notePreview: 'Sidebar has been collecting the best design links of th...',
  },
];
