import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	Image,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define a type for the data stored within the 'data' jsonb column of YUM_exclusive_recipes
interface ExclusiveRecipeData {
	description: string;
	// Ensure ingredients structure matches what's in your DB, assuming array of strings for now
	// If it's an array of objects like in the other recipe screen, adjust this:
	// ingredients: Array<{ name: string; quantity: string; unit?: string; imageUrl?: string }>;
	ingredients: string[];
	instructions: string; // Full instructions are available
	prepTime: string;
	cookTime: string;
	servings: string;
	imageUrl?: string;
	// Add any other fields that are part of the 'data' jsonb column in YUM_exclusive_recipes
	// e.g., category, allergens, nutrition, if they are stored there
	category?: string;
	nutrition?: { kcal: string; protein: string; fats: string; carbs: string };
	allergens?: string[];
}

// Define the type for a fully processed exclusive recipe, including top-level fields
interface ExclusiveRecipe {
	id: string; // Database ID
	name: string | null;
	price: string | null; // Though purchased, having price might be useful for context or future features
	data: ExclusiveRecipeData;
}

// This interface matches the shape of a single row from YUM_exclusive_recipes
interface FetchedExclusiveRecipeRow {
	id: number;
	name: string | null;
	price: string | null;
	data: ExclusiveRecipeData | null; // 'data' column can be null in the database
}

