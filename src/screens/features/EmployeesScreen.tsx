import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';
import EmployeeRow, { Employee } from '../../components/employees/EmployeeRow';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import AppSearchInput from '../../components/ui/AppSearchInput';

// import { employeesCol } from '../../services/firestore';

type SortMode = 'newest' | 'alpha' | 'dept';

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e01',
    name: 'Emine Avci',
    email: 'cameromiapec.com.vn',
    title: 'UI/UX Designer',
    department: 'Phòng Công nghệ thông tin',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60',
    createdAt: 1700000600,
  },
  {
    id: 'e02',
    name: 'Burhan Caliskan',
    email: 'cameromiapec.com.vn',
    title: 'Ux Architect',
    department: 'Phòng Công nghệ thông tin',
    createdAt: 1700000500,
  },
  {
    id: 'e03',
    name: 'Sukru AI',
    email: 'cameromiapec.com.vn',
    title: 'PHP Developer',
    department: 'Phòng Công nghệ thông tin',
    createdAt: 1700000400,
  },
  {
    id: 'e04',
    name: 'Rifat Tufekci',
    email: 'cameromiapec.com.vn',
    title: 'WordPress',
    department: 'Phòng Công nghệ thông tin',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=60',
    createdAt: 1700000300,
  },
  {
    id: 'e05',
    name: 'Muazzez Yasar',
    email: 'cameromiapec.com.vn',
    title: 'Python Developer',
    department: 'Phòng Công nghệ thông tin',
    createdAt: 1700000200,
  },
  {
    id: 'e06',
    name: 'Meryem Celik',
    email: 'cameromiapec.com.vn',
    title: 'Freshers',
    department: 'Phòng Công nghệ thông tin',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=60',
    createdAt: 1700000100,
  },

  // thêm vài phòng ban để demo sort theo phòng/ban
  {
    id: 'e07',
    name: 'Aourtney Henry',
    email: 'cameromiapec.com.vn',
    title: 'Joomla Developer',
    department: 'Phòng Marketing',
    createdAt: 1699999900,
  },
  {
    id: 'e08',
    name: 'Auy Hawkins',
    email: 'cameromiapec.com.vn',
    title: 'PHP Developer',
    department: 'Phòng Tài Chính',
    createdAt: 1699999800,
  },
  {
    id: 'e09',
    name: 'Nguyen Van An',
    email: 'nguyenvanan.com.vn',
    title: 'UI/UX Designer',
    department: 'Phòng Marketing',
    createdAt: 1699999700,
  },
];

const normalize = (s: string) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

export default function EmployeesScreen() {
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  // search
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    // Có gõ => show loading 1 nhịp (giống hình 2)
    if (debouncedQuery.trim().length === 0) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(() => setIsSearching(false), 450);
    return () => clearTimeout(t);
  }, [debouncedQuery]);

  const baseSorted = useMemo(() => {
    const arr = [...MOCK_EMPLOYEES];

    if (sortMode === 'newest') {
      arr.sort((a, b) => b.createdAt - a.createdAt);
      return arr;
    }

    if (sortMode === 'alpha') {
      arr.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name)));
      return arr;
    }

    // dept
    arr.sort((a, b) => {
      const d = normalize(a.department).localeCompare(normalize(b.department));
      if (d !== 0) return d;
      return normalize(a.name).localeCompare(normalize(b.name));
    });
    return arr;
  }, [sortMode]);

  const filtered = useMemo(() => {
    const q = normalize(debouncedQuery);
    if (!q) return baseSorted;

    return baseSorted.filter(e => {
      const hay = normalize(`${e.name} ${e.email} ${e.title} ${e.department}`);
      return hay.includes(q);
    });
  }, [baseSorted, debouncedQuery]);

  const hasQuery = debouncedQuery.trim().length > 0;
  const isEmptyResult = hasQuery && !isSearching && filtered.length === 0;

  const sections = useMemo(() => {
    // Default & Search result (newest): list bình thường
    if (sortMode === 'newest' || hasQuery) {
      return [{ title: '', data: filtered }];
    }

    if (sortMode === 'alpha') {
      const map = new Map<string, Employee[]>();
      filtered.forEach(e => {
        const key = (e.name.trim()[0] ?? '#').toUpperCase();
        map.set(key, [...(map.get(key) ?? []), e]);
      });

      return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([title, data]) => ({ title, data }));
    }

    // dept
    const map = new Map<string, Employee[]>();
    filtered.forEach(e => {
      const key = e.department;
      map.set(key, [...(map.get(key) ?? []), e]);
    });

    return Array.from(map.entries())
      .sort((a, b) => normalize(a[0]).localeCompare(normalize(b[0])))
      .map(([title, data]) => ({ title, data }));
  }, [filtered, sortMode, hasQuery]);

  const resetScreen = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsSearching(false);
    setSortMode('newest');
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetScreen();
      };
    }, []),
  );

  return (
    <Screen
      backgroundColor={colors.background} // để safe-area top cùng màu header
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      {' '}
      {/* Header */}
      <Header title="Nhân viên" showBack variant="primary" />
      {/* Search + Sort */}
      <View style={styles.topArea}>
        <AppSearchInput
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
        />

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sắp xếp:</Text>

          <SortChip
            label="Phòng/Ban"
            active={sortMode === 'dept'}
            onPress={() => setSortMode('dept')}
          />
          <SortChip
            label="Chữ cái"
            active={sortMode === 'alpha'}
            onPress={() => setSortMode('alpha')}
          />
        </View>
      </View>
      {/* Body */}
      <View style={{ flex: 1 }}>
        {/* Loading overlay (giống ảnh 30.Loading) */}
        {isSearching && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator />
          </View>
        )}

        {/* Empty state (giống ảnh 32.Blank) */}
        {isEmptyResult ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <FontAwesome5 name="search" size={24} color={colors.primary} />
            </View>

            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>

            <Pressable onPress={() => setQuery('')} style={styles.retryBtn}>
              <FontAwesome5 name="redo" size={14} color={colors.primary} />
              <Text style={styles.retryText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={false}
            keyboardShouldPersistTaps="handled" // ✅ quan trọng
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            renderSectionHeader={({ section }) => {
              if (!section.title) return null;

              // sort alpha => header chữ cái (A/B/C)
              // sort dept  => header phòng ban (màu cam)
              const isDept = sortMode === 'dept';
              return (
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionHeaderText,
                      isDept && styles.sectionHeaderTextDept,
                    ]}
                  >
                    {section.title}
                  </Text>
                </View>
              );
            }}
            renderItem={({ item, index, section }) => {
              const isLast = index === section.data.length - 1;

              return (
                <View>
                  <EmployeeRow item={item} />
                  {!isLast && <View style={styles.divider} />}
                </View>
              );
            }}
          />
        )}
      </View>
    </Screen >
  );
}

function SortChip({
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
      style={[
        styles.chip,
        active && { borderColor: colors.primary, backgroundColor: '#FFF2EA' },
      ]}
    >
      <Text style={[styles.chipText, active && { color: colors.primary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  topArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },

  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  sortLabel: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  chip: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    ...typography.small,
    color: colors.textSecondary,
  },

  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    zIndex: 10,
  },

  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#F3F4F6',
  },
  sectionHeaderText: {
    ...typography.small,
    color: colors.textPrimary,
  },
  sectionHeaderTextDept: {
    color: colors.primary,
    ...typography.bodyMedium,
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: 10,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF2EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  retryText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 44 + spacing.md,
  },
});
