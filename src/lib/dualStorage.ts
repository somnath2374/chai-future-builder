
import { supabase } from './supabase';
import { mongoAPI } from './mongoAPI';
import { useToast } from '@/hooks/use-toast';

interface DualStorageOptions {
  primaryStorage: 'supabase' | 'mongo';
  enableSync: boolean;
  fallbackOnError: boolean;
}

class DualStorageManager {
  private options: DualStorageOptions;

  constructor(options: DualStorageOptions = { 
    primaryStorage: 'supabase', 
    enableSync: true, 
    fallbackOnError: true 
  }) {
    this.options = options;
  }

  // Auth operations
  async signUp(email: string, password: string, fullName: string) {
    const results = { supabase: null, mongo: null, errors: [] };

    try {
      // Primary storage first
      if (this.options.primaryStorage === 'supabase') {
        results.supabase = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
      } else {
        results.mongo = await mongoAPI.register(email, password, fullName);
      }

      // Secondary storage
      if (this.options.enableSync) {
        try {
          if (this.options.primaryStorage === 'supabase') {
            results.mongo = await mongoAPI.register(email, password, fullName);
          } else {
            results.supabase = await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name: fullName } }
            });
          }
        } catch (error) {
          console.warn('Secondary storage signup failed:', error);
          results.errors.push(`Secondary storage error: ${error}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Primary storage signup failed:', error);
      
      if (this.options.fallbackOnError) {
        try {
          if (this.options.primaryStorage === 'supabase') {
            results.mongo = await mongoAPI.register(email, password, fullName);
          } else {
            results.supabase = await supabase.auth.signUp({
              email,
              password,
              options: { data: { full_name: fullName } }
            });
          }
        } catch (fallbackError) {
          console.error('Fallback storage also failed:', fallbackError);
          throw new Error('Both storage systems failed during signup');
        }
      } else {
        throw error;
      }

      return results;
    }
  }

  async signIn(email: string, password: string) {
    const results = { supabase: null, mongo: null, errors: [] };

    try {
      // Primary storage first
      if (this.options.primaryStorage === 'supabase') {
        results.supabase = await supabase.auth.signInWithPassword({ email, password });
      } else {
        results.mongo = await mongoAPI.login(email, password);
      }

      // Secondary storage
      if (this.options.enableSync) {
        try {
          if (this.options.primaryStorage === 'supabase') {
            results.mongo = await mongoAPI.login(email, password);
          } else {
            results.supabase = await supabase.auth.signInWithPassword({ email, password });
          }
        } catch (error) {
          console.warn('Secondary storage login failed:', error);
          results.errors.push(`Secondary storage error: ${error}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Primary storage login failed:', error);
      
      if (this.options.fallbackOnError) {
        try {
          if (this.options.primaryStorage === 'supabase') {
            results.mongo = await mongoAPI.login(email, password);
          } else {
            results.supabase = await supabase.auth.signInWithPassword({ email, password });
          }
        } catch (fallbackError) {
          console.error('Fallback storage also failed:', fallbackError);
          throw new Error('Both storage systems failed during login');
        }
      } else {
        throw error;
      }

      return results;
    }
  }

  // Wallet operations
  async addRoundUp(amount: number, description: string) {
    const results = { supabase: null, mongo: null, errors: [] };

    try {
      // Try both storages
      const promises = [];
      
      if (this.options.primaryStorage === 'supabase') {
        // Add to Supabase first, then MongoDB
        promises.push(this.addRoundUpToSupabase(amount, description));
        if (this.options.enableSync) {
          promises.push(mongoAPI.addRoundUp(amount, description));
        }
      } else {
        // Add to MongoDB first, then Supabase
        promises.push(mongoAPI.addRoundUp(amount, description));
        if (this.options.enableSync) {
          promises.push(this.addRoundUpToSupabase(amount, description));
        }
      }

      const promiseResults = await Promise.allSettled(promises);
      
      promiseResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (index === 0) {
            if (this.options.primaryStorage === 'supabase') {
              results.supabase = result.value;
            } else {
              results.mongo = result.value;
            }
          } else {
            if (this.options.primaryStorage === 'supabase') {
              results.mongo = result.value;
            } else {
              results.supabase = result.value;
            }
          }
        } else {
          results.errors.push(result.reason);
        }
      });

      return results;
    } catch (error) {
      console.error('Dual storage round-up failed:', error);
      throw error;
    }
  }

  private async addRoundUpToSupabase(amount: number, description: string) {
    // This would use your existing wallet functions
    // For brevity, returning a placeholder
    return { success: true, storage: 'supabase' };
  }

  // Sync operations
  async syncData() {
    try {
      // Get current user from both systems
      const supabaseUser = await supabase.auth.getUser();
      const mongoUser = await mongoAPI.getCurrentUser();

      if (supabaseUser.data.user && mongoUser) {
        // Sync from Supabase to MongoDB
        await mongoAPI.syncFromSupabase(supabaseUser.data.user.id);
        console.log('Data synced successfully between storages');
      }
    } catch (error) {
      console.error('Data sync failed:', error);
      throw error;
    }
  }

  // Health check for both systems
  async healthCheck() {
    const results = { supabase: false, mongo: false };

    try {
      // Check Supabase
      const { data } = await supabase.auth.getSession();
      results.supabase = true;
    } catch (error) {
      console.warn('Supabase health check failed:', error);
    }

    try {
      // Check MongoDB
      await mongoAPI.healthCheck();
      results.mongo = true;
    } catch (error) {
      console.warn('MongoDB health check failed:', error);
    }

    return results;
  }
}

// Export singleton instance
export const dualStorage = new DualStorageManager();
export default dualStorage;
