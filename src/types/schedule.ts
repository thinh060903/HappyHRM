export type Shift = {
  id: string;
  room: string; // ví dụ: "5A, 10B"
  start: string; // "08:00"
  end: string; // "11:00"
};
export type Mode = 'week' | 'range';
