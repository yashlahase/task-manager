import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task } from '../types';
import { taskStorage } from '../storage/taskStorage';
import { useAuth } from '../hooks/useAuth';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (title: string, description: string, priority: Task['priority'], dueDate: string) => Promise<void>;
  updateTask: (id: string, updatedFields: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'All' | 'Pending' | 'Completed';
  setStatusFilter: (filter: 'All' | 'Pending' | 'Completed') => void;
  priorityFilter: 'All' | 'High' | 'Medium' | 'Low';
  setPriorityFilter: (filter: 'All' | 'High' | 'Medium' | 'Low') => void;
  sortBy: 'DueDateAsc' | 'DueDateDesc';
  setSortBy: (sort: 'DueDateAsc' | 'DueDateDesc') => void;
  refreshTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Welcome to TaskFlow! 🚀',
    description: 'This is a sample task. You can complete tasks by checking the bubble, or edit/delete them by tapping the options on the card.',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: 'Explore the Statistics Tab 📊',
    description: 'Go to the Statistics screen from the bottom navigation bar to view your completion progress and priority breakdown.',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    title: 'Create Your First Custom Task ✍️',
    description: 'Tap the "+" button at the top right of the dashboard screen to design your own tasks, pick priorities and due dates.',
    priority: 'Low',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    status: 'Completed',
    createdAt: new Date().toISOString()
  }
];

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [sortBy, setSortBy] = useState<'DueDateAsc' | 'DueDateDesc'>('DueDateAsc');

  const { userEmail, isAuthenticated } = useAuth();

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !userEmail) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const storedTasks = await taskStorage.getTasks(userEmail);
      if (storedTasks === null) {
        // First launch for this user: populate default sample tasks
        await taskStorage.saveTasks(userEmail, SAMPLE_TASKS);
        setTasks(SAMPLE_TASKS);
      } else {
        setTasks(storedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks from local storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, isAuthenticated]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const refreshTasks = async () => {
    await loadTasks();
  };

  const createTask = useCallback(async (
    title: string,
    description: string,
    priority: Task['priority'],
    dueDate: string
  ) => {
    if (!userEmail) return;

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setTasks(prevTasks => {
      const updated = [newTask, ...prevTasks];
      taskStorage.saveTasks(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  const updateTask = useCallback(async (
    id: string,
    updatedFields: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => {
    if (!userEmail) return;

    setTasks(prevTasks => {
      const updated = prevTasks.map(task =>
        task.id === id ? { ...task, ...updatedFields } : task
      );
      taskStorage.saveTasks(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  const deleteTask = useCallback(async (id: string) => {
    if (!userEmail) return;

    setTasks(prevTasks => {
      const updated = prevTasks.filter(task => task.id !== id);
      taskStorage.saveTasks(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    if (!userEmail) return;

    setTasks(prevTasks => {
      const updated = prevTasks.map(task =>
        task.id === id
          ? { ...task, status: (task.status === 'Pending' ? 'Completed' : 'Pending') as 'Pending' | 'Completed' }
          : task
      );
      taskStorage.saveTasks(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  return (
    <TaskContext.Provider
      value={{
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
