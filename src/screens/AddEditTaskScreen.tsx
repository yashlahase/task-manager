import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { Colors, Typography } from '../constants/colors';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask' | 'EditTask'>;

type PriorityType = Task['priority'];

export const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { createTask, updateTask, allTasks } = useTasks();
  const { showToast } = useToast();
  
  // Detect Mode
  const isEditMode = route.name === 'EditTask';
  const taskId = isEditMode && route.params && 'taskId' in route.params
    ? (route.params as { taskId: string }).taskId
    : null;
  const existingTask = isEditMode ? allTasks.find(t => t.id === taskId) : null;

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityType>('Medium');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  
  // Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  // Validation States
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setPriority(existingTask.priority);
      // parse YYYY-MM-DD back to Date object safely
      const parts = existingTask.dueDate.split('-');
      if (parts.length === 3) {
        const parsedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        setDueDate(parsedDate);
      }
    }
  }, [isEditMode, existingTask]);

  // Form Validations
  const validateTitle = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return 'Task title is required';
    }
    if (trimmed.length < 2) {
      return 'Task title must be at least 2 characters';
    }
    return '';
  };

  const validateDescription = (text: string) => {
    return '';
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (hasSubmitted) {
      setTitleError(validateTitle(text));
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (hasSubmitted) {
      setDescriptionError(validateDescription(text));
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // For Android, we close the picker after choice
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDueDate(selectedDate);
      if (hasSubmitted) {
        setDueDateError('');
      }
    }
  };

  const selectPriority = (val: PriorityType) => {
    setPriority(val);
    setShowPriorityDropdown(false);
  };

  const handleSave = async () => {
    setHasSubmitted(true);
    
    const titleValError = validateTitle(title);
    const descValError = validateDescription(description);
    
    setTitleError(titleValError);
    setDescriptionError(descValError);

    if (titleValError || descValError) {
      return;
    }

    const formattedDate = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    try {
      if (isEditMode && taskId) {
        await updateTask(taskId, {
          title,
          description,
          priority,
          dueDate: formattedDate,
        });
        showToast('Task updated successfully!', 'success');
      } else {
        await createTask(title, description, priority, formattedDate);
        showToast('Task created successfully!', 'success');
      }
      navigation.goBack();
    } catch (error) {
      showToast('Failed to save task. Please try again.', 'error');
    }
  };

  const formattedDateString = dueDate.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const priorityOptions: PriorityType[] = ['High', 'Medium', 'Low'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Task' : 'Create Task'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Form Fields */}
          <AppInput
            label="Task Title"
            placeholder="Enter task title"
            value={title}
            onChangeText={handleTitleChange}
            error={titleError}
            iconName="create-outline"
            maxLength={60}
          />

          <AppInput
            label="Description (Optional)"
            placeholder="Enter detailed description"
            value={description}
            onChangeText={handleDescriptionChange}
            error={descriptionError}
            iconName="document-text-outline"
            multiline={true}
            numberOfLines={4}
            style={styles.descriptionInput}
          />

          {/* Custom Priority Dropdown */}
          <Text style={styles.fieldLabel}>Task Priority</Text>
          <TouchableOpacity
            style={styles.dropdownSelector}
            onPress={() => setShowPriorityDropdown(true)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownLeft}>
              <View style={[styles.priorityIndicator, { backgroundColor: Colors.priority[priority] }]} />
              <Text style={styles.dropdownText}>{priority} Priority</Text>
            </View>
            <Ionicons name="chevron-down-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Due Date Picker Button */}
          <Text style={styles.fieldLabel}>Due Date</Text>
          <TouchableOpacity
            style={styles.dropdownSelector}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownLeft}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={styles.dateIcon} />
              <Text style={styles.dropdownText}>{formattedDateString}</Text>
            </View>
            <Ionicons name="calendar-clear-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          {dueDateError ? <Text style={styles.errorText}>{dueDateError}</Text> : null}

          {/* Inline calendar view on iOS only inside a toggle, or directly as overlay modal */}
          {Platform.OS === 'ios' && showDatePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDatePicker(false)}
              >
                <View style={styles.iosDatePickerContainer}>
                  <View style={styles.iosDatePickerHeader}>
                    <Text style={styles.iosDatePickerTitle}>Select Due Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.iosDatePickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="inline"
                    onChange={handleDateChange}
                    themeVariant="dark"
                    minimumDate={new Date()}
                    style={styles.iosPicker}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          {/* Native Android picker directly runs in background */}
          {Platform.OS === 'android' && showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Priority Options Bottom Sheet / Modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={showPriorityDropdown}
            onRequestClose={() => setShowPriorityDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowPriorityDropdown(false)}
            >
              <View style={styles.dropdownSheet}>
                <Text style={styles.sheetTitle}>Select Priority</Text>
                
                {priorityOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.sheetOption,
                      priority === option && styles.selectedOption
                    ]}
                    activeOpacity={0.7}
                    onPress={() => selectPriority(option)}
                  >
                    <View style={styles.sheetOptionLeft}>
                      <View style={[styles.priorityIndicator, { backgroundColor: Colors.priority[option] }]} />
                      <Text style={styles.sheetOptionText}>{option}</Text>
                    </View>
                    {priority === option && (
                      <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.saveSpacer} />

          <AppButton
            title={isEditMode ? 'Save Changes' : 'Create Task'}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 8,
  },
  backButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  headerSpacer: {
    width: 38,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 6,
    paddingLeft: 2,
    marginTop: 12,
  },
  dropdownSelector: {
    height: 52,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  dropdownText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  dateIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  dropdownSheet: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sheetTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBg,
  },
  sheetOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetOptionText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  iosDatePickerContainer: {
    backgroundColor: Colors.cardBg,
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iosDatePickerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  iosDatePickerDone: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  iosPicker: {
    marginTop: 16,
  },
  saveSpacer: {
    height: 16,
  },
  saveButton: {
    marginTop: 12,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.xs,
    marginTop: -8,
    marginBottom: 12,
    paddingLeft: 2,
  },
});

export default AddEditTaskScreen;
