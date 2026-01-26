import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../../themes/color';
import spacing from '../../themes/spacing';
import typography from '../../themes/typography';

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
};

export default function AppSearchInput({
    value,
    onChangeText,
    placeholder = 'Tìm kiếm',
    onClear,
}: Props) {
    return (
        <View style={styles.searchBox}>
            <FontAwesome5
                name="search"
                size={14}
                color={colors.textSecondary}
            />

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                blurOnSubmit
                keyboardAppearance="default"
            />

            {!!value && (
                <Pressable
                    onPress={onClear}
                    hitSlop={10}
                    style={styles.clearBtn}
                >
                    <FontAwesome5
                        name="times-circle"
                        size={16}
                        color={colors.textSecondary}
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    searchBox: {
        height: 40,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary,
        paddingVertical: 0,
    },
    clearBtn: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
