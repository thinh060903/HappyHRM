import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';

type RequestType = 'LEAVE' | 'OT' | 'EXPLAIN';
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type RequestItem = {
    id: string;
    type: RequestType;
    title: string; // hiển thị dòng tiêu đề: "Đơn nghỉ phép năm", "Đơn tăng ca"...
    timeText: string; // "05/11 - 11/11/2023" hoặc "05/11/2023"
    createdAtText: string; // "25/08/2023, 2 giờ"
    status: RequestStatus;
};

const TYPE_LABEL: Record<RequestType, string> = {
    LEAVE: 'Đơn nghỉ phép',
    OT: 'Đơn tăng ca',
    EXPLAIN: 'Giải trình',
};

const STATUS_LABEL: Record<RequestStatus, string> = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
};

const STATUS_STYLE: Record<
    RequestStatus,
    { bg: string; text: string; border?: string }
> = {
    PENDING: { bg: '#FFF3D6', text: '#9A6700', border: '#FFE2A8' },
    APPROVED: { bg: '#E8F7EF', text: '#0D7A3B', border: '#CFEFDB' },
    REJECTED: { bg: '#FDE8EA', text: '#B42318', border: '#FAC5CC' },
};

function normalizeText(s: string) {
    return (s ?? '').trim().toLowerCase();
}

function Chip({
    label,
    value,
    onPress,
}: {
    label: string;
    value?: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.chip}>
            <Text style={styles.chipText}>
                {label}
                {value ? `: ${value}` : ''}
            </Text>
            <FontAwesome5 name="chevron-down" size={12} color={colors.textSecondary} />
        </Pressable>
    );
}

