import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';
import AppText from '../../components/ui/AppText';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import DateRangeCalendar from '../../components/schedule/DateRangeCalendar';
import ActionDateRangeCalendar from '../../components/schedule/ActionDateRangeCalendar';

import AttendanceDayCard, {
    AttendanceDayItem,
    AttendanceStatus,
} from '../../components/attendance/AttendanceDayCard';

import {
    startOfMonth,
    endOfMonth,
    sameMonth,
    pad2,
    addDays,
} from '../../utils/date';


type QuickFilter = 'all' | 'no_request' | 'missing';

function formatRangeShort(s: Date, e: Date) {
    return `${pad2(s.getDate())}/${pad2(s.getMonth() + 1)} → ...`;
}

// mock data theo range
function buildMockAttendanceForRange(start: Date, end: Date): AttendanceDayItem[] {
    const out: AttendanceDayItem[] = [];
    let cur = new Date(start);

    while (cur <= end) {
        const day = cur.getDate();

        // Demo logic:
        // - OFF cho vài ngày
        // - ERROR cho vài ngày thiếu công
        // - SUCCESS cho còn lại
        let status: AttendanceStatus = 'success';
        let workedText: string | undefined = '08 giờ';
        let showWarning = false;
        let warningTarget: AttendanceDayItem['warningTarget'] = undefined;

        if (day % 10 === 0 || day % 9 === 0) {
            status = 'off';
            workedText = undefined;
        } else if (day % 7 === 0 || day % 11 === 0) {
            status = 'error';
            workedText = day % 2 === 0 ? '07 giờ' : '07 giờ 15 phút';
            // thiếu công + chưa tạo đơn/giải trình
            showWarning = true;
            warningTarget = day % 2 === 0 ? 'leave_request' : 'explanation';
        } else {
            status = 'success';
            workedText = '08 giờ';
        }

        out.push({
            id: `${cur.toISOString()}`,
            date: new Date(cur),

            checkCode: status === 'off' ? undefined : '000897',
            shiftLabel: status === 'off' ? undefined : 'Ca 5A',
            totalShift: status === 'off' ? undefined : '8 giờ',

            workedText,
            status,

            showWarning,
            warningTarget,
        });

        cur = addDays(cur, 1);
    }

    // sắp xếp: nhân viên mới -> cũ (ngày mới nhất lên đầu)
    return out.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function TimekeepingDataScreen() {
    const navigation = useNavigation<any>();

    // ✅ default month = hiện tại
    const now = useMemo(() => new Date(), []);
    const defaultStart = useMemo(() => startOfMonth(now), [now]);
    const defaultEnd = useMemo(() => endOfMonth(now), [now]);

    // View range (range đang xem)
    const [viewStart, setViewStart] = useState<Date | null>(defaultStart);
    const [viewEnd, setViewEnd] = useState<Date | null>(defaultEnd);

    // Picker state
    const [monthPickerOpen, setMonthPickerOpen] = useState(false);
    const [monthCursor, setMonthCursor] = useState<Date>(now);

    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

    // flags (đúng props ActionDateRangeCalendar)
    const [isSearching, setIsSearching] = useState(false);
    const [didSearch, setDidSearch] = useState(false);
    const [mode, setMode] = useState<'week' | 'range'>('range');

    // filter chip
    const [filter, setFilter] = useState<QuickFilter>('all');

    const s = viewStart ?? defaultStart;
    const e = viewEnd ?? defaultEnd;

    const data = useMemo(() => buildMockAttendanceForRange(s, e), [s, e]);

    const filteredData = useMemo(() => {
        if (filter === 'all') return data;

        if (filter === 'missing') {
            return data.filter(x => x.status === 'error');
        }

        // "Chưa tạo đơn": ngày lỗi + có cảnh báo (thiếu công nhưng chưa tạo đơn/giải trình)
        if (filter === 'no_request') {
            return data.filter(x => x.status === 'error' && x.showWarning);
        }

        return data;
    }, [data, filter]);

    const titleText = useMemo(() => {
        // Hiển thị giống ảnh: "Tháng 9, 2023: 01/09 → 12/09"
        // Nếu người dùng chọn range khác tháng, vẫn hiển thị theo viewStart/viewEnd.
        const monthLabel =
            sameMonth(s, e) ? `Tháng ${s.getMonth() + 1}, ${s.getFullYear()}` : `Tháng ${s.getMonth() + 1}/${s.getFullYear()}`;
        return `${monthLabel}:  ${formatRangeShort(s, e)}`;
    }, [s, e]);


    const onPressDetail = (item: AttendanceDayItem) => {
        navigation.navigate('TimekeepingDetail', {
            tab: 'info',
            date: item.date.toISOString(),
            item, // ✅ thêm
        });
    };

    const onPressWarning = (item: AttendanceDayItem) => {
        if (item.warningTarget === 'leave_request') {
            navigation.navigate('TimekeepingDetail', {
                tab: 'leave_request',
                date: item.date.toISOString(),
                item, // ✅ thêm
            });
            return;
        }
        if (item.warningTarget === 'explanation') {
            navigation.navigate('TimekeepingDetail', {
                tab: 'explanation',
                date: item.date.toISOString(),
                item, // ✅ thêm
            });
        }
    };


    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title="Dữ liệu chấm công" showBack variant="primary" />
            {/* Month row */}
            <View style={styles.monthRow}>
                <View style={styles.monthLeft}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <AppText style={styles.monthText}>{titleText}</AppText>
                </View>

                <Pressable
                    onPress={() => setMonthPickerOpen(true)}
                    hitSlop={10}
                    style={({ pressed }) => [styles.monthArrowBtn, pressed && { opacity: 0.7 }]}
                >
                    <Ionicons
                        name="swap-vertical-outline" // icon “2 mũi tên”
                        size={18}
                        color={colors.brand?.[500] ?? colors.primary}
                    />
                </Pressable>
            </View>

            {/* Filter chips */}
            <View style={styles.filterRow}>
                <Chip
                    label="Có đơn"
                    active={filter === 'all'} // em có thể đổi “Có đơn” -> “Tất cả” nếu muốn
                    onPress={() => setFilter('all')}
                />
                <Chip
                    label="Chưa tạo đơn"
                    active={filter === 'no_request'}
                    onPress={() => setFilter('no_request')}
                />
                <Chip
                    label="Thiếu chấm công"
                    active={filter === 'missing'}
                    onPress={() => setFilter('missing')}
                />
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {filteredData.map(item => (
                    <AttendanceDayCard
                        key={item.id}
                        item={{
                            ...item,
                            onPressDetail: () => onPressDetail(item),
                            onPressWarning: () => onPressWarning(item),
                        }}
                    />
                ))}
            </ScrollView>

            {/* Modal: DateRangeCalendar + ActionDateRangeCalendar */}
            <Modal visible={monthPickerOpen} transparent animationType="slide">
                <Pressable style={styles.modalBackdrop} onPress={() => setMonthPickerOpen(false)} />

                <View style={styles.modalSheet}>
                    <DateRangeCalendar
                        monthCursor={monthCursor}
                        onPrevMonth={() =>
                            setMonthCursor(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                        }
                        onNextMonth={() =>
                            setMonthCursor(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                        }
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        onPickDay={(d: Date) => {
                            // pick logic đơn giản:
                            // - nếu chưa có start -> setStart
                            // - nếu có start rồi -> setEnd
                            if (!rangeStart) {
                                setRangeStart(d);
                                setRangeEnd(null);
                                return;
                            }
                            if (rangeStart && !rangeEnd) {
                                setRangeEnd(d);
                                return;
                            }
                            // nếu đủ rồi mà bấm tiếp: reset lại start
                            setRangeStart(d);
                            setRangeEnd(null);
                        }}
                    />

                    <ActionDateRangeCalendar
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        setRangeStart={setRangeStart}
                        setRangeEnd={setRangeEnd}
                        setMonthPickerOpen={setMonthPickerOpen}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                        setDidSearch={setDidSearch}
                        setMode={setMode}
                        setViewStart={setViewStart}
                        setViewEnd={setViewEnd}
                    />
                </View>
            </Modal>
        </Screen>
    );
}

function Chip({
    label,
    active,
    onPress,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && { opacity: 0.7 },
            ]}
        >
            <AppText style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
            </AppText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },
    monthRow: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    monthLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    monthText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },
    monthArrowBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    filterRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
    },
    chipActive: {
        borderColor: colors.brand?.[500] ?? colors.primary,
        backgroundColor: 'rgba(244, 148, 89, 0.10)',
    },
    chipText: {
        fontFamily: typography.fontFamily?.medium,
        fontSize: 12,
        color: colors.textSecondary,
    },
    chipTextActive: {
        color: colors.brand?.[500] ?? colors.primary,
    },

    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
        backgroundColor: colors.background,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
});
