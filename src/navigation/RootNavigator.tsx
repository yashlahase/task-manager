import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import LoadingIndicator from '../components/LoadingIndicator';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingIndicator message="Initializing TaskFlow..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background }
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Authenticated Stack
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="AddTask"
            component={AddEditTaskScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="EditTask"
            component={AddEditTaskScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
