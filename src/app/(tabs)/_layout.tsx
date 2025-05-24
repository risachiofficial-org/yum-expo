import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#ff0000' : '#ff0000',
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
        headerShown: Platform.OS !== 'web',
      }}
    >
      <Tabs.Screen
        name="index" // This refers to src/app/(tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} style={{ marginBottom: -3 }} color={color} />,
          headerShown: false,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={colorScheme === 'dark' ? '#fff' : '#000'}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={28} style={{ marginBottom: -3 }} color={color} />,
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
