export interface MockUserReward {
	userId: number;
	title: string;
	description: string;
	imageUrl: string;
	// dateAwarded will be set by the DB default
}

export const userRewards: MockUserReward[] = [
	{
		userId: 1,
		title: "First Recipe Cooked!",
		description:
			"Congrats on cooking your first recipe with Yumazing! Here's a little something to get you started.",
		imageUrl: "https://placehold.co/300x300/A78BFA/FFFFFF?text=Welcome+Chef",
	},
	{
		userId: 1,
		title: "Weekly Cook Streak (Bronze)",
		description: "You cooked 3 recipes this week! Keep up the great work.",
		imageUrl:
			"https://placehold.co/300x300/CD7F32/FFFFFF?text=Bronze+Cook",
	},
	{
		userId: 1,
		title: "Weekly Cook Streak (Silver)",
		description:
			"Amazing! You cooked 5 recipes this week. You're a cooking star!",
		imageUrl:
			"https://placehold.co/300x300/C0C0C0/FFFFFF?text=Silver+Star",
	},
	{
		userId: 1,
		title: "Weekly Cook Streak (Gold)",
		description: "Incredible! 7 recipes in 7 days! You're a Yumazing Legend!",
		imageUrl:
			"https://placehold.co/300x300/FFD700/000000?text=Gold+Legend",
	},
	{
		userId: 1,
		title: "Spice Explorer",
		description:
			"You've tried 5 recipes from different cuisines. Your palate is truly global!",
		imageUrl:
			"https://placehold.co/300x300/FF6347/FFFFFF?text=Spice+Explorer",
	},
	{
		userId: 1,
		title: "'Unlock the Secret Ingredient' NFT",
		description:
			"You mastered the 'Hidden Gem Pasta'! Claim your exclusive Secret Ingredient NFT.",
		imageUrl:
			"https://placehold.co/300x300/483D8B/FFFFFF?text=Secret+NFT", // DarkSlateBlue
	},
	{
		userId: 1,
		title: "'Baker's Dozen' Achievement",
		description:
			"You've baked 13 items! You're officially a Yumazing Pastry Pro.",
		imageUrl:
			"https://placehold.co/300x300/D2B48C/FFFFFF?text=Baker\'s+Dozen", // Tan
	},
	{
		userId: 1,
		title: "'Healthy Choice' Champion",
		description: "5 healthy recipes cooked! Fueling your body the Yumazing way.",
		imageUrl:
			"https://placehold.co/300x300/32CD32/FFFFFF?text=Healthy+Champ", // LimeGreen
	},
	{
		userId: 1,
		title: "'Weekend Warrior' Badge",
		description:
			"You cooked up a storm this weekend (3+ recipes)! Delicious effort!",
		imageUrl:
			"https://placehold.co/300x300/FF4500/FFFFFF?text=Weekend+Warrior", // OrangeRed
	},
	{
		userId: 1,
		title: "'Festival Feast Master' - Diwali Special",
		description:
			"You cooked our special 'Festive Biryani' for Diwali! Earn double YUM points.",
		imageUrl:
			"https://placehold.co/300x300/FFA500/000000?text=Diwali+Feast", // Orange
	},
	{
		userId: 1,
		title: "'Culinary Creator' NFT - First Recipe Shared",
		description:
			"You shared your first recipe with the Yumazing community! Here's your Creator NFT.",
		imageUrl:
			"https://placehold.co/300x300/1E90FF/FFFFFF?text=Creator+NFT", // DodgerBlue
	},
	{
		userId: 1,
		title: "'Yumazing Pioneer' Badge",
		description:
			"Thanks for being one of our early adopters and cooking 10 recipes!",
		imageUrl: "https://placehold.co/300x300/8A2BE2/FFFFFF?text=Pioneer", // BlueViolet
	},
	{
		userId: 1,
		title: "'Recipe Reviewer' Token Bonus",
		description:
			"You've reviewed 5 recipes and helped the community! Enjoy some bonus YUM tokens.",
		imageUrl:
			"https://placehold.co/300x300/FFD700/000000?text=Review+Bonus", // Gold
	},
	{
		userId: 1,
		title: "'Summer Grill Master' NFT",
		description:
			"Completed the 'Ultimate Summer BBQ' challenge. Mint your Grill Master NFT!",
		imageUrl: "https://placehold.co/300x300/DC143C/FFFFFF?text=Grill+NFT", // Crimson
	},
	{
		userId: 1,
		title: "'Global Gastronome' Badge",
		description:
			"Recipes from 5 continents! Your kitchen knows no borders.",
		imageUrl:
			"https://placehold.co/300x300/20B2AA/FFFFFF?text=Global+Taste", // LightSeaGreen
	},
]; 