import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { ToastProvider } from './src/context/ToastContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <TaskProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </TaskProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
