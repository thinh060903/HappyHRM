import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

import Header from '../../../components/layout/Header';
import Screen from '../../../components/layout/Screen';

// ✅ dùng lịch của bạn
import DateRangeCalendar from '../../../components/schedule/DateRangeCalendar';
import { useDateRangePicker } from '../../../components/schedule/hooks/useDateRangePicker';
import BottomSheetSingleSelect from '../../../components/ui/BottomSheetSingleSelect';


type RequestType = 'LEAVE' | 'OT' | 'EXPLAIN';

const TYPE_LABEL: Record<RequestType, string> = {
    LEAVE: 'Đơn nghỉ phép',
    OT: 'Đơn tăng ca',
    EXPLAIN: 'Giải trình',
};

type LeaveSubtype =
    | 'ANNUAL'
    | 'UNPAID'
    | 'SICK'
    | 'MATERNITY'
    | 'OTHER';

const LEAVE_SUBTYPE_LABEL: Record<LeaveSubtype, string> = {
    ANNUAL: 'Nghỉ phép năm',
    UNPAID: 'Nghỉ không lương',
    SICK: 'Nghỉ ốm',
    MATERNITY: 'Nghỉ thai sản',
    OTHER: 'Khác',
};


function Field({
    label,
    value,
    placeholder,
    onPress,
    editable = false,
    rightIcon = 'chevron-down',
    error,
}: {
    label: string;
    value?: string;
    placeholder?: string;
    onPress?: () => void;
    editable?: boolean;
    rightIcon?: string;
    error?: string;
}) {
    return (
        <View style={{ gap: 6 }}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <Pressable
                disabled={!onPress}
                onPress={onPress}
                style={[
                    styles.fieldBox,
                    !!error && { borderColor: colors.danger },
                    !onPress && { opacity: 1 },
                ]}
            >
                <Text style={[styles.fieldText, !value && { color: colors.textSecondary }]}>
                    {value || placeholder || ''}
                </Text>

                {onPress ? (
                    <FontAwesome5 name={rightIcon as any} size={14} color={colors.textSecondary} />
                ) : (
                    <View />
                )}
            </Pressable>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

function formatDDMMYYYY(d: Date) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

export default function CreateRequestScreen() {

    const navigation = useNavigation<any>();
    const dr = useDateRangePicker();

    const [type, setType] = useState<RequestType>('LEAVE');
    const [typeOpen, setTypeOpen] = useState(false);

    // Leave subtype
    const [leaveSubtype, setLeaveSubtype] = useState<LeaveSubtype>('ANNUAL');
    const [leaveSubtypeOpen, setLeaveSubtypeOpen] = useState(false);

    // Date range picked from calendar
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);

    // OT specific (demo)
    const [otStartTime, setOtStartTime] = useState(''); // "18:00"
    const [otEndTime, setOtEndTime] = useState('');     // "21:00"

    // Note
    const [note, setNote] = useState('');

    const timeText = useMemo(() => {
        if (!rangeStart) return '';
        const s = formatDDMMYYYY(rangeStart);
        const e = rangeEnd ? formatDDMMYYYY(rangeEnd) : s;
        return rangeEnd && e !== s ? `${s} - ${e}` : s;
    }, [rangeStart, rangeEnd]);

    const errors = useMemo(() => {
        const e: { time?: string; ot?: string } = {};
        if (!rangeStart) e.time = 'Vui lòng chọn thời gian';

        if (type === 'OT') {
            if (!otStartTime.trim() || !otEndTime.trim()) {
                e.ot = 'Vui lòng nhập giờ bắt đầu/kết thúc';
            }
        }
        return e;
    }, [rangeStart, type, otStartTime, otEndTime]);

    const canSubmit = useMemo(() => {
        return Object.keys(errors).length === 0;
    }, [errors]);

    const onSubmit = () => {
        if (!canSubmit) return;

        // TODO: call API create request
        // Demo: back
        navigation.goBack();
    };

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >
            <Header title="Tạo đơn yêu cầu" showBack variant="primary" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Loại đơn */}
                <Field
                    label="Loại đơn yêu cầu"
                    value={TYPE_LABEL[type]}
                    placeholder="Chọn loại đơn"
                    onPress={() => setTypeOpen(true)}
                />

                {/* Leave subtype (chỉ hiện khi nghỉ phép) */}
                {type === 'LEAVE' && (
                    <Field
                        label="Loại nghỉ phép"
                        value={LEAVE_SUBTYPE_LABEL[leaveSubtype]}
                        placeholder="Chọn loại nghỉ phép"
                        onPress={() => setLeaveSubtypeOpen(true)}
                    />
                )}

                {/* Thời gian */}
                <Field
                    label="Thời gian"
                    value={timeText}
                    placeholder="Chọn thời gian"
                    rightIcon="calendar-alt"
                    onPress={() => setCalendarOpen(true)}
                    error={errors.time}
                />

                {/* OT extra */}
                {type === 'OT' && (
                    <View style={{ gap: spacing.md }}>
                        <Text style={styles.fieldLabel}>Giờ tăng ca</Text>

                        <View style={styles.twoCols}>
                            <View style={{ flex: 1, gap: 6 }}>
                                <Text style={styles.subLabel}>Từ</Text>
                                <TextInput
                                    value={otStartTime}
                                    onChangeText={setOtStartTime}
                                    placeholder="18:00"
                                    placeholderTextColor={colors.textSecondary}
                                    style={styles.input}
                                />
                            </View>

                            <View style={{ flex: 1, gap: 6 }}>
                                <Text style={styles.subLabel}>Đến</Text>
                                <TextInput
                                    value={otEndTime}
                                    onChangeText={setOtEndTime}
                                    placeholder="21:00"
                                    placeholderTextColor={colors.textSecondary}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {!!errors.ot && <Text style={styles.errorText}>{errors.ot}</Text>}
                    </View>
                )}

                {/* Nội dung */}
                <View style={{ gap: 6 }}>
                    <Text style={styles.fieldLabel}>Nội dung</Text>
                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        placeholder="Nhập nội dung..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
                    />
                </View>

                {/* Submit */}
                <Pressable
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    style={[
                        styles.submitBtn,
                        !canSubmit && { opacity: 0.4 },
                    ]}
                >
                    <Text style={styles.submitText}>Gửi đơn</Text>
                </Pressable>
            </ScrollView>

            {/* Pickers */}
            <BottomSheetSingleSelect
                visible={typeOpen}
                title="Loại đơn yêu cầu"
                selected={type}
                onClose={() => setTypeOpen(false)}
                options={[
                    { key: 'LEAVE', label: 'Đơn nghỉ phép' },
                    { key: 'OT', label: 'Đơn tăng ca' },
                    { key: 'EXPLAIN', label: 'Giải trình' },
                ]}
                onSelect={k => {
                    setType(k as RequestType);
                    setTypeOpen(false);
                }}
            />


            <BottomSheetSingleSelect
                visible={leaveSubtypeOpen}
                title="Loại nghỉ phép"
                selected={leaveSubtype}
                onClose={() => setLeaveSubtypeOpen(false)}
                options={[
                    { key: 'ANNUAL', label: 'Nghỉ phép năm' },
                    { key: 'UNPAID', label: 'Nghỉ không lương' },
                    { key: 'SICK', label: 'Nghỉ ốm' },
                    { key: 'MATERNITY', label: 'Nghỉ thai sản' },
                    { key: 'OTHER', label: 'Khác' },
                ]}
                onSelect={k => {
                    setLeaveSubtype(k as LeaveSubtype);
                    setLeaveSubtypeOpen(false);
                }}
            />

            {/* Calendar dialog */}
            <Modal visible={calendarOpen} transparent animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setCalendarOpen(false)}>
                    <Pressable style={styles.calendarDialog} onPress={() => { }}>
                        <View style={styles.calendarHeader}>
                            <Text style={styles.calendarTitle}>Chọn thời gian</Text>
                            <Pressable onPress={() => setCalendarOpen(false)} hitSlop={10}>
                                <FontAwesome5 name="times" size={18} color={colors.textPrimary} />
                            </Pressable>
                        </View>

                        {/* ✅ Calendar component của bạn */}
                        <DateRangeCalendar
                            monthCursor={dr.monthCursor}
                            onPrevMonth={dr.onPrevMonth}
                            onNextMonth={dr.onNextMonth}
                            rangeStart={dr.rangeStart}
                            rangeEnd={dr.rangeEnd}
                            onPickDay={dr.onPickDay}
                        />

                        <View style={styles.calendarActions}>
                            <Pressable
                                style={[styles.btn, styles.btnOutline]}
                                onPress={() => {
                                    setRangeStart(null);
                                    setRangeEnd(null);
                                    setCalendarOpen(false);
                                }}
                            >
                                <Text style={[styles.btnText, styles.btnOutlineText]}>Đóng</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.btn, styles.btnPrimary]}
                                onPress={() => setCalendarOpen(false)}
                            >
                                <Text style={[styles.btnText, styles.btnPrimaryText]}>Xác nhận</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },

    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
    },

    fieldLabel: {
        ...typography.body,
        color: colors.textPrimary,
    },
    subLabel: {
        ...typography.small,
        color: colors.textSecondary,
    },

    fieldBox: {
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    fieldText: {
        ...typography.body,
        color: colors.textPrimary,
        flex: 1,
    },

    input: {
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
    },

    twoCols: {
        flexDirection: 'row',
        gap: spacing.md,
    },

    submitBtn: {
        marginTop: spacing.md,
        height: 46,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        ...typography.bodyMedium,
        color: '#fff',
    },

    errorText: {
        ...typography.small,
        color: colors.danger,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'flex-end',
    },

    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: spacing.lg,
        overflow: 'hidden',
    },
    sheetHeader: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sheetTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    sheetRow: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sheetRowActive: {
        backgroundColor: '#FFF2EA',
    },
    sheetRowText: {
        ...typography.body,
        color: colors.textPrimary,
    },
    sheetRowTextActive: {
        fontFamily: typography.fontFamily?.medium,
    },

    calendarDialog: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: spacing.lg,
        overflow: 'hidden',
    },
    calendarHeader: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calendarTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    calendarActions: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    btn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        ...typography.bodyMedium,
    },
    btnOutline: {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: '#fff',
    },
    btnOutlineText: {
        color: colors.primary,
    },
    btnPrimary: {
        backgroundColor: colors.primary,
    },
    btnPrimaryText: {
        color: '#fff',
    },
});
