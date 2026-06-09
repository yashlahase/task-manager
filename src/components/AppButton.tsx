import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const base: ViewStyle[] = [styles.button];
    if (disabled || isLoading) {
      base.push(styles.disabled);
    } else {
      switch (variant) {
        case 'primary':
          base.push(styles.primary);
          break;
        case 'outline':
          base.push(styles.outline);
          break;
        case 'danger':
          base.push(styles.danger);
          break;
        case 'text':
          base.push(styles.textVariant);
          break;
      }
    }
    if (style) {
      base.push(style);
    }
    return base;
  };

  const getTextStyles = () => {
    const base: TextStyle[] = [styles.buttonText];
    if (disabled) {
      base.push(styles.disabledText);
    } else {
      switch (variant) {
        case 'primary':
          base.push(styles.primaryText);
          break;
        case 'outline':
          base.push(styles.outlineText);
          break;
        case 'danger':
          base.push(styles.dangerText);
          break;
        case 'text':
          base.push(styles.textVariantText);
          break;
      }
    }
    if (textStyle) {
      base.push(textStyle);
    }
    return base;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={getButtonStyles()}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === 'outline' || variant === 'text' ? Colors.primary : Colors.white} />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    width: '100%',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.priority.High,
    ...Shadows.md,
  },
  textVariant: {
    backgroundColor: Colors.transparent,
    height: 'auto',
    paddingHorizontal: 0,
    width: 'auto',
    marginVertical: 4,
  },
  disabled: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
  buttonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  primaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
  textVariantText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textMuted,
  },
});

export default AppButton;
