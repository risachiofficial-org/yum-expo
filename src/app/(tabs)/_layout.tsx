import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8B5CF6', // Purple-500
        tabBarInactiveTintColor: '#6B7280', // Gray-500
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1, // No top border on iOS, subtle on Android
          borderTopColor: '#E5E7EB', // Gray-200
          height: Platform.OS === 'ios' ? 90 : 60, // Adjust height for different platforms
          paddingBottom: Platform.OS === 'ios' ? 30 : 5, // Padding for safe area on iOS
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: -5, // Adjust label position
        },
        headerShown: false, // We handle headers in individual screens
      }}
    >
      <Tabs.Screen
        name="index" // This refers to src/app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account" // This refers to src/app/(tabs)/account.tsx
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
