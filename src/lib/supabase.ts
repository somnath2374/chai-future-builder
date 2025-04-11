
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback to empty strings for development without causing crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your Supabase connection.');
}

// Initialize with fallback values to prevent runtime errors
// Note: API calls will fail gracefully if credentials are invalid
export const supabase = createClient(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Helper function to check if Supabase is configured
export const checkSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please set up your Supabase connection.');
  }
};
