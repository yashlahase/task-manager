import React, { createContext, useState, useCallback, ReactNode, useRef } from 'react';
import { StyleSheet, Text, Animated, View, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [visible, setVisible] = useState(false);
  
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [fadeAnim, slideAnim]);

  const showToast = useCallback((msg: string, toastType: ToastType = 'success') => {
    // Clear any active timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setMessage(msg);
    setType(toastType);
    setVisible(true);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 3 seconds
    timerRef.current = setTimeout(() => {
      hideToast();
    }, 3000);
  }, [fadeAnim, slideAnim, hideToast]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: Colors.status.Completed,
          icon: 'checkmark-circle-outline' as const,
        };
      case 'error':
        return {
          backgroundColor: Colors.priority.High,
          icon: 'alert-circle-outline' as const,
        };
      case 'info':
        return {
          backgroundColor: Colors.primary,
          icon: 'information-circle-outline' as const,
        };
    }
  };

  const config = getToastStyle();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              top: insets.top > 0 ? insets.top + 8 : 16,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.toast, { backgroundColor: config.backgroundColor }]}>
            <Ionicons name={config.icon} size={20} color={Colors.white} style={styles.icon} />
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999,
    paddingHorizontal: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 40,
    maxWidth: 400,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    flex: 1,
    lineHeight: 18,
  },
});
