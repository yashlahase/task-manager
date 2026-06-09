import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps, TouchableOpacity, Platform } from 'react-native';
import { Colors, Typography } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  isPassword = false,
  iconName,
  style,
  onBlur,
  onFocus,
  multiline,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isFocused && styles.focusedLabel, !!error && styles.errorLabel]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineInputContainer,
          isFocused && styles.focusedInputContainer,
          !!error && styles.errorInputContainer,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? Colors.error : isFocused ? Colors.primary : Colors.textSecondary}
            style={[styles.leftIcon, multiline && styles.multilineLeftIcon]}
          />
        )}
        <TextInput
          multiline={multiline}
          style={[styles.input, multiline && styles.multilineInput, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 6,
    paddingLeft: 2,
  },
  focusedLabel: {
    color: Colors.primary,
  },
  errorLabel: {
    color: Colors.error,
  },
  inputContainer: {
    height: 52,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  multilineInputContainer: {
    height: 'auto',
    minHeight: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  focusedInputContainer: {
    borderColor: Colors.primary,
  },
  errorInputContainer: {
    borderColor: Colors.error,
  },
  leftIcon: {
    marginRight: 10,
  },
  multilineLeftIcon: {
    marginTop: Platform.OS === 'ios' ? 2 : 4,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: Typography.sizes.base,
  },
  multilineInput: {
    height: 'auto',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rightIcon: {
    padding: 6,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.xs,
    marginTop: 6,
    paddingLeft: 2,
  },
});

export default AppInput;
