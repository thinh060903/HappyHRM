import { useCallback, useMemo } from 'react';
import { minDate, maxDate } from '../../../utils/date';
import { Mode } from '../../../types/schedule';

type Params = {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  setRangeStart: (d: Date | null) => void;
  setRangeEnd: (d: Date | null) => void;

  setMonthPickerOpen: (v: boolean) => void;

  setIsSearching: (v: boolean) => void;
  setDidSearch: (v: boolean) => void;

  setMode: (m: Mode) => void;
  setViewStart: (d: Date | null) => void;
  setViewEnd: (d: Date | null) => void;
};

export function useDateRangeActions({
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  setMonthPickerOpen,
  setIsSearching,
  setDidSearch,
  setMode,
  setViewStart,
  setViewEnd,
}: Params) {
  const onCancelPicker = useCallback(() => {
    setMonthPickerOpen(false);
    setRangeStart(null);
    setRangeEnd(null);
  }, [setMonthPickerOpen, setRangeStart, setRangeEnd]);

  const onSearchPicker = useCallback(async () => {
    if (!rangeStart) return;

    setIsSearching(true);
    setDidSearch(true);

    await new Promise<void>(r => setTimeout(r, 700));

    const start = rangeStart;
    const end = rangeEnd ?? start;

    setMode('range');
    setViewStart(minDate(start, end));
    setViewEnd(maxDate(start, end));

    setMonthPickerOpen(false);
    setIsSearching(false);
  }, [
    rangeStart,
    rangeEnd,
    setIsSearching,
    setDidSearch,
    setMode,
    setViewStart,
    setViewEnd,
    setMonthPickerOpen,
  ]);

  const searchDisabled = useMemo(() => !rangeStart, [rangeStart]);

  return { onCancelPicker, onSearchPicker, searchDisabled };
}
