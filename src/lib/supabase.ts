
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback to empty strings for development without causing crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
const hasSupabaseConfig = supabaseUrl && supabaseKey;

if (!hasSupabaseConfig) {
  console.error('Missing Supabase environment variables. Please check your Supabase connection.');
}

// Create a dummy client when credentials are missing to prevent runtime errors
const createDummyClient = () => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    })
  };
};

// Initialize with fallback to dummy client to prevent runtime errors
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createDummyClient() as any;

// Helper function to check if Supabase is configured
export const checkSupabaseConfig = () => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase configuration is missing. Please set up your Supabase connection.');
  }
};
