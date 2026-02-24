import React from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '../../components/layout/Screen';
import Header from '../../components/layout/Header';

import spacing from '../../themes/spacing';
import { colors } from '../../themes/color';
import InfoTab from './tabs/InfoTab';
import LeaveRequestTab from './tabs/LeaveRequestTab';
import ExplanationTab from './tabs/ExplanationTab';
import TopTab from '../../components/attendance/TopTab';
import useTimekeepingDetail from '../../hooks/attendance/useTimekeepingDetail';

export default function TimekeepingDetailScreen() {
  const { navigation, date, tab, setTab, item, title } = useTimekeepingDetail();

  return (
    <Screen
      style={styles.screen} // bỏ padding mặc định
      edges={['left', 'right', 'bottom']} // có Header -> Screen không cộng top
      keyboardAvoiding // ✅ tránh bàn phím
      keyboardVerticalOffset={0} // Android để 0
    >
      <Header title={title} showBack variant="primary" />
      {/* tab bar sát header */}
      <View style={styles.tabBar}>
        <TopTab
          label="Thông tin"
          active={tab === 'info'}
          onPress={() => setTab('info')}
        />
        <TopTab
          label="Quản lý đơn nghỉ"
          active={tab === 'leave_request'}
          onPress={() => setTab('leave_request')}
        />
        <TopTab
          label="Quản lý giải trình"
          active={tab === 'explanation'}
          onPress={() => setTab('explanation')}
        />
      </View>

      {/* content (tạm để trống / placeholder) */}
      <View style={styles.body}>
        {tab === 'info' && <InfoTab item={item} />}
        {tab === 'leave_request' && (
          <LeaveRequestTab
            onPressCreate={() =>
              navigation.navigate('CreateLeaveRequest', { date })
            }
            onPressItem={it =>
              navigation.navigate('LeaveRequestDetail', { id: it.id })
            }
          />
        )}
        {tab === 'explanation' && (
          <ExplanationTab
            onPressCreate={() =>
              navigation.navigate('CreateExplanation', { date, item })
            }
            onPressItem={it =>
              navigation.navigate('ExplanationDetail', { id: it.id })
            }
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0, paddingTop: 0 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
  },

  body: {
    flex: 1,
    paddingTop: spacing.md,
    backgroundColor: colors.backgroundRow,
  },
});
