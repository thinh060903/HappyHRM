import { ExplanationStatus } from "./explanationStatus";

export type ExplanationItem = {
    id: string;
    title: string;        // VD: "Quên checkin về"
    dateText: string;     // VD: "30/08/2023"
    timeText: string;     // VD: "08:05 - 17:20"
    status: ExplanationStatus;
    statusLabel: string;  // VD: "Đã duyệt"
    notePreview: string;
};