import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { recipes as allRecipes } from '../../mocks/recieps'; // Assuming mocks are accessible
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  // Optional fields based on what's available in mock data or future API
  nutrition?: {
    kcal: string;
    protein: string;
    fats: string;
    carbs: string;
  };
  allergens?: string[];
  ingredients?: Array<{
    name: string;
    quantity: string;
    unit?: string;
    imageUrl?: string; // Optional image for ingredients
  }>;
  instructions?: string[];
}

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();

  // Find the recipe from mock data - in a real app, you'd fetch this
  const recipe = allRecipes.find(r => r.id === id) as Recipe | undefined;

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white" style={{ paddingTop: top }}>
        <Text className="text-lg text-red-500">Recipe not found!</Text>
      </View>
    );
  }

  // Use a default image if recipe.imageUrl is not available
  const displayImageUrl = recipe.imageUrl || 'https://via.placeholder.com/400x200.png?text=No+Image';
  const defaultIngredientImage = 'https://via.placeholder.com/50.png?text=Ing';


  return (
    <ScrollView className="flex-1 bg-gray-50" style={{ paddingTop: top }}>
      {/* Header Image */}
      <View className="relative">
        <Image source={{ uri: displayImageUrl }} className="w-full h-64" resizeMode="cover" />
        {/* Back button - needs navigation setup to work properly */}
        <View className="absolute top-4 left-4 bg-black/50 p-2 rounded-full">
          <Ionicons name="arrow-back" size={24} color="white" />
        </View>
      </View>

      <View className="p-4">
        {/* Title and basic info */}
        <Text className="text-3xl font-bold text-gray-800 mb-1">{recipe.title}</Text>
        <Text className="text-sm text-gray-500 mb-3">{recipe.category} {recipe.isVegetarian !== undefined ? (recipe.isVegetarian ? '• Veg' : '• Non-Veg') : ''}</Text>
        
        <View className="flex-row space-x-4 mb-6">
          <View className="bg-purple-100 p-3 rounded-lg items-center flex-1">
            <Ionicons name="time-outline" size={24} color="#8B5CF6" />
            <Text className="text-sm text-purple-700 mt-1">{recipe.prepTime} prep</Text>
          </View>
          <View className="bg-green-100 p-3 rounded-lg items-center flex-1">
            <Ionicons name="flame-outline" size={24} color="#10B981" />
            <Text className="text-sm text-green-700 mt-1">{recipe.cookTime} cook</Text>
          </View>
        </View>

        {/* Nutrition per serving */}
        {recipe.nutrition && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Nutrition per serving</Text>
            <View className="bg-white p-4 rounded-lg shadow">
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-700">{recipe.nutrition.kcal}</Text>
                  <Text className="text-xs text-gray-500">Kcal</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-700">{recipe.nutrition.protein}</Text>
                  <Text className="text-xs text-gray-500">Protein</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-700">{recipe.nutrition.fats}</Text>
                  <Text className="text-xs text-gray-500">Fats</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-700">{recipe.nutrition.carbs}</Text>
                  <Text className="text-xs text-gray-500">Carbs</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {/* Allergens */}
        {recipe.allergens && recipe.allergens.length > 0 && (
            <View className="mb-6">
                <Text className="text-xl font-semibold text-gray-800 mb-2">Allergens</Text>
                <View className="flex-row flex-wrap">
                    {recipe.allergens.map((allergen, index) => (
                        <View key={`allergen-${allergen.replace(/\s+/g, '-')}-${index}`} className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2">
                            <Text className="text-red-700 text-sm">{allergen}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}


        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">Ingredients</Text>
            {recipe.ingredients.map((ing, index) => (
              <View key={`ingredient-${ing.name.replace(/\s+/g, '-')}-${index}`} className="flex-row items-center bg-white p-3 rounded-lg shadow mb-2">
                <Image 
                  source={{ uri: ing.imageUrl || defaultIngredientImage }} 
                  className="w-12 h-12 rounded-md mr-4" 
                />
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-700">{ing.name}</Text>
                </View>
                <Text className="text-sm text-gray-600">{ing.quantity} {ing.unit || ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">Instructions</Text>
            {recipe.instructions.map((step, index) => (
              <View key={`instruction-${step.substring(0, 10).replace(/\s+/g, '-')}-${index}`} className="flex-row bg-white p-4 rounded-lg shadow mb-3">
                <Text className="text-purple-600 font-bold mr-3 text-lg">{index + 1}</Text>
                <Text className="text-base text-gray-700 flex-1">{step}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipeDetailScreen; 