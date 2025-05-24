import type React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface RecipeCardProps {
  id: string;
  imageUrl: string;
  title: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  category: string;
  isVegetarian?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  imageUrl,
  title,
  cookTime,
  prepTime,
  servings,
  category,
  isVegetarian,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/recipe/${id}`);
  };

  const displayImageUrl = imageUrl && !imageUrl.includes('via.placeholder.com') 
    ? imageUrl 
    : 'https://fwcsgvyqmolgmbupulmv.supabase.co/storage/v1/object/public/common/recipe_placeholder.png';

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      className={`bg-white rounded-xl shadow-md overflow-hidden w-64 mr-4 mb-4 ${Platform.OS === 'android' ? 'elevation-5' : ''}`}>
      <Image 
        source={{ uri: displayImageUrl }} 
        className="w-full h-36" 
        resizeMode="cover" 
      />
      <View className="p-3">
        <Text className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">{category}</Text>
        <Text className="text-lg font-bold text-gray-800 mb-1 truncate" numberOfLines={1}>{title}</Text>
        
        <View className="flex-row items-center text-gray-600 mb-2">
          <Ionicons name="time-outline" size={14} color="#4B5563" />
          <Text className="ml-1 text-xs">{prepTime} prep</Text>
          <Ionicons name="flame-outline" size={14} color="#4B5563" style={{ marginLeft: 8 }} />
          <Text className="ml-1 text-xs">{cookTime}</Text>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          <View className="flex-row items-center">
            <Ionicons name="restaurant-outline" size={14} color="#4B5563" />
            <Text className="ml-1 text-xs text-gray-600">{servings} servings</Text>
          </View>
          {isVegetarian !== undefined && (
            <View 
              className={`px-2 py-0.5 rounded-full ${isVegetarian ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-medium ${isVegetarian ? 'text-green-700' : 'text-red-700'}`}>
                {isVegetarian ? 'VEG' : 'NON-VEG'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard; 