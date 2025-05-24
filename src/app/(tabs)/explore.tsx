import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Modal,
	ActivityIndicator,
	Image,
	Alert,
} from "react-native";
import { supabase } from "../../lib/supabase"; // Assuming supabase client is here
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Import router

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

interface UserProfile {
	id: number; // This is the YUM_users table ID
	authUserId: string | null; // Can be null if not using auth_user_id directly for fetch
	name: string | null;
	balance: string;
}

const HARDCODED_USER_ID = 1;

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
	const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
	const [isPurchasing, setIsPurchasing] = useState(false);

	useEffect(() => {
		const initializeScreen = async () => {
			setLoading(true);
			setError(null);

			// Fetch user profile for hardcoded user ID 1
			try {
				console.log(`Fetching profile for hardcoded user ID: ${HARDCODED_USER_ID}`);
				const { data: userProfile, error: profileError } = await supabase
					.from('YUM_users')
					.select('id, auth_user_id, name, balance') // auth_user_id can be null
					.eq('id', HARDCODED_USER_ID)
					.single();

				if (profileError) {
					console.error("Error fetching user profile for ID 1:", profileError);
					setError(`Could not load profile for user ID ${HARDCODED_USER_ID}. Ensure this user exists and has a balance.`);
				} else if (userProfile) {
					console.log("User profile fetched:", userProfile);
					setCurrentUser({
						id: userProfile.id,
						authUserId: userProfile.auth_user_id, // Keep it even if null
						name: userProfile.name,
						balance: userProfile.balance,
					} as UserProfile);
				} else {
					setError(`User with ID ${HARDCODED_USER_ID} not found.`);
				}
			} catch (e: unknown) {
				console.error("Exception fetching user profile:", e);
				setError("An unexpected error occurred while loading user profile.");
			}

			// Fetch exclusive recipes (even if user profile fetch fails, to show recipes)
			try {
				const { data: fetchedData, error: fetchError } = await supabase
					.from("YUM_exclusive_recipes")
					.select("id, name, price, data")
					.returns<FetchedExclusiveRecipeItem[]>();

				if (fetchError) {
					throw fetchError;
				}

				if (fetchedData) {
					const formattedRecipes: ExclusiveRecipe[] = fetchedData.map(
						(item) => ({
							...item,
							id: item.id.toString(),
						}),
					);
					setRecipes(formattedRecipes);
				} else {
					setRecipes([]);
				}
			} catch (e: unknown) {
				console.error("Failed to fetch exclusive recipes:", e);
				const recipeErrorMsg = e instanceof Error ? e.message : "Failed to load exclusive recipes.";
				setError((prevError) => prevError ? `${prevError}\n${recipeErrorMsg}` : recipeErrorMsg);
			} finally {
				setLoading(false);
			}
		};

		initializeScreen();
	}, []);

	const handleBuyRecipe = async () => {
		if (!selectedRecipe || !currentUser || !selectedRecipe.price) {
			Alert.alert("Error", "Recipe or user information is missing, or price is not set.");
			return;
		}

		// Ensure currentUser.id is the one we expect (hardcoded or fetched)
		if (currentUser.id !== HARDCODED_USER_ID && !currentUser.authUserId) {
			Alert.alert("Error", "User identification issue. Please restart the app.");
			return;
		}

		setIsPurchasing(true);
		const recipePrice = Number.parseFloat(selectedRecipe.price);
		const userBalance = Number.parseFloat(currentUser.balance);

		if (Number.isNaN(recipePrice) || recipePrice <= 0) {
			Alert.alert("Error", "Invalid recipe price.");
			setIsPurchasing(false);
			return;
		}

		if (userBalance < recipePrice) {
			Alert.alert("Insufficient Balance", "You do not have enough YUM tokens to purchase this recipe.");
			setIsPurchasing(false);
			return;
		}

		try {
			// 1. Deduct balance
			const newBalance = userBalance - recipePrice;
			const { error: balanceError } = await supabase
				.from('YUM_users')
				.update({ balance: newBalance.toString() })
				.eq('id', currentUser.id); // Use the fetched currentUser.id which should be HARDCODED_USER_ID

			if (balanceError) {
				throw new Error(`Failed to update balance: ${balanceError.message}`);
			}

			// 2. Record purchase
			const { error: purchaseError } = await supabase
				.from('YUM_purchased_recipes')
				.insert({
					user_id: currentUser.id, // Use the fetched currentUser.id
					recipe_id: Number.parseInt(selectedRecipe.id, 10),
					price_paid: selectedRecipe.price, // Store original string price
					purchase_details: { purchasedFrom: "ExploreTab", method: "hardcodedUser" },
				});

			if (purchaseError) {
				console.warn("Purchase record failed, attempting to revert balance. This is not guaranteed.");
				await supabase
					.from('YUM_users')
					.update({ balance: currentUser.balance }) 
					.eq('id', currentUser.id);
				throw new Error(`Failed to record purchase: ${purchaseError.message}. Balance revert attempted.`);
			}

			setCurrentUser({ ...currentUser, balance: newBalance.toString() });
			Alert.alert("Success!", `You have successfully purchased ${selectedRecipe.name}.`);
			setModalVisible(false);
			setSelectedRecipe(null);
			router.push("/(tabs)/account"); // Navigate to account screen

		} catch (e: unknown) {
			console.error("Purchase failed:", e);
			if (e instanceof Error) {
				Alert.alert("Purchase Failed", e.message);
			} else {
				Alert.alert("Purchase Failed", "An unexpected error occurred during purchase.");
			}
		} finally {
			setIsPurchasing(false);
		}
	};

	const openModal = (recipe: ExclusiveRecipe) => {
		if (!currentUser) {
			// This condition might be hit if the initial fetch for HARDCODED_USER_ID failed
			Alert.alert("User Profile Error", error || "User profile not loaded. Cannot open purchase modal.");
			return;
		}
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

	if (error && !recipes.length && !currentUser) { // Show full screen error if critical (e.g. user profile fails and no recipes either)
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
			<Text className="text-2xl font-bold text-gray-800 px-4 mb-2">
				Exclusive Recipes
			</Text>
			{error && (
				<Text className="text-sm text-red-500 px-4 mb-2 text-center">
					{error} {currentUser ? "(Recipe loading might have also failed)" : "(User profile failed to load)"}
				</Text>
			)}

			{recipes.length > 0 ? (
				<FlatList
					data={recipes}
					renderItem={renderRecipeItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 20 }}
				/>
			) : (
				!loading && (
					<View className="flex-1 justify-center items-center">
						<Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
						<Text className="mt-2 text-gray-500">
							No exclusive recipes available right now.
						</Text>
					</View>
				)
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
								Your YUM Balance: <Text className="font-semibold">{currentUser?.balance || '--'} YUM</Text>
							</Text>

							<TouchableOpacity
								className={`py-3 rounded-lg items-center shadow-md transition-colors duration-150 ${
									isPurchasing ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
								}`}
								onPress={handleBuyRecipe}
								disabled={isPurchasing || !currentUser}
							>
								{isPurchasing ? (
									<ActivityIndicator size="small" color="#ffffff" />
								) : (
									<Text className="text-white text-lg font-semibold">
										Confirm Purchase
									</Text>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								className="mt-2 border border-gray-300 py-3 rounded-lg items-center hover:bg-gray-100 transition-colors duration-150"
								onPress={() => {
									setModalVisible(false);
									setSelectedRecipe(null);
								}}
								disabled={isPurchasing}
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
