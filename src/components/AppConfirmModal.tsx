import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Shadows } from '../constants/colors';

interface AppConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  subMessage?: string; // Optional warning like "This action cannot be undone."
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export const AppConfirmModal: React.FC<AppConfirmModalProps> = ({
  visible,
  title,
  message,
  subMessage,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
}) => {
  const [showModal, setShowModal] = useState(visible);
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      // Fade in backdrop and scale up card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out backdrop and scale down card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  const isDanger = confirmVariant === 'danger';
  const iconName = isDanger ? 'trash-outline' : 'checkmark-circle-outline';
  const iconColor = isDanger ? '#EF4444' : Colors.primary;
  const iconBg = isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(91, 110, 245, 0.1)';

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[
              styles.modalCard, 
              { 
                transform: [{ scale: scaleAnim }],
                // Keep the opacity matching the scale
                opacity: fadeAnim 
              }
            ]}>
              {/* Top Icon Circle */}
              <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                <Ionicons name={iconName} size={30} color={iconColor} />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={[styles.message, !subMessage && { marginBottom: 24 }]}>{message}</Text>

              {/* Sub Message (Warning Callout) */}
              {subMessage ? (
                <Text style={styles.subMessage}>{subMessage}</Text>
              ) : null}

              {/* Buttons Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.confirmButton, 
                    { backgroundColor: isDanger ? '#EF4444' : Colors.primary }
                  ]} 
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Dimmed backdrop with Slate-toned overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF', // Clean white background
    borderRadius: 20, // Rounded corners (20px)
    padding: 24,
    alignItems: 'center', // Center aligned content
    ...Shadows.lg, // Soft shadow
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: Typography.sizes.base - 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
  subMessage: {
    fontSize: Typography.sizes.sm - 1,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9', // Light gray background
    borderRadius: 12, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#1E293B', // Dark text
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  confirmButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF', // White text
  },
});

export default AppConfirmModal;
