// hooks/useWeekNavigator.ts
import { addDays } from '../../../utils/date';

type Params = {
  mode?: 'week' | 'range';
  viewStart?: Date | null;
  viewEnd?: Date | null;
  setViewStart?: React.Dispatch<React.SetStateAction<Date | null>>;
  setViewEnd?: React.Dispatch<React.SetStateAction<Date | null>>;
  setWeekAnchor?: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedDate?: React.Dispatch<React.SetStateAction<Date>>;
};

export function useWeekNavigator({
  mode = 'week',
  viewStart,
  viewEnd,
  setViewStart,
  setViewEnd,
  setWeekAnchor,
  setSelectedDate,
}: Params) {
  const shift = (deltaWeeks: number) => {
    const deltaDays = deltaWeeks * 7;

    if (
      mode === 'range' &&
      viewStart &&
      viewEnd &&
      setViewStart &&
      setViewEnd
    ) {
      setViewStart(prev => (prev ? addDays(prev, deltaDays) : prev));
      setViewEnd(prev => (prev ? addDays(prev, deltaDays) : prev));
      return;
    }

    if (setWeekAnchor) {
      setWeekAnchor(prev => addDays(prev, deltaDays));
    }

    if (setSelectedDate) {
      setSelectedDate(prev => addDays(prev, deltaDays));
    }
  };

  return { shift };
}
