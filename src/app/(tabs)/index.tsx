import type React from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import RecipeCard from '../../components/RecipeCard'; // Assuming RecipeCard is in src/components
import { Ionicons } from '@expo/vector-icons'; // For Create button icon
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mockRecipes = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Recipe1',
    title: 'Menthia (Methi) Bhat',
    cookTime: '60 mins',
    prepTime: '1h 3m',
    servings: '1-4',
    category: 'Karnataka',
    isVegetarian: true,
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/150/00BCD4/FFFFFF?Text=Recipe2',
    title: 'Chicken Seekh Biryani',
    cookTime: '60 mins',
    prepTime: '56 mins',
    servings: '1-3',
    category: 'Indian · Mug...',
    isVegetarian: false,
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/150/8BC34A/FFFFFF?Text=Recipe3',
    title: 'Aloo Gobi Adrak',
    cookTime: '45 mins',
    prepTime: '20 mins',
    servings: '2-3',
    category: 'Punjabi',
    isVegetarian: true,
  },
  {
    id: '4',
    imageUrl: 'https://via.placeholder.com/150/E91E63/FFFFFF?Text=Recipe4',
    title: 'Creamy Tomato Pasta',
    cookTime: '25 mins',
    prepTime: '10 mins',
    servings: '2',
    category: 'Italian',
    isVegetarian: true,
  },
];

const HomeScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();

  const renderRecipeItem = ({ item }: { item: (typeof mockRecipes)[0] }) => (
    <RecipeCard
      imageUrl={item.imageUrl}
      title={item.title}
      cookTime={item.cookTime}
      prepTime={item.prepTime}
      servings={item.servings}
      category={item.category}
      isVegetarian={item.isVegetarian}
    />
  );

  return (
    <ScrollView className="flex-1 bg-gray-50" style={{ paddingTop: top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-800">Good Morning</Text>
          <Text className="text-sm text-gray-500">What are you cooking today?</Text>
        </View>
        <TouchableOpacity className="bg-purple-600 p-3 rounded-lg flex-row items-center">
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-1">Create</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Section */}
      <View className="px-4 mt-4 mb-6">
        <View className="bg-purple-700 rounded-xl p-6 flex-row items-center justify-between shadow-md">
          <View className="flex-1">
            <Text className="text-xs text-purple-200 bg-white/20 px-2 py-1 rounded-full self-start mb-1">
              Delicacies from the South
            </Text>
            <Text className="text-2xl font-bold text-white">South Indian Delights</Text>
            <TouchableOpacity className="mt-2 flex-row items-center">
              <Text className="text-purple-100 font-medium">Browse Recipes!</Text>
              <Ionicons name="arrow-forward" size={16} color="#E9D5FF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100/FFC107/000000?Text=Food' }} 
            className="w-24 h-24 rounded-lg ml-4"
          />
        </View>
        {/* Dots for carousel (simple placeholder) */}
        <View className="flex-row justify-center mt-3">
            <View className="w-2 h-2 bg-gray-700 rounded-full mx-1" />
            <View className="w-2 h-2 bg-gray-300 rounded-full mx-1" />
        </View>
      </View>
      

      {/* Recently Added Section */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-800">Recently Added</Text>
          <TouchableOpacity>
            <Text className="text-sm text-orange-500 font-semibold">See all &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockRecipes.slice(0, 2)} // Show first 2 for recently added
          renderItem={renderRecipeItem}
          keyExtractor={(item) => `${item.id}-recent`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }} // To avoid card cutoff
        />
      </View>

      {/* All Time Favourites Section */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-800">All Time Favourites</Text>
          <TouchableOpacity>
            <Text className="text-sm text-orange-500 font-semibold">See all &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockRecipes.slice(2, 4)} // Show next 2 for all time favourites
          renderItem={renderRecipeItem}
          keyExtractor={(item) => `${item.id}-favourites`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }} // To avoid card cutoff
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen; 