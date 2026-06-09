import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Colors, Typography } from '../constants/colors';

interface LoadingIndicatorProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  fullscreen = true
}) => {
  if (!fullscreen) {
    return (
      <View style={styles.inlineContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {message ? <Text style={styles.inlineText}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.fullscreenContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.fullscreenText}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  fullscreenText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginTop: 12,
  },
  inlineContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginTop: 8,
  },
});

export default LoadingIndicator;
