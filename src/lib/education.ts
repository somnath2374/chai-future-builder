
import { checkSupabaseConfig } from './supabase';
import { getCurrentUser } from './auth';

export const getLearningProgress = async () => {
  try {
    checkSupabaseConfig();
    
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real app, this would fetch from a learning_progress table
    // For demo, we'll return static data
    return {
      completedLessons: 8,
      totalLessons: 15,
      availableRewards: 3,
      lastCompleted: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting learning progress:', error);
    // Return fallback data for demo purposes
    return {
      completedLessons: 8, 
      totalLessons: 15,
      availableRewards: 3,
      lastCompleted: new Date().toISOString()
    };
  }
};

export const getEduScore = async () => {
  try {
    checkSupabaseConfig();
    
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real app, this would calculate based on savings behavior, learning progress, etc.
    // For demo, we'll return static data
    return {
      score: 720,
      change: 15,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting EduScore:', error);
    // Rethrow so the component can handle the error
    throw error;
  }
};
