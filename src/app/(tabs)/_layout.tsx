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
        tabBarActiveTintColor: colorScheme === 'dark' ? '#FF6347' : '#FF6347', // Tomato Red for active tint
        tabBarInactiveTintColor: '#A0AEC0', // Cool Gray 400 for inactive tint
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF', // Dark Gray 800 or White
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB', // Dark Gray 700 or Gray 200
          height: Platform.OS === 'ios' ? 85 : 65, // Slightly adjusted height
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: Platform.OS === 'ios' ? 10 : 5, // Added paddingTop for better spacing
        },
        tabBarLabelStyle: {
          fontSize: 11, // Slightly increased font size
          fontWeight: '600', // Semi-bold for better readability
          marginTop: Platform.OS === 'ios' ? -2 : -4, // Fine-tuned margin
        },
        headerShown: Platform.OS !== 'web', // Keep headerShown logic
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF', // Match tab bar bg
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#1F2937', // Contrast with header bg
      }}
    >
      <Tabs.Screen
        name="index" // This refers to src/app/(tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <FontAwesome name="home" size={focused ? 30 : 28} style={{ marginBottom: -3 }} color={color} />,
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
          tabBarIcon: ({ color, focused }) => <FontAwesome name="search" size={focused ? 30 : 28} style={{ marginBottom: -3 }} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account" // This refers to src/app/(tabs)/account.tsx
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={focused ? 30: 28} color={color} style={{ marginBottom: -3 }} />
          ),
        }}
      />
    </Tabs>
  );
}
