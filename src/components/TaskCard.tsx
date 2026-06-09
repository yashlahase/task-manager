import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { Colors, Typography, Shadows } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AppConfirmModal from './AppConfirmModal';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const isCompleted = task.status === 'Completed';
  const priorityColor = Colors.priority[task.priority];
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Helper to format due date and detect if overdue
  const getDueDateStatus = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dueStr = task.dueDate;
    
    if (dueStr === todayStr) {
      return { text: 'Today ⏰', isOverdue: false };
    }

    const todayDate = new Date(todayStr).getTime();
    const dueDate = new Date(dueStr).getTime();

    if (dueDate < todayDate && !isCompleted) {
      return { text: `${dueStr} (Overdue) ⚠️`, isOverdue: true };
    }

    return { text: dueStr, isOverdue: false };
  };

  const { text: dueDateText, isOverdue } = getDueDateStatus();

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    onDelete(task.id);
  };

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <AppConfirmModal
        visible={isDeleteModalVisible}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
      {/* Checkbox Trigger */}
      <TouchableOpacity
        onPress={() => onToggleStatus(task.id)}
        activeOpacity={0.7}
        style={styles.checkboxContainer}
      >
        <View
          style={[
            styles.checkbox,
            isCompleted && styles.checkboxChecked,
            !isCompleted && { borderColor: Colors.border }
          ]}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color={Colors.white} />}
        </View>
      </TouchableOpacity>

      {/* Task Details */}
      <View style={styles.detailsContainer}>
        <Text
          style={[
            styles.title,
            isCompleted && styles.completedTitle,
            isCompleted && { color: Colors.textMuted }
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <Text
          style={[
            styles.description,
            isCompleted && styles.completedDescription
          ]}
          numberOfLines={2}
        >
          {task.description}
        </Text>

        <View style={styles.metaContainer}>
          {/* Priority Badge */}
          <View style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: priorityColor }]} />
            <Text style={styles.badgeText}>
              {task.priority}
            </Text>
          </View>

          {/* Due Date */}
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={isOverdue ? Colors.error : Colors.textSecondary}
              style={styles.dateIcon}
            />
            <Text
              style={[
                styles.dateText,
                isOverdue && styles.overdueText,
                isCompleted && { color: Colors.textMuted }
              ]}
            >
              {dueDateText}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => onEdit(task.id)}
          activeOpacity={0.7}
          style={styles.actionButton}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeletePress}
          activeOpacity={0.7}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.priority.High} />
        </TouchableOpacity>
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
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  completedCard: {
    borderColor: `${Colors.border}50`,
    opacity: 0.75,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.status.Completed,
    borderColor: Colors.status.Completed,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  completedDescription: {
    color: Colors.textMuted,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  overdueText: {
    color: Colors.error,
    fontWeight: Typography.weights.semibold,
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    height: 64,
  },
  actionButton: {
    padding: 6,
  },
});

export default TaskCard;
