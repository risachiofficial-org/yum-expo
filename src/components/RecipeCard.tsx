import type React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeCardProps {
  imageUrl: string;
  title: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  category: string;
  isVegetarian?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Adjust spacing as needed

const RecipeCard: React.FC<RecipeCardProps> = ({
  imageUrl,
  title,
  cookTime,
  prepTime,
  servings,
  category,
  isVegetarian,
}) => {
  return (
    <View 
      className="bg-white rounded-xl m-2 shadow-sm"
      style={{ width: cardWidth }}
    >
      <Image 
        source={{ uri: imageUrl }} 
        className="w-full rounded-t-xl"
        style={{ height: cardWidth * 0.8 }}
      />
      <View className="absolute top-2 right-2 bg-black/30 rounded-full p-1">
        <Ionicons name="heart-outline" size={24} color="white" />
      </View>
      <View className="p-3">
        <View className="flex-row items-center mb-1">
          {isVegetarian !== undefined && (
            <View
              className={`w-2 h-2 rounded-full mr-1.5 ${
                isVegetarian ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          )}
          <Text className="text-xs text-gray-600">{category}</Text>
        </View>
        <Text className="text-base font-bold text-gray-800 mb-2 leading-5" numberOfLines={2} style={{ minHeight: 40 }}>
          {title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text className="text-xs text-gray-600 ml-1">{cookTime}</Text>
          <Ionicons name="timer-outline" size={16} color="#666" style={{ marginLeft: 8 }} />
          <Text className="text-xs text-gray-600 ml-1">{prepTime}</Text>
          <Ionicons name="people-outline" size={16} color="#666" style={{ marginLeft: 8 }} />
          <Text className="text-xs text-gray-600 ml-1">{servings}</Text>
        </View>
      </View>
    </View>
  );
};

export default RecipeCard; 