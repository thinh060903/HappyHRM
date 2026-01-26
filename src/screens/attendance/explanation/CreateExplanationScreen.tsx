import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Screen from '../../../components/layout/Screen';
import Header from '../../../components/layout/Header';

import spacing from '../../../themes/spacing';
import typography from '../../../themes/typography';
import { colors } from '../../../themes/color';

function ConfirmModal({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Modal visible={open} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={styles.modalIcon}>
                        <FontAwesome5 name="check" size={18} color="#0D7A3B" />
                    </View>

                    <Text style={styles.modalTitle}>Cập nhật đơn giải trình?</Text>
                    <Text style={styles.modalDesc}>
                        Bạn xác nhận gửi/cập nhật đơn giải trình chấm công này chứ?
                    </Text>

                    <View style={styles.modalActions}>
                        <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
                            <Text style={[styles.btnText, { color: colors.textPrimary }]}>Hủy</Text>
                        </Pressable>

                        <Pressable onPress={onConfirm} style={[styles.btn, styles.btnPrimary]}>
                            <Text style={[styles.btnText, { color: '#fff' }]}>Xác nhận</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function CreateExplanationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const date = route.params?.date;

    const title = useMemo(() => 'Giải trình chấm công', []);
    const [content, setContent] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const canSubmit = content.trim().length > 0;

    const onSubmit = () => {
        if (!canSubmit) return;
        setConfirmOpen(true);
    };

    const onConfirm = () => {
        setConfirmOpen(false);

        // ✅ giả lập thành công → quay về Chi tiết chấm công (tab giải trình)
        navigation.navigate('TimekeepingDetail', { tab: 'explanation', date });
    };

    return (
        <Screen
            backgroundColor={colors.background}
            style={{ paddingHorizontal: 0, paddingTop: 0 }}
            edges={['left', 'right', 'bottom']}
            keyboardAvoiding
            keyboardVerticalOffset={0}
        >
            <Header title={title} showBack variant="primary" />

            <View style={styles.form}>
                <Text style={styles.label}>Nội dung giải trình</Text>

                <View style={styles.textAreaWrap}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="VD: Đi sớm về muộn vì..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        style={styles.textArea}
                    />
                </View>

                <Pressable
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                >
                    <Text style={styles.submitText}>Cập nhật</Text>
                </Pressable>
            </View>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={onConfirm}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: spacing.lg,
    },
    label: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    textAreaWrap: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        minHeight: 140,
    },
    textArea: {
        ...typography.body,
        color: colors.textPrimary,
        minHeight: 120,
        textAlignVertical: 'top',
    },

    submitBtn: {
        marginTop: spacing.xl,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnDisabled: {
        opacity: 0.45,
    },
    submitText: {
        ...typography.button,
        color: '#fff',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    modalCard: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: colors.surface,
        padding: spacing.xl,
    },
    modalIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E7F6EC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    modalTitle: {
        ...typography.bodyMedium,
        color: colors.textPrimary,
    },
    modalDesc: {
        marginTop: spacing.sm,
        ...typography.small,
        color: colors.textSecondary,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    btn: {
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnGhost: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    btnPrimary: {
        backgroundColor: colors.primary,
    },
    btnText: {
        ...typography.button,
    },
});
