/* ---------- basic ---------- */
export const pad2 = (n: number) => String(n).padStart(2, '0');

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

/* ---------- compare ---------- */
export const sameDay = (a?: Date, b?: Date) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const minDate = (a: Date, b: Date) =>
  a.getTime() <= b.getTime() ? a : b;

export const maxDate = (a: Date, b: Date) =>
  a.getTime() >= b.getTime() ? a : b;

/* ---------- week / month ---------- */
export const startOfWeekMonday = (d: Date) => {
  const x = new Date(d);
  const jsDay = x.getDay();
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const endOfWeekSunday = (d: Date) => {
  const x = new Date(d);
  const jsDay = x.getDay();
  const diff = jsDay === 0 ? 0 : 7 - jsDay;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const startOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const endOfMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0);

export const buildMonthGrid = (monthDate: Date) => {
  const first = startOfMonth(monthDate);
  const last = endOfMonth(monthDate);
  const gridStart = startOfWeekMonday(first);
  const gridEnd = endOfWeekSunday(last);

  const days: Date[] = [];
  let cur = new Date(gridStart);

  while (cur <= gridEnd) {
    days.push(new Date(cur));
    cur = addDays(cur, 1);
  }
  return days;
};

/* ---------- format ---------- */
export const formatDDMM = (d: Date) =>
  `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;

export const formatRange = (start: Date, end: Date) =>
  `${formatDDMM(start)} - ${formatDDMM(end)}/${end.getFullYear()}`;
