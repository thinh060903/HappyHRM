// hooks/useDateRangeCalendar.ts
import { useMemo } from 'react';
import {
  buildMonthGrid,
  sameMonth,
  minDate,
  maxDate,
} from '../../../utils/date';

export function useDateRangeCalendar(
  monthCursor: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null,
) {
  const monthGrid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);

  const weeks = useMemo(() => {
    const out: Date[][] = [];
    for (let i = 0; i < 6; i++) {
      out.push(monthGrid.slice(i * 7, i * 7 + 7));
    }
    return out;
  }, [monthGrid]);

  const visibleWeeks = useMemo(
    () => weeks.filter(w => w.some(d => sameMonth(d, monthCursor))),
    [weeks, monthCursor],
  );

  const uiStart = useMemo(() => {
    if (!rangeStart) return null;
    return rangeEnd ? minDate(rangeStart, rangeEnd) : rangeStart;
  }, [rangeStart, rangeEnd]);

  const uiEnd = useMemo(() => {
    if (!rangeStart) return null;
    return rangeEnd ? maxDate(rangeStart, rangeEnd) : rangeStart;
  }, [rangeStart, rangeEnd]);

  return { visibleWeeks, uiStart, uiEnd };
}
