import { useCallback, useMemo, useState } from 'react';
import { maxDate, minDate, startOfMonth } from '../../../utils/date';

function addMonths(d: Date, delta: number) {
    return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

export function useDateRangePicker(initialStart?: Date | null, initialEnd?: Date | null) {
    // ✅ monthCursor luôn là Date => hết crash getFullYear()
    const [monthCursor, setMonthCursor] = useState<Date>(() =>
        startOfMonth(initialStart ?? new Date()),
    );

    const [rangeStart, setRangeStart] = useState<Date | null>(initialStart ?? null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(initialEnd ?? null);

    const uiStart = useMemo(() => {
        if (!rangeStart) return null;
        return rangeEnd ? minDate(rangeStart, rangeEnd) : rangeStart;
    }, [rangeStart, rangeEnd]);

    const uiEnd = useMemo(() => {
        if (!rangeStart) return null;
        return rangeEnd ? maxDate(rangeStart, rangeEnd) : rangeStart;
    }, [rangeStart, rangeEnd]);

    const onPrevMonth = useCallback(() => {
        setMonthCursor(m => addMonths(m, -1));
    }, []);

    const onNextMonth = useCallback(() => {
        setMonthCursor(m => addMonths(m, 1));
    }, []);

    // ✅ logic chọn range đúng chuẩn
    const onPickDay = useCallback(
        (d: Date) => {
            // chưa có start hoặc đã có đủ start+end -> reset
            if (!rangeStart || (rangeStart && rangeEnd)) {
                setRangeStart(d);
                setRangeEnd(null);
                return;
            }
            // đã có start, chưa có end -> set end
            setRangeEnd(d);
        },
        [rangeStart, rangeEnd],
    );

    // tiện cho screen: reset / setFromOutside
    const reset = useCallback(() => {
        setRangeStart(null);
        setRangeEnd(null);
        setMonthCursor(startOfMonth(new Date()));
    }, []);

    const setFromOutside = useCallback((s: Date | null, e: Date | null) => {
        setRangeStart(s);
        setRangeEnd(e);
        setMonthCursor(startOfMonth(s ?? new Date()));
    }, []);

    return {
        monthCursor,
        onPrevMonth,
        onNextMonth,
        rangeStart,
        rangeEnd,
        uiStart,
        uiEnd,
        onPickDay,
        reset,
        setFromOutside,
    };
}
