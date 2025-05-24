import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Modal,
	ActivityIndicator,
	Image,
} from "react-native";
import { supabase } from "../../lib/supabase"; // Assuming supabase client is here
import { Ionicons } from "@expo/vector-icons";

// Define a type for the data stored within the 'data' jsonb column
interface ExclusiveRecipeData {
	description: string;
	ingredients: string[];
	instructions: string; // Purchase to reveal
	prepTime: string;
	cookTime: string;
	servings: string;
	imageUrl?: string; // Optional image URL for the recipe card
}

// Define the type for a fully processed exclusive recipe, including top-level fields
interface ExclusiveRecipe {
	id: string; // Or number, depending on your preference for frontend handling
	name: string | null;
	price: string | null; // Supabase numeric type might come as string
	data: ExclusiveRecipeData | null;
}

// Type for the raw data fetched from Supabase
interface FetchedExclusiveRecipeItem {
	id: number; // Supabase returns serial id as number
	name: string | null;
	price: string | null; // Numeric comes as string
	data: ExclusiveRecipeData | null;
}

// Placeholder image if specific recipe image is not available
const placeholderImageUrl =
	"https://placehold.co/600x400/EEE/31343C?text=Recipe";

export default function ExploreScreen() {
	const [recipes, setRecipes] = useState<ExclusiveRecipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState<ExclusiveRecipe | null>(
		null,
	);

	useEffect(() => {
		const fetchExclusiveRecipes = async () => {
			try {
				setLoading(true);
				setError(null);
				const { data: fetchedData, error: fetchError } = await supabase
					.from("YUM_exclusive_recipes") // Correct table name
					.select("id, name, price, data")
					.returns<FetchedExclusiveRecipeItem[]>();

				if (fetchError) {
					throw fetchError;
				}

				if (fetchedData) {
					const formattedRecipes: ExclusiveRecipe[] = fetchedData.map(
						(item) => ({
							...item,
							id: item.id.toString(), // Ensure id is a string for keys
							// Name, price, and data are already in the correct shape if not null
						}),
					);
					setRecipes(formattedRecipes);
				} else {
					setRecipes([]);
				}
			} catch (e: unknown) {
				console.error("Failed to fetch exclusive recipes:", e);
				if (e instanceof Error) {
					setError(e.message || "Failed to load exclusive recipes.");
				} else {
					setError("An unexpected error occurred.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchExclusiveRecipes();
	}, []);

	const openModal = (recipe: ExclusiveRecipe) => {
		setSelectedRecipe(recipe);
		setModalVisible(true);
	};

	const renderRecipeItem = ({ item }: { item: ExclusiveRecipe }) => (
		<TouchableOpacity
			onPress={() => openModal(item)}
			className="bg-white p-4 rounded-lg shadow-md mb-4 mx-4 flex-row items-center"
		>
			<Image
				source={{ uri: item.data?.imageUrl || placeholderImageUrl }}
				className="w-20 h-20 rounded-md mr-4"
			/>
			<View className="flex-1">
				<Text className="text-lg font-semibold text-gray-800">
					{item.name || "Unnamed Recipe"}
				</Text>
				<Text className="text-md text-green-600 font-bold mt-1">
					{item.price ? `${item.price} YUM` : "Price not set"}
				</Text>
				{item.data?.description && (
					<Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
						{item.data.description}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center bg-gray-50">
				<ActivityIndicator size="large" color="#8B5CF6" />
				<Text className="mt-2 text-gray-600">Loading Exclusive Recipes...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center bg-gray-50 px-4">
				<Ionicons name="alert-circle-outline" size={48} color="red" />
				<Text className="mt-2 text-lg text-red-600 text-center">
					Oops! Something went wrong.
				</Text>
				<Text className="mt-1 text-sm text-gray-500 text-center">{error}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gray-50 pt-4">
			<Text className="text-2xl font-bold text-gray-800 px-4 mb-4">
				Exclusive Recipes
			</Text>
			{recipes.length > 0 ? (
				<FlatList
					data={recipes}
					renderItem={renderRecipeItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			) : (
				<View className="flex-1 justify-center items-center">
					<Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
					<Text className="mt-2 text-gray-500">
						No exclusive recipes available right now.
					</Text>
				</View>
			)}

			{selectedRecipe && (
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
						setSelectedRecipe(null);
					}}
				>
					<View className="flex-1 justify-center items-center bg-black/50">
						<View className="bg-white p-6 rounded-xl shadow-xl w-11/12 max-w-md">
							<View className="flex-row justify-between items-center mb-4">
								<Text className="text-2xl font-bold text-gray-800">
									{selectedRecipe.name}
								</Text>
								<TouchableOpacity
									onPress={() => {
										setModalVisible(false);
										setSelectedRecipe(null);
									}}
								>
									<Ionicons name="close-circle" size={28} color="#6B7280" />
								</TouchableOpacity>
							</View>

							<Image
								source={{
									uri: selectedRecipe.data?.imageUrl || placeholderImageUrl,
								}}
								className="w-full h-48 rounded-lg mb-4"
							/>

							{selectedRecipe.data?.description && (
								<Text className="text-gray-700 mb-2 text-base">
									{selectedRecipe.data.description}
								</Text>
							)}
							<Text className="text-lg font-semibold text-green-600 mb-1">
								Price: {selectedRecipe.price} YUM
							</Text>
							<Text className="text-gray-600 mb-4">
								Your YUM Balance: <Text className="font-semibold"> -- YUM</Text>
							</Text>

							<TouchableOpacity
								className="bg-purple-600 py-3 rounded-lg items-center shadow-md hover:bg-purple-700 transition-colors duration-150"
								onPress={() => {
									// Buy logic will go here
									console.log("Buy button pressed for:", selectedRecipe.name);
									setModalVisible(false);
									setSelectedRecipe(null);
								}}
							>
								<Text className="text-white text-lg font-semibold">
									Confirm Purchase
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="mt-2 border border-gray-300 py-3 rounded-lg items-center hover:bg-gray-100 transition-colors duration-150"
								onPress={() => {
									setModalVisible(false);
									setSelectedRecipe(null);
								}}
							>
								<Text className="text-gray-700 text-lg">Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}
		</View>
	);
}
