import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
    
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explorer',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="compass" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="stakes"
        options={{
          title: 'Stakes',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
} 