import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const getTasksKey = (email: string) => `@TaskFlow:tasks:${email.toLowerCase().trim()}`;

export const taskStorage = {
  async saveTasks(email: string, tasks: Task[]): Promise<boolean> {
    try {
      const key = getTasksKey(email);
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error saving tasks for ${email} to AsyncStorage:`, error);
      return false;
    }
  },

  async getTasks(email: string): Promise<Task[] | null> {
    try {
      const key = getTasksKey(email);
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving tasks for ${email} from AsyncStorage:`, error);
      return null;
    }
  },

  async clearTasks(email: string): Promise<boolean> {
    try {
      const key = getTasksKey(email);
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error clearing tasks for ${email} from AsyncStorage:`, error);
      return false;
    }
  }
};