const ExclusiveRecipeDetailScreen = () => {
	const { id: routeId } = useLocalSearchParams<{ id: string }>();
	const { top } = useSafeAreaInsets();
	const router = useRouter();

	const [recipe, setRecipe] = useState<ExclusiveRecipe | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!routeId) {
			setError("Exclusive Recipe ID is missing.");
			setLoading(false);
			return;
		}

		const fetchRecipeDetails = async () => {
			try {
				setLoading(true);
				setError(null);

				const { data, error: fetchError } = await supabase
					.from("YUM_exclusive_recipes")
					.select("id, name, price, data")
					.eq("id", routeId)
					.returns<FetchedExclusiveRecipeRow>() // Use the row type
					.single(); // Fetches a single row or null

				if (fetchError) {
					if (fetchError.code !== "PGRST116") {
						// PGRST116 means 0 rows, handled by maybeSingle
						throw fetchError;
					}
				}
				const fetchedData = data as FetchedExclusiveRecipeRow;

				// Now, 'data' here is either FetchedExclusiveRecipeRow or null
				if (fetchedData !== null) {
					setRecipe({
						id: fetchedData?.id.toString(),
						name: fetchedData?.name,
						price: fetchedData?.price,
						data: fetchedData?.data, // data.data is now confirmed to be ExclusiveRecipeData
					});
				} else if (!fetchError) {
					setError(
						`Exclusive Recipe with ID ${routeId} not found or has incomplete data.`,
					);
				}
			} catch (e: unknown) {
				console.error(
					`Failed to fetch exclusive recipe with ID ${routeId}:`,
					e,
				);
				if (e instanceof Error) {
					setError(e.message || "Failed to load exclusive recipe details.");
				} else {
					setError(
						"An unexpected error occurred while fetching exclusive recipe details.",
					);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchRecipeDetails();
	}, [routeId]);

	if (loading) {
		return (
			<View
				className="flex-1 justify-center items-center bg-gray-50"
				style={{ paddingTop: top }}
			>
				<ActivityIndicator size="large" color="#8B5CF6" />
				<Text className="mt-2 text-gray-600">Loading Exclusive Recipe...</Text>
			</View>
		);
	}

	if (error || !recipe) {
		// Simpler check here, as recipe.data is part of ExclusiveRecipe type now
		return (
			<View
				className="flex-1 justify-center items-center bg-gray-50 px-4"
				style={{ paddingTop: top }}
			>
				<Ionicons name="alert-circle-outline" size={48} color="red" />
				<Text className="mt-2 text-lg text-red-600 text-center">
					{error || "Exclusive Recipe not found or data is missing!"}
				</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className="mt-4 bg-purple-600 px-4 py-2 rounded-lg"
				>
					<Text className="text-white font-semibold">Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// recipe and recipe.data are guaranteed non-null here if the check above passed
	const { name, data: recipeData } = recipe; // Renamed to avoid conflict with 'data' from Supabase result
	const {
		description,
		ingredients,
		instructions,
		prepTime,
		cookTime,
		servings,
		imageUrl,
		category,
		nutrition,
		allergens,
	} = recipeData;

	const displayImageUrl =
		imageUrl || "https://via.placeholder.com/400x200.png?text=No+Image";
	const defaultIngredientImage = "https://via.placeholder.com/50.png?text=Ing"; // If ingredients become objects with images

	return (
		<ScrollView className="flex-1 bg-gray-50" style={{ paddingTop: top }}>
			<View className="relative">
				<Image
					source={{ uri: displayImageUrl }}
					className="w-full h-64"
					resizeMode="cover"
				/>
				<TouchableOpacity
					onPress={() => router.back()}
					className="absolute top-4 left-4 bg-black/50 p-2 rounded-full z-10"
					style={{ marginTop: top > 20 ? top - 10 : 10 }}
				>
					<Ionicons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View className="p-4">
				<Text className="text-3xl font-bold text-gray-800 mb-1">
					{name || "Exclusive Recipe"}
				</Text>
				{category && (
					<Text className="text-sm text-gray-500 mb-2">{category}</Text>
				)}
				<Text className="text-base text-gray-700 mb-4">
					{description || "No description available."}
				</Text>

				<View className="flex-row space-x-4 mb-6">
					<View className="bg-purple-100 p-3 rounded-lg items-center flex-1">
						<Ionicons name="time-outline" size={24} color="#8B5CF6" />
						<Text className="text-sm text-purple-700 mt-1">
							{prepTime} prep
						</Text>
					</View>
					<View className="bg-green-100 p-3 rounded-lg items-center flex-1">
						<Ionicons name="flame-outline" size={24} color="#10B981" />
						<Text className="text-sm text-green-700 mt-1">{cookTime} cook</Text>
					</View>
					<View className="bg-blue-100 p-3 rounded-lg items-center flex-1">
						<Ionicons name="restaurant-outline" size={24} color="#3B82F6" />
						<Text className="text-sm text-blue-700 mt-1">
							{servings} servings
						</Text>
					</View>
				</View>

				{/* Nutrition per serving - adapt if structure differs in exclusive recipes */}
				{nutrition && (
					<View className="mb-6">
						<Text className="text-xl font-semibold text-gray-800 mb-2">
							Nutrition per serving
						</Text>
						<View className="bg-white p-4 rounded-lg shadow">
							<View className="flex-row justify-around">
								<View className="items-center">
									<Text className="text-lg font-bold text-gray-700">
										{nutrition.kcal}
									</Text>
									<Text className="text-xs text-gray-500">Kcal</Text>
								</View>
								<View className="items-center">
									<Text className="text-lg font-bold text-gray-700">
										{nutrition.protein}
									</Text>
									<Text className="text-xs text-gray-500">Protein</Text>
								</View>
								<View className="items-center">
									<Text className="text-lg font-bold text-gray-700">
										{nutrition.fats}
									</Text>
									<Text className="text-xs text-gray-500">Fats</Text>
								</View>
								<View className="items-center">
									<Text className="text-lg font-bold text-gray-700">
										{nutrition.carbs}
									</Text>
									<Text className="text-xs text-gray-500">Carbs</Text>
								</View>
							</View>
						</View>
					</View>
				)}

				{/* Allergens - adapt if structure differs */}
				{allergens && allergens.length > 0 && (
					<View className="mb-6">
						<Text className="text-xl font-semibold text-gray-800 mb-2">
							Allergens
						</Text>
						<View className="flex-row flex-wrap">
							{allergens.map((allergen, index) => (
								<View
									key={`excl-allergen-${routeId}-${allergen.slice(0, 10)}-${index}`}
									className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2"
								>
									<Text className="text-red-700 text-sm">{allergen}</Text>
								</View>
							))}
						</View>
					</View>
				)}

				{/* Ingredients */}
				{/* This section needs careful adaptation based on how 'ingredients' are stored in YUM_exclusive_recipes.data */}
				{/* Assuming ingredients is an array of strings for now as per ExclusiveRecipeData interface */}
				{ingredients && ingredients.length > 0 && (
					<View className="mb-6">
						<Text className="text-xl font-semibold text-gray-800 mb-3">
							Ingredients
						</Text>
						{ingredients.map((ingredient, index) => (
							// Using ingredient string itself with index for a more unique key
							<View
								key={`excl-ingredient-${routeId}-${ingredient.slice(0, 10)}-${index}`}
								className="flex-row items-center bg-white p-3 rounded-lg shadow mb-2"
							>
								{/* If ingredient is just a string, you might not have an image or quantity/unit separately unless you parse it */}
								{/* For simple string array: */}
								<Ionicons
									name="checkmark-circle-outline"
									size={20}
									color="#8B5CF6"
									className="mr-3"
								/>
								<Text className="text-base text-gray-700 flex-1">
									{ingredient}
								</Text>
							</View>
						))}
					</View>
				)}

				{/* Instructions */}
				{/* Assuming instructions is a single string. If it's an array of strings, map over it. */}
				<View className="mb-6">
					<Text className="text-xl font-semibold text-gray-800 mb-3">
						Instructions
					</Text>
					<View className="bg-white p-4 rounded-lg shadow">
						{/* Ensure instructions string is split into paragraphs if it contains newlines */}
						{instructions.split("\n").map((paragraph, index) => (
							<Text
								key={`excl-instr-p-${routeId}-${index}-${paragraph.slice(0, 10)}`}
								className="text-base text-gray-700 mb-2"
							>
								{paragraph}
							</Text>
						))}
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default ExclusiveRecipeDetailScreen;
