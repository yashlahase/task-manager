import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Shadows } from '../constants/colors';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingIndicator from '../components/LoadingIndicator';
import { Ionicons } from '@expo/vector-icons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { userEmail, logout } = useAuth();
  const {
    tasks,
    isLoading,
    toggleTaskStatus,
    deleteTask,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    refreshTasks
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshTasks();
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTasks]);

  // Navigate to Add task
  const handleAddTaskPress = useCallback(() => {
    navigation.navigate('AddTask');
  }, [navigation]);

  // Navigate to Edit task
  const handleEditTaskPress = useCallback((taskId: string) => {
    navigation.navigate('EditTask', { taskId });
  }, [navigation]);

  // Performance optimized key extractor
  const keyExtractor = useCallback((item: Task) => item.id, []);

  // Performance optimized render item function
  const renderItem = useCallback(({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onToggleStatus={toggleTaskStatus}
      onEdit={handleEditTaskPress}
      onDelete={deleteTask}
    />
  ), [toggleTaskStatus, handleEditTaskPress, deleteTask]);

  const handleEmptyActionPress = () => {
    // Reset filters first to see if tasks show up, else open create screen
    if ((searchQuery.trim().length >= 2) || statusFilter !== 'All' || priorityFilter !== 'All') {
      setSearchQuery('');
      setStatusFilter('All');
      setPriorityFilter('All');
    } else {
      navigation.navigate('AddTask');
    }
  };

  const getEmptyStateDetails = () => {
    if ((searchQuery.trim().length >= 2) || statusFilter !== 'All' || priorityFilter !== 'All') {
      return {
        title: 'No Matching Tasks 🔍',
        description: 'Try adjusting your search query or filter chips to find what you are looking for.',
        actionTitle: 'Clear Filters'
      };
    }
    return {
      title: 'Your Dashboard is Empty 📝',
      description: 'You have completed all your tasks or haven\'t created any yet. Start by creating a new task now!',
      actionTitle: 'Create a Task'
    };
  };

  const emptyDetails = getEmptyStateDetails();

  const displayUserEmail = userEmail ? userEmail.split('@')[0] : 'User';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>TaskFlow</Text>
          <Text style={styles.subtitleText}>Here is your progress overview</Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.7}
          style={styles.logoutButton}
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.priority.High} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Filter Bar */}
      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Task List */}
      <View style={styles.listContainer}>
        {isLoading && !refreshing ? (
          <LoadingIndicator message="Fetching tasks..." />
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.cardBg}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title={emptyDetails.title}
                description={emptyDetails.description}
                actionTitle={emptyDetails.actionTitle}
                onActionPress={handleEmptyActionPress}
              />
            }
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTaskPress}
        activeOpacity={0.85}
        accessibilityLabel="Create task"
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  subtitleText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90, // Leave room for FAB
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    zIndex: 99,
  },
});

export default DashboardScreen;
