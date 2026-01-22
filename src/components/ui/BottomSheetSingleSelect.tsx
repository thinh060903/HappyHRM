import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';


export default function BottomSheetSingleSelect({
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

const styles = StyleSheet.create({
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
