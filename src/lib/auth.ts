
import { supabase, checkSupabaseConfig } from './supabase';

export const signIn = async (email: string, password: string) => {
  checkSupabaseConfig();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  checkSupabaseConfig();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  checkSupabaseConfig();
  
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};
