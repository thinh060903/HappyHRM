import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';
import AppText from '../ui/AppText';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderVariant = 'primary' | 'surface';

interface HeaderProps {
  title: string;

  showBack?: boolean;
  showMenu?: boolean;

  // style
  variant?: HeaderVariant;

  // right side
  right?: ReactNode;
  rightIconName?: string; // Ionicons name (vd "notifications-outline")
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showMenu = false,
  variant = 'surface',
  right,
  rightIconName,
  onRightPress,
}) => {
  const navigation = useNavigation<any>();

  const isPrimary = variant === 'primary';
  const bg = isPrimary ? colors.primary : colors.surface;
  const titleColor = isPrimary ? colors.textOnPrimary : colors.textPrimary;
  const iconColor = isPrimary ? colors.textOnPrimary : colors.textPrimary;

  const insets = useSafeAreaInsets();
  const HEADER_BAR = 56; // chiều cao toolbar chuẩn

  const containerStyle = {
    backgroundColor: bg,
    paddingTop: insets.top, // ✅ inset thật
    height: HEADER_BAR + insets.top, // ✅ không hard-code 88
  };

  return (
    <View
      style={[styles.container, containerStyle, !isPrimary && styles.border]}
    >
      {/* LEFT */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={iconColor} />
          </TouchableOpacity>
        )}

        {!showBack && showMenu && (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* CENTER */}
      <AppText style={[styles.title, { color: titleColor }]} numberOfLines={1}>
        {title}
      </AppText>

      {/* RIGHT */}
      <View style={styles.right}>
        {right ? (
          right
        ) : rightIconName ? (
          <TouchableOpacity
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIconName} size={22} color={iconColor} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  left: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  right: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
  },
});
