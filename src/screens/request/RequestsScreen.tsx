import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestStackParamList } from '../../navigations/RequestStack';
import RequestCard from '../../components/request/RequestCard';
import AppSearchInput from '../../components/ui/AppSearchInput';

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

function normalizeText(s: string) {
    return (s ?? '').trim().toLowerCase();
}

export default function RequestsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RequestStackParamList>>();

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
        >
            <Header title="Đơn yêu cầu" showBack variant="primary" />

            <View style={styles.body}>
                {/* Search */}
                <AppSearchInput
                    value={q}
                    onChangeText={setQ}
                    onClear={() => setQ('')}
                />


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
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: { paddingHorizontal: 0, paddingTop: 0 },

    body: {
        flex: 1,
        backgroundColor: colors.surface,
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
});
