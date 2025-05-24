import React, { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Image,
	ScrollView,
	Alert,
	RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

interface ExclusiveRecipeData {
	description: string;
	ingredients: string[];
	instructions: string;
	prepTime: string;
	cookTime: string;
	servings: string;
	imageUrl?: string;
}

interface ExclusiveRecipe {
	id: string;
	name: string | null;
	price: string | null;
	data: ExclusiveRecipeData | null;
}

interface PurchasedRecipeInfo {
	purchaseId: number;
	recipeId: number;
	recipeName: string | null;
	recipeImageUrl?: string | null;
	purchaseDate: string;
	pricePaid: string;
}

interface UserProfile {
	id: number;
	authUserId: string | null;
	name: string | null;
	balance: string;
}

// Define the type for a user reward
interface UserReward {
	id: number;
	userId: number;
	title: string;
	description?: string | null; // Optional description
	imageUrl?: string | null; // Optional image URL
	dateAwarded: string;
}

const HARDCODED_USER_ID = 1;
const placeholderImageUrl =
	"https://placehold.co/600x400/EEE/31343C?text=Recipe";

const AccountScreen = () => {
	const { top } = useSafeAreaInsets();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [purchasedRecipes, setPurchasedRecipes] = useState<
		PurchasedRecipeInfo[]
	>([]);
	const [userRewards, setUserRewards] = useState<UserReward[]>([]); // State for rewards
	const [loading, setLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async (isManualRefresh = false) => {
		if (!isManualRefresh) setLoading(true);
		else setIsRefreshing(true);

		setError(null);

		try {
			const { data: user, error: profileError } = await supabase
				.from("YUM_users")
				.select("id, auth_user_id, name, balance")
				.eq("id", HARDCODED_USER_ID)
				.single();

			if (profileError) {
				throw new Error(
					`Failed to fetch user profile: ${profileError.message}`,
				);
			}
			if (user) {
				setUserProfile({
					id: user.id,
					authUserId: user.auth_user_id,
					name: user.name,
					balance: user.balance,
				} as UserProfile);
			} else {
				throw new Error(`User with ID ${HARDCODED_USER_ID} not found.`);
			}

			const { data: purchases, error: purchasesError } = await supabase
				.from("YUM_purchased_recipes")
				.select("id, recipe_id, purchase_date, price_paid")
				.eq("user_id", HARDCODED_USER_ID)
				.order("purchase_date", { ascending: false });

			if (purchasesError) {
				throw new Error(
					`Failed to fetch purchased recipes: ${purchasesError.message}`,
				);
			}

			if (purchases && purchases.length > 0) {
				const recipeDetailsPromises = purchases.map(async (purchase) => {
					const { data: recipeData, error: recipeError } = await supabase
						.from("YUM_exclusive_recipes")
						.select("name, data")
						.eq("id", purchase.recipe_id)
						.single<Omit<ExclusiveRecipe, "id" | "price">>();

					if (recipeError) {
						console.warn(
							`Could not fetch details for recipe ID ${purchase.recipe_id}: ${recipeError.message}`,
						);
						return null;
					}
					return {
						purchaseId: purchase.id,
						recipeId: purchase.recipe_id,
						recipeName: recipeData?.name || "Unnamed Recipe",
						recipeImageUrl: recipeData?.data?.imageUrl,
						purchaseDate: purchase.purchase_date,
						pricePaid: purchase.price_paid,
					};
				});

				const resolvedRecipes = (await Promise.all(recipeDetailsPromises)).filter(
					(r) => r !== null,
				) as PurchasedRecipeInfo[];
				setPurchasedRecipes(resolvedRecipes);
			}

			// 3. Fetch user rewards
			const { data: rewards, error: rewardsError } = await supabase
				.from("YUM_user_rewards")
				.select("id, user_id, title, description, image_url, date_awarded")
				.eq("user_id", HARDCODED_USER_ID)
				.order("date_awarded", { ascending: false });

			if (rewardsError) {
				throw new Error(
					`Failed to fetch user rewards: ${rewardsError.message}`,
				);
			}

			if (rewards) {
				const formattedRewards: UserReward[] = rewards.map((reward) => ({
					id: reward.id,
					userId: reward.user_id,
					title: reward.title,
					description: reward.description,
					imageUrl: reward.image_url, // Use image_url from db
					dateAwarded: reward.date_awarded,
				}));
				setUserRewards(formattedRewards);
			}

		} catch (e: unknown) {
			console.error("Error fetching account data:", e);
			const errorMessage =
				e instanceof Error ? e.message : "An unexpected error occurred.";
			setError(errorMessage);
			Alert.alert("Error", errorMessage);
		} finally {
			if (!isManualRefresh) setLoading(false);
			else setIsRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const onRefresh = useCallback(() => {
		fetchData(true);
	}, [fetchData]);

	const renderPurchasedRecipeItem = ({
		item,
	}: { item: PurchasedRecipeInfo }) => (
		<TouchableOpacity
			className="bg-white p-4 rounded-lg shadow mb-3 flex-row items-center"
			onPress={() => Alert.alert("Access Recipe", `You clicked on ${item.recipeName}. Access to full instructions would be granted here.`)}
		>
			<Image
				source={{ uri: item.recipeImageUrl || placeholderImageUrl }}
				className="w-16 h-16 rounded-md mr-4"
			/>
			<View className="flex-1">
				<Text className="text-lg font-semibold text-gray-800">
					{item.recipeName}
				</Text>
				<Text className="text-sm text-gray-500">
					Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
				</Text>
				<Text className="text-sm text-green-600">
					Paid: {item.pricePaid} YUM
				</Text>
			</View>
			<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
		</TouchableOpacity>
	);

	// Render function for reward items
	const renderRewardItem = ({ item }: { item: UserReward }) => (
		<View className="bg-white p-3 rounded-lg shadow mr-3 w-48 flex flex-col items-center">
			<Image
				source={{ uri: item.imageUrl || placeholderImageUrl }}
				className="w-40 h-32 rounded-md mb-2"
			/>
			<View className="flex-1 w-full">
				<Text className="text-md font-semibold text-gray-800 text-center" numberOfLines={1}>{item.title}</Text>
				{item.description && (
					<Text className="text-xs text-gray-600 mt-1 text-center" numberOfLines={2}>
						{item.description}
					</Text>
				)}
				<Text className="text-xs text-gray-400 mt-1 text-center">
					Awarded: {new Date(item.dateAwarded).toLocaleDateString()}
				</Text>
			</View>
		</View>
	);

	if (loading) {
		return (
			<View
				className="flex-1 justify-center items-center bg-gray-100"
				style={{ paddingTop: top }}
			>
				<ActivityIndicator size="large" color="#8B5CF6" />
				<Text className="mt-2 text-gray-600">Loading Account...</Text>
			</View>
		);
	}

	if (error && !userProfile && purchasedRecipes.length === 0) {
		return (
			<View
				className="flex-1 justify-center items-center bg-gray-100 px-6"
				style={{ paddingTop: top }}
			>
				<Ionicons name="alert-circle-outline" size={48} color="red" />
				<Text className="mt-4 text-xl text-red-600 text-center">
					Failed to Load Account
				</Text>
				<Text className="mt-2 text-base text-gray-500 text-center">
					{error}
				</Text>
			</View>
		);
	}

	return (
		<ScrollView
			className="flex-1 bg-gray-100"
			style={{ paddingTop: top }}
			contentContainerStyle={{ paddingBottom: 20 }}
			refreshControl={
				<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#8B5CF6"]}/>
			}
		>
			<View className="p-6 bg-white shadow-md mb-6">
				<View className="flex-row items-center">
					<Image
						source={{
							uri: "https://placehold.co/100x100/EBF4FF/7F9CF5?text=User",
						}}
						className="w-20 h-20 rounded-full mr-4 border-2 border-purple-300"
					/>
					<View>
						<Text className="text-2xl font-bold text-gray-800">
							{userProfile?.name || "User Name"}
						</Text>
						<Text className="text-md text-gray-600">
							YUM Balance:{" "}
							<Text className="font-semibold text-green-600">
								{userProfile?.balance || "0"} YUM
							</Text>
						</Text>
					</View>
				</View>
			</View>

			<View className="px-6 mb-6">
				<Text className="text-xl font-semibold text-gray-700 mb-3">
					My NFT Rewards
				</Text>
				{userRewards.length > 0 ? (
					<View className="h-60 bg-slate-100 rounded-lg p-4">
						<FlatList
							data={userRewards}
							renderItem={renderRewardItem}
							keyExtractor={(item) => item.id.toString()}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						/>
					</View>
				) : (
					!loading && !isRefreshing && (
						<View className="bg-white p-6 rounded-lg shadow items-center justify-center min-h-[100px]">
							<Ionicons name="diamond-outline" size={32} color="#A78BFA" />
							<Text className="text-gray-500 mt-2 text-center">
								You currently have no NFT rewards.
								Keep engaging to earn them!
							</Text>
						</View>
					)
				)}
			</View>

			<View className="px-6">
				<View className="flex-row justify-between items-center mb-3">
					<Text className="text-xl font-semibold text-gray-700">
						My Purchased Recipes
					</Text>
					<TouchableOpacity onPress={() => fetchData(true)} className="p-1">
						<Text className="text-sm text-purple-600 font-medium">Refresh</Text>
					</TouchableOpacity>
				</View>
				{error && !purchasedRecipes.length && (
					<View className="bg-red-50 p-4 rounded-lg mb-4">
						<Text className="text-red-700 text-center">
							Could not load your purchased recipes: {error}
						</Text>
					</View>
				)}
				{purchasedRecipes.length > 0 ? (
					<FlatList
						data={purchasedRecipes}
						renderItem={renderPurchasedRecipeItem}
						keyExtractor={(item) => item.purchaseId.toString()}
						scrollEnabled={false}
					/>
				) : (
					!loading && !error && (
						<View className="bg-white p-6 rounded-lg shadow items-center justify-center min-h-[100px]">
							<Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
							<Text className="text-gray-500 mt-2">
								You haven't purchased any recipes yet.
							</Text>
						</View>
					)
				)}
			</View>
		</ScrollView>
	);
};

export default AccountScreen; 