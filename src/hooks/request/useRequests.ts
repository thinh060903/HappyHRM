import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RequestStackParamList } from '../../navigations/RequestStack';

import { MOCK_REQUESTS } from '../../data/request/request.mock';
import { RequestItem } from '../../types/request/requestItem';
import { RequestType } from '../../types/request/requestType';
import { RequestStatus } from '../../types/request/requestStatus';

const TYPE_LABEL: Record<RequestType, string> = {
  LEAVE: 'Đơn nghỉ phép',
  OT: 'Đơn tăng ca',
  EXPLAIN: 'Giải trình',
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

function normalizeText(s: string) {
  return (s ?? '').trim().toLowerCase();
}

export function useRequests() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RequestStackParamList>>();
  const data = MOCK_REQUESTS;

  // ===== Filters =====
  const [q, setQ] = useState('');
  const [typeFilter, _setTypeFilter] = useState<RequestType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>(
    'ALL',
  );
  const [timeFilter, _setTimeFilter] = useState<
    'ALL' | 'THIS_MONTH' | 'THIS_YEAR'
  >('ALL');

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
      const okStatus =
        statusFilter === 'ALL' ? true : it.status === statusFilter;
      const okTime = timeFilter === 'ALL' ? true : true;

      return okQ && okType && okStatus && okTime;
    });
  }, [data, q, typeFilter, statusFilter, timeFilter]);

  const counts = useMemo(() => {
    const byStatus = { ALL: data.length, pending: 0, approved: 0, rejected: 0 };
    for (const it of data) byStatus[it.status] += 1;
    return byStatus;
  }, [data]);

  const statusTabs: {
    key: RequestStatus | 'ALL';
    label: string;
    count: number;
  }[] = useMemo(
    () => [
      { key: 'ALL', label: 'Tất cả', count: counts.ALL },
      { key: 'pending', label: 'Chờ duyệt', count: counts.pending },
      { key: 'approved', label: 'Đã duyệt', count: counts.approved },
      { key: 'rejected', label: 'Từ chối', count: counts.rejected },
    ],
    [counts],
  );

  const goCreate = () => navigation.navigate('CreateRequest');
  const goDetail = (item: RequestItem) =>
    navigation.navigate('RequestDetail', { item });
  return {
    filtered,
    statusTabs,
    goCreate,
    goDetail,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
    typeFilter,
    timeFilter,
  };
}
