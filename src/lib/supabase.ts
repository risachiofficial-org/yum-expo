import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
// import * as dotenv from 'dotenv';

// dotenv.config(); // Ensure environment variables are loaded

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		"SUPABASE_URL or SUPABASE_ANON_KEY is not set in .env file. Please ensure these are correctly configured before starting the application.",
	);
}

// Initialize Supabase client
// We cast to SupabaseClient as createClient can return SupabaseClient | null based on inputs,
// but our check above ensures they are present.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false, // Important for React Native
	},
}) as SupabaseClient;

// Example usage:
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
