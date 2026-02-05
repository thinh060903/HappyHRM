import { RequestStatus } from '../request/requestStatus';
import { RequestType } from '../request/requestType';

export type RequestItem = {
  id: string;
  type: RequestType;
  title: string; // hiển thị dòng tiêu đề: "Đơn nghỉ phép năm", "Đơn tăng ca"...
  timeText: string; // "05/11 - 11/11/2023" hoặc "05/11/2023"
  createdAtText: string; // "25/08/2023, 2 giờ"
  status: RequestStatus;
  notePreview?: string;

  // (optional) detail fields
  leaveTypeLabel?: string; // "Nghỉ phép năm"
  approverName?: string;
  ccName?: string;
  reason?: string; // nội dung / lý do
  createdDate?: string; // "25/08/2023"
};
