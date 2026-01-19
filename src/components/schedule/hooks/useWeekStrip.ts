// hooks/useWeekStrip.ts
import { useMemo } from 'react';
import { addDays } from '../../../utils/date';

export function useWeekStrip(weekStart: Date, onSelectDate?: Function) {
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const selectable = typeof onSelectDate === 'function';

  return { days, selectable };
}
