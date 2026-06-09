import { useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    refreshTasks
  } = context;

  // Perform search, filter, and sort calculations inside useMemo for optimal performance
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Search filter: search by title
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(task => task.title.toLowerCase().includes(query));
    }

    // 2. Status filter: Pending / Completed
    if (statusFilter !== 'All') {
      result = result.filter(task => task.status === statusFilter);
    }

    // 3. Priority filter: High / Medium / Low
    if (priorityFilter !== 'All') {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // 4. Sort filter: Due Date Ascending / Due Date Descending
    result.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      if (sortBy === 'DueDateAsc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  return {
    // Return processed tasks as primary collection for rendering
    tasks: filteredAndSortedTasks,
    allTasks: tasks, // Expose raw list for stats calculation
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    refreshTasks
  };
};

export default useTasks;
