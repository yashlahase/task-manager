import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  iconName,
  iconColor,
  subtitle,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    width: '48%', // Responsive grid layout with space-between
    ...Shadows.sm,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  body: {
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});

export default StatCard;
