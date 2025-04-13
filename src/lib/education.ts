
import { supabase, checkSupabaseConfig } from './supabase';
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
      completedLessons: 0,
      totalLessons: 15,
      availableRewards: 0,
      lastCompleted: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting learning progress:', error);
    // Return fallback data for demo purposes
    return {
      completedLessons: 0, 
      totalLessons: 15,
      availableRewards: 0,
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
      score: 0,
      change: 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting EduScore:', error);
    // Instead of rethrowing, return fallback data for demo purposes
    return {
      score: 0,
      change: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

export const completeLesson = async (lessonId: string) => {
  try {
    checkSupabaseConfig();
    
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // In a real app, this would update the learning_progress table
    // For demo, we'll just return success
    
    // Simulate updating EduScore
    return {
      success: true,
      scoreEarned: 10,
    };
  } catch (error) {
    console.error('Error completing lesson:', error);
    throw error;
  }
};
