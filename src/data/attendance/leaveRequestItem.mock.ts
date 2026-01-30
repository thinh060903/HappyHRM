import { useMemo } from "react";
import { LeaveRequestItem } from "../../types/attendance/leaveRequestItem";

export const data = useMemo<LeaveRequestItem[]>(
    () => [
        {
            id: '1',
            title: 'Đơn nghỉ phép năm',
            dateText: '30/08/2023',
            durationText: '4 giờ',
            notePreview: 'Sidebar has been collecting the best design links of th...',
            status: 'pending',
        },
        {
            id: '2',
            title: 'Nghỉ bù',
            dateText: '30/08/2023',
            durationText: '4 giờ',
            notePreview: 'Sidebar has been collecting the best design links of th...',
            status: 'rejected',
        },
        {
            id: '3',
            title: 'Nghỉ bệnh',
            dateText: '29/08/2023 - 30/08/2023',
            durationText: '4 giờ',
            notePreview: 'Sidebar has been collecting the best design links of th...',
            status: 'approved',
        },
    ],
    []
);