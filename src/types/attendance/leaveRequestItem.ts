import { LeaveStatus } from "./leaveStatus";

export type LeaveRequestItem = {
    id: string;
    title: string;      // ví dụ: "Đơn nghỉ phép năm"
    dateText: string;   // ví dụ: "29/08/2023 - 30/08/2023"
    durationText: string; // ví dụ: "4 giờ"
    notePreview?: string;
    status: LeaveStatus;
};