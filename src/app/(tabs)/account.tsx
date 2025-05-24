import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AccountScreen = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1 justify-center items-center bg-white" style={{ paddingTop: top }}>
      <Text className="text-xl font-bold">Account Screen</Text>
      <Text className="mt-2 text-gray-600">This is a placeholder for the account page.</Text>
    </View>
  );
};

export default AccountScreen; 