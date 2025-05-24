import type React from 'react'; // Use import type for React
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import RecipeCard from '../../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { recipes as allRecipes } from '../../mocks/recieps'; // Remove mock import
import { supabase } from '../../lib/supabase'; // Import Supabase client

// Define a type for a single recipe based on your mock data structure
// This should match the structure of the objects stored in the 'data' column of your YUM_recipes table
interface Recipe {
  id: string;
  imageUrl: string;
  title: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  category: string;
  isVegetarian?: boolean;
  // Add any other fields you expect from the 'data' column
  // For example, if your 'data' column also contains nutrition, allergens, ingredients, instructions
  nutrition?: { kcal: string; protein: string; fats: string; carbs: string; };
  allergens?: string[];
  ingredients?: Array<{ name: string; quantity: string; unit: string; imageUrl?: string }>;
  instructions?: string[];
}

// Type for the raw data fetched from Supabase (data column + db id)
interface FetchedRecipeDataItem {
  id: number; // Supabase returns id as number from serial
  data: Omit<Recipe, 'id'>; // The 'data' column contains the rest of the Recipe fields
}

// The featured image URL - replace with your actual Supabase URL for the featured image
const featuredImageUrl = 'https://fwcsgvyqmolgmbupulmv.supabase.co/storage/v1/object/public/common/recipe/WhatsApp%20Image%202025-05-24%20at%2012.47.30%20(1).jpeg'; 

const HomeScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: fetchedRecipesData, error: fetchError } = await supabase
          .from('YUM_recipes')
          .select('id, data') // Select id for key and data for recipe content
          .returns<FetchedRecipeDataItem[]>(); // Specify return type for better type safety

        if (fetchError) {
          throw fetchError;
        }

        if (fetchedRecipesData) {
          const formattedRecipes: Recipe[] = fetchedRecipesData.map((item) => ({
            ...item.data, // Spread the contents of the data object
            id: item.id.toString(), // Ensure id is a string for keys
          })); 
          setRecipes(formattedRecipes);
        } else {
          setRecipes([]);
        }
      } catch (e: unknown) { // Use unknown for safer error handling
        console.error('Failed to fetch recipes:', e);
        if (e instanceof Error) {
          setError(e.message || 'Failed to load recipes. Please try again later.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      id={item.id}
      imageUrl={item.imageUrl}
      title={item.title}
      cookTime={item.cookTime}
      prepTime={item.prepTime}
      servings={item.servings}
      category={item.category}
      isVegetarian={item.isVegetarian}
    />
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50" style={{ paddingTop: top }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="mt-2 text-gray-600">Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4" style={{ paddingTop: top }}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text className="mt-2 text-lg text-red-600 text-center">Oops! Something went wrong.</Text>
        <Text className="mt-1 text-sm text-gray-500 text-center">{error}</Text>
        {/* You could add a retry button here */}
      </View>
    );
  }

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
          data={recipes.slice(0, 10)} // Use fetched recipes
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
          data={recipes.slice(10, 20)} // Use fetched recipes
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