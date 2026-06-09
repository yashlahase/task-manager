export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string; // ISO string or YYYY-MM-DD
  status: 'Pending' | 'Completed';
  createdAt: string; // ISO string
}

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Statistics: undefined;
};
