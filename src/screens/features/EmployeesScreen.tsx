import React from 'react';
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
import EmployeeRow from '../../components/employees/EmployeeRow';
import { useEmployees } from '../../hooks/features/useEmployees';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import AppSearchInput from '../../components/ui/AppSearchInput';

export default function EmployeesScreen() {
  const {
    loading,
    error,
    refetch,
    sortMode,
    setSortMode,
    query,
    setQuery,
    isSearching,
    isEmptyResult,
    sections,
  } = useEmployees();

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
        {/* 1) Loading lần đầu (đang gọi Supabase) */}
        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator />
            <Text style={styles.centerText}>
              Đang tải danh sách nhân viên...
            </Text>
          </View>
        ) : error ? (
          /* 2) Error state */
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <FontAwesome5
                name="exclamation-triangle"
                size={22}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyText}>Không tải được dữ liệu</Text>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={refetch} style={styles.retryBtn}>
              <FontAwesome5 name="redo" size={14} color={colors.primary} />
              <Text style={styles.retryText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Loading overlay khi user đang gõ search (giữ như cũ) */}
            {isSearching && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator />
              </View>
            )}

            {/* Empty state khi search không có kết quả (giữ như cũ) */}
            {isEmptyResult ? (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <FontAwesome5
                    name="search"
                    size={24}
                    color={colors.primary}
                  />
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
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                renderSectionHeader={({ section }) => {
                  if (!section.title) return null;

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
          </>
        )}
      </View>
    </Screen>
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

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  centerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
