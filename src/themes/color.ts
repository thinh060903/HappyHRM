// Tập chung quản lý toàn bộ màu sắc của app tại 1 chỗ

export const colors = {
  /* ===== Brand Color (CSK - #EE8241) ===== */
  brand: {
    50: '#FFF2EA', // Background login
    100: '#FEE0CD',
    200: '#FDC7A6',
    300: '#FBAF80',
    400: '#F79659',
    500: '#EE8241', // PRIMARY BUTTON
    600: '#D96E2F', // Pressed / Active
    700: '#B75822',
    800: '#8F4218',
    900: '#5A2A0F',
    950: '#2B1407',
  },

  /* ===== Alias (dùng trong code hằng ngày) ===== */
  primary: '#EE8241',
  primaryPressed: '#D96E2F',

  /* ===== Background ===== */
  background: '#FFFFFF',
  loginBackground: '#FFF2EA', // brand[50]
  surface: '#FFFFFF',

  /* ===== Text ===== */
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#C7C7CC',
  textPlaceholder: '#AEAEB2',

  /* ===== Border ===== */
  border: '#E5E5EA',

  /* ===== Status ===== */
  success: '#34C759',
  successSoft: 'rgba(52, 199, 89, 0.12)', // Based on success #34C759 but with opacity, or similar to the fallback 'rgba(46, 125, 50, 0.12)'
  warning: '#FF9F0A',
  warningSoft: 'rgba(255, 159, 10, 0.15)', // Based on warning #FF9F0A
  error: '#FF3B30',
  danger: '#FF3B30',
  dangerSoft: 'rgba(255, 59, 48, 0.12)', // Based on danger #FF3B30

  /* ===== Button ===== */
  buttonDisabledBg: '#F3F4F6',
  buttonDisabledText: '#9CA3AF',
};
