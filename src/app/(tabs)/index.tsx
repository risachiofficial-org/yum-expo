import type React from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import RecipeCard from '../../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { recipes as allRecipes } from '../../mocks/recieps'; // Import from mocks

// Define a type for a single recipe based on your mock data structure
interface Recipe {
  id: string;
  imageUrl: string; // This will now be the full Supabase URL from recieps.ts
  title: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  category: string;
  isVegetarian?: boolean;
}

// The featured image URL - replace with your actual Supabase URL for the featured image
const featuredImageUrl = 'https://fwcsgvyqmolgmbupulmv.supabase.co/storage/v1/object/public/common/recipe/WhatsApp%20Image%202025-05-24%20at%2012.47.30%20(1).jpeg'; 

const HomeScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();

  // Ensure the item type matches the structure in allRecipes
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      id={item.id}
      imageUrl={item.imageUrl} // This will use the Supabase URL directly
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
        {/* Create button removed */}
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
            source={{ uri: featuredImageUrl }} 
            className="w-24 h-24 rounded-lg ml-4"
          />
        </View>
        {/* Dots for carousel (simple placeholder) */}
        <View className="flex-row justify-center mt-3">
            <View className="w-2 h-2 bg-gray-700 rounded-full mx-1" />
            <View className="w-2 h-2 bg-gray-300 rounded-full mx-1" />
        </View>
      </View>
      

      {/* Recently Added Section - Show first 10 */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-800">Recently Added</Text>
          <TouchableOpacity>
            <Text className="text-sm text-orange-500 font-semibold">See all &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={allRecipes.slice(0, 10)} // Use allRecipes directly
          renderItem={renderRecipeItem}
          keyExtractor={(item) => `${item.id}-recent`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }} 
        />
      </View>

      {/* All Time Favourites Section - Show next 10 */}
      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-800">All Time Favourites</Text>
          <TouchableOpacity>
            <Text className="text-sm text-orange-500 font-semibold">See all &gt;</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={allRecipes.slice(10, 20)} // Use allRecipes directly
          renderItem={renderRecipeItem}
          keyExtractor={(item) => `${item.id}-favourites`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen; 