function BottomSheetPicker({
    visible,
    title,
    options,
    selected,
    onClose,
    onSelect,
}: {
    visible: boolean;
    title: string;
    options: { key: string; label: string }[];
    selected?: string;
    onClose: () => void;
    onSelect: (key: string) => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => { }}>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>{title}</Text>
                        <Pressable onPress={onClose} hitSlop={10}>
                            <FontAwesome5 name="times" size={18} color={colors.textPrimary} />
                        </Pressable>
                    </View>

                    {options.map(opt => {
                        const active = opt.key === selected;
                        return (
                            <Pressable
                                key={opt.key}
                                style={[styles.sheetRow, active && styles.sheetRowActive]}
                                onPress={() => onSelect(opt.key)}
                            >
                                <Text style={[styles.sheetRowText, active && styles.sheetRowTextActive]}>
                                    {opt.label}
                                </Text>
                                {active && (
                                    <FontAwesome5 name="check" size={16} color={colors.primary} />
                                )}
                            </Pressable>
                        );
                    })}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function RequestCard({
    item,
    onPress,
}: {
    item: RequestItem;
    onPress: () => void;
}) {
    const ss = STATUS_STYLE[item.status];

    return (
        <Pressable onPress={onPress} style={styles.card} android_ripple={{ color: '#00000010' }}>
            <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <View
                    style={[
                        styles.statusPill,
                        { backgroundColor: ss.bg, borderColor: ss.border ?? ss.bg },
                    ]}
                >
                    <Text style={[styles.statusText, { color: ss.text }]}>
                        {STATUS_LABEL[item.status]}
                    </Text>
                </View>
            </View>

            <Text style={styles.cardTime}>{item.timeText}</Text>

            <View style={styles.cardBottom}>
                <Text style={styles.cardMeta}>{item.createdAtText}</Text>
            </View>
        </Pressable>
    );
}

export default function RequestsScreen() {
    const navigation = useNavigation<any>();

    // ===== Mock data (bạn thay bằng API sau) =====
    const data = useMemo<RequestItem[]>(
        () => [
            {
                id: 'r1',
                type: 'LEAVE',
                title: 'Đơn nghỉ phép năm',
                timeText: '05/11 - 11/11/2023',
                createdAtText: '25/08/2023, 2 giờ',
                status: 'APPROVED',
            },
            {
                id: 'r2',
                type: 'LEAVE',
                title: 'Đơn nghỉ phép năm',
                timeText: '28/05/2023',
                createdAtText: '25/08/2023, 4 giờ',
                status: 'REJECTED',
            },
            {
                id: 'r3',
                type: 'EXPLAIN',
                title: 'Đơn giải trình',
                timeText: '24/10/2022',
                createdAtText: '25/08/2023, 4 giờ',
                status: 'APPROVED',
            },
            {
                id: 'r4',
                type: 'OT',
                title: 'Đơn tăng ca',
                timeText: '05/11/2023',
                createdAtText: '25/08/2023, 1 ngày',
                status: 'PENDING',
            },
            {
                id: 'r5',
                type: 'LEAVE',
                title: 'Đơn nghỉ phép năm',
                timeText: '26/08/2023',
                createdAtText: '25/08/2023, 2 ngày',
                status: 'PENDING',
            },
        ],
        [],
    );

    // ===== Filters =====
    const [q, setQ] = useState('');
    const [typeFilter, setTypeFilter] = useState<RequestType | 'ALL'>('ALL');
    const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');
    const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'THIS_YEAR'>('ALL');

    // Picker visibility
    const [typeOpen, setTypeOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);

    const filtered = useMemo(() => {
        const keyword = normalizeText(q);

        // (demo) timeFilter chỉ minh hoạ, chưa “lọc thật theo Date”
        // vì mock data đang là text. Khi nối API, bạn lọc theo createdAt/startDate/endDate.
        return data.filter(it => {
            const okQ =
                !keyword ||
                normalizeText(it.title).includes(keyword) ||
                normalizeText(TYPE_LABEL[it.type]).includes(keyword) ||
                normalizeText(STATUS_LABEL[it.status]).includes(keyword);

            const okType = typeFilter === 'ALL' ? true : it.type === typeFilter;
            const okStatus = statusFilter === 'ALL' ? true : it.status === statusFilter;
            const okTime = timeFilter === 'ALL' ? true : true;

            return okQ && okType && okStatus && okTime;
        });
    }, [data, q, typeFilter, statusFilter, timeFilter]);

    const counts = useMemo(() => {
        const byStatus = { ALL: data.length, PENDING: 0, APPROVED: 0, REJECTED: 0 };
        for (const it of data) byStatus[it.status] += 1;
        return byStatus;
    }, [data]);

    const statusTabs: { key: RequestStatus | 'ALL'; label: string; count: number }[] =
        useMemo(
            () => [
                { key: 'ALL', label: 'Tất cả', count: counts.ALL },
                { key: 'PENDING', label: 'Chờ duyệt', count: counts.PENDING },
                { key: 'APPROVED', label: 'Đã duyệt', count: counts.APPROVED },
                { key: 'REJECTED', label: 'Từ chối', count: counts.REJECTED },
            ],
            [counts],
        );

    const goCreate = () => navigation.navigate('CreateRequest');
    const goDetail = (item: RequestItem) => navigation.navigate('RequestDetail', { item });

    return (
        <Screen
            backgroundColor={colors.background} // để safe-area top cùng màu header
            style={styles.screen} // bỏ padding mặc định
            edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
            keyboardAvoiding // ✅ tránh bàn phím
            keyboardVerticalOffset={0} // Android để 0
        >            <Header title="Đơn yêu cầu" showBack variant="primary" />

            <View style={styles.body}>
                {/* Search */}
                <View style={styles.searchWrap}>
                    <FontAwesome5 name="search" size={14} color={colors.textSecondary} />
                    <TextInput
                        value={q}
                        onChangeText={setQ}
                        placeholder="Tìm kiếm"
                        placeholderTextColor={colors.textSecondary}
                        style={styles.searchInput}
                    />
                    {!!q && (
                        <Pressable onPress={() => setQ('')} hitSlop={10}>
                            <FontAwesome5 name="times-circle" size={16} color={colors.textSecondary} />
                        </Pressable>
                    )}
                </View>

                {/* Filter chips row */}
                <View style={styles.filtersRow}>
                    <Chip
                        label="Loại đơn"
                        value={typeFilter === 'ALL' ? 'Tất cả' : TYPE_LABEL[typeFilter]}
                        onPress={() => setTypeOpen(true)}
                    />
                    <Chip
                        label="Trạng thái"
                        value={statusFilter === 'ALL' ? 'Tất cả' : STATUS_LABEL[statusFilter]}
                        onPress={() => setStatusOpen(true)}
                    />
                    <Chip
                        label="Thời gian"
                        value={
                            timeFilter === 'ALL'
                                ? 'Tất cả'
                                : timeFilter === 'THIS_MONTH'
                                    ? 'Tháng này'
                                    : 'Năm nay'
                        }
                        onPress={() => setTimeOpen(true)}
                    />
                </View>

                {/* Status tabs */}
                <View style={styles.tabsRow}>
                    {statusTabs.map(t => {
                        const active = statusFilter === t.key;
                        return (
                            <Pressable
                                key={t.key}
                                onPress={() => setStatusFilter(t.key)}
                                style={[styles.tab, active && styles.tabActive]}
                            >
                                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                    {t.label}
                                </Text>
                                <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                                    <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                                        {t.count}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

                {/* List */}
                <FlatList
                    data={filtered}
                    keyExtractor={it => it.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <RequestCard item={item} onPress={() => goDetail(item)} />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyText}>Không có đơn phù hợp.</Text>
                        </View>
                    }
                />

                {/* FAB create */}
                <Pressable onPress={goCreate} style={styles.fab} hitSlop={10}>
                    <FontAwesome5 name="plus" size={18} color="#fff" />
                </Pressable>
            </View>

            {/* Pickers */}
            <BottomSheetPicker
                visible={typeOpen}
                title="Loại đơn yêu cầu"
                selected={typeFilter}
                onClose={() => setTypeOpen(false)}
                options={[
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'LEAVE', label: 'Đơn nghỉ phép' },
                    { key: 'OT', label: 'Đơn tăng ca' },
                    { key: 'EXPLAIN', label: 'Giải trình' },
                ]}
                onSelect={k => {
                    setTypeFilter(k as any);
                    setTypeOpen(false);
                }}
            />

            <BottomSheetPicker
                visible={statusOpen}
                title="Trạng thái"
                selected={statusFilter}
                onClose={() => setStatusOpen(false)}
                options={[
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'PENDING', label: 'Chờ duyệt' },
                    { key: 'APPROVED', label: 'Đã duyệt' },
                    { key: 'REJECTED', label: 'Từ chối' },
                ]}
                onSelect={k => {
                    setStatusFilter(k as any);
                    setStatusOpen(false);
                }}
            />

            <BottomSheetPicker
                visible={timeOpen}
                title="Thời gian"
                selected={timeFilter}
                onClose={() => setTimeOpen(false)}
                options={[
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'THIS_MONTH', label: 'Tháng này' },
                    { key: 'THIS_YEAR', label: 'Năm nay' },
                ]}
                onSelect={k => {
                    setTimeFilter(k as any);
                    setTimeOpen(false);
                }}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },

    body: {
        flex: 1,
        backgroundColor: colors.surface,
    },

    searchWrap: {
        marginTop: spacing.lg,
        marginHorizontal: spacing.lg,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary,
    },

    filtersRow: {
        marginTop: spacing.md,
        marginHorizontal: spacing.lg,
        flexDirection: 'row',
        gap: spacing.sm,
    },
    chip: {
        flex: 1,
        height: 38,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chipText: {
        ...typography.small,
        color: colors.textPrimary,
    },

    tabsRow: {
        marginTop: spacing.md,
        marginHorizontal: spacing.lg,
        flexDirection: 'row',
        gap: spacing.sm,
    },
    tab: {
        flex: 1,
        height: 36,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#fff',
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    tabActive: {
        borderColor: colors.primary,
        backgroundColor: '#FFF2EA',
    },
    tabText: {
        ...typography.small,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily?.medium,
    },
    tabBadge: {
        minWidth: 22,
        height: 18,
        paddingHorizontal: 6,
        borderRadius: 999,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBadgeActive: {
        backgroundColor: colors.primary,
    },
    tabBadgeText: {
        ...typography.small,
        color: colors.textSecondary,
    },
    tabBadgeTextActive: {
        color: '#fff',
    },

    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
        gap: spacing.md,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    cardTitle: {
        flex: 1,
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    statusPill: {
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        ...typography.small,
    },
    cardTime: {
        marginTop: spacing.sm,
        ...typography.body,
        color: colors.textSecondary,
    },
    cardBottom: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardMeta: {
        ...typography.small,
        color: colors.textSecondary,
    },

    emptyWrap: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
    },

    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
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
});
