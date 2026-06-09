import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '../constants/colors';

interface FilterBarProps {
  statusFilter: 'All' | 'Pending' | 'Completed';
  onStatusChange: (status: 'All' | 'Pending' | 'Completed') => void;
  priorityFilter: 'All' | 'High' | 'Medium' | 'Low';
  onPriorityChange: (priority: 'All' | 'High' | 'Medium' | 'Low') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
}) => {
  const statusOptions: ('All' | 'Pending' | 'Completed')[] = ['All', 'Pending', 'Completed'];
  const priorityOptions: ('All' | 'High' | 'Medium' | 'Low')[] = ['All', 'High', 'Medium', 'Low'];

  return (
    <View style={styles.container}>
      {/* Status Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {statusOptions.map(option => {
          const isSelected = statusFilter === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onStatusChange(option)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isSelected && styles.selectedChip,
                !isSelected && { borderColor: Colors.border }
              ]}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {option === 'All' ? 'All Status' : option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Priority Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, { marginTop: 8 }]}
      >
        {priorityOptions.map(option => {
          const isSelected = priorityFilter === option;
          let activeBorderColor = Colors.border;
          
          if (!isSelected && option !== 'All') {
            activeBorderColor = `${Colors.priority[option]}50`;
          }

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onPriorityChange(option)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isSelected && styles.selectedChip,
                isSelected && option !== 'All' && { backgroundColor: Colors.priority[option] },
                !isSelected && { borderColor: activeBorderColor }
              ]}
            >
              {option !== 'All' && (
                <View
                  style={[
                    styles.chipDot,
                    {
                      backgroundColor: isSelected
                        ? Colors.white
                        : Colors.priority[option]
                    }
                  ]}
                />
              )}
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {option === 'All' ? 'All Priority' : `${option} Priority`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  row: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.transparent,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  selectedChipText: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
});

export default FilterBar;
