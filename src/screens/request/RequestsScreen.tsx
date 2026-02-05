import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import { colors } from '../../themes/color';

import { useRequests } from '../../hooks/request/useRequests';

import Header from '../../components/layout/Header';
import Screen from '../../components/layout/Screen';

import RequestCard from '../../components/request/RequestCard';
import AppSearchInput from '../../components/ui/AppSearchInput';

export default function RequestsScreen() {
  const {
    filtered,
    statusTabs,
    goCreate,
    goDetail,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
  } = useRequests();

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
        <View style={styles.topArea}>
          <AppSearchInput
            value={q}
            onChangeText={setQ}
            onClear={() => setQ('')}
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
                <View
                  style={[styles.tabBadge, active && styles.tabBadgeActive]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      active && styles.tabBadgeTextActive,
                    ]}
                  >
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

  topArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },

  tabsRow: {
    // marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
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
    // paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
    backgroundColor: colors.backgroundRow,
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
