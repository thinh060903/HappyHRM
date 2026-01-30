import { ExplanationItem } from "../../types/attendance/explanation";
import { useMemo } from "react";

export const data: ExplanationItem[] = useMemo(
    () => [
        {
            id: '1',
            title: 'Quên checkin về',
            dateText: '30/08/2023',
            timeText: '08:05 - 17:20',
            status: 'approved',
            statusLabel: 'Đã duyệt',
            notePreview: 'Sidebar has been collecting the best design links of th...',

        },
        {
            id: '2',
            title: 'Giải trình đi muộn',
            dateText: '30/08/2023',
            timeText: '09:10 - 18:00',
            status: 'rejected',
            statusLabel: 'Từ chối',
            notePreview: 'Sidebar has been collecting the best design links of th...',

        },
        {
            id: '3',
            title: 'Xin ra ngoài',
            dateText: '30/08/2023',
            timeText: '14:00 - 15:00',
            status: 'pending',
            statusLabel: 'Chờ duyệt',
            notePreview: 'Sidebar has been collecting the best design links of th...',

        },
    ],
    []
);