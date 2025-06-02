
const API_BASE_URL = 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface MongoWallet {
  _id: string;
  userId: string;
  balance: number;
  roundupTotal: number;
  rewardsEarned: number;
  lastTransactionDate: string;
  transactions: any[];
}

interface MongoEduScore {
  _id: string;
  userId: string;
  score: number;
  completedLessons: string[];
  lastUpdated: string;
}

class MongoAPI {
  private getToken(): string | null {
    return localStorage.getItem('mongo_token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Auth methods
  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, fullName })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('mongo_token', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('mongo_token', data.token);
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        localStorage.removeItem('mongo_token');
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('mongo_token');
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('mongo_token');
  }

  // Wallet methods
  async getWallet(): Promise<MongoWallet> {
    const response = await fetch(`${API_BASE_URL}/wallet`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch wallet');
    }

    return response.json();
  }

  async addRoundUp(amount: number, description: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/wallet/roundup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, description })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add round-up');
    }

    return response.json();
  }

  async addDeposit(amount: number, description: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, description })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add deposit');
    }

    return response.json();
  }

  // EduScore methods
  async getEduScore(): Promise<MongoEduScore> {
    const response = await fetch(`${API_BASE_URL}/edu-score`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch EduScore');
    }

    return response.json();
  }

  async completeLesson(lessonId: string, pointsEarned: number = 10): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/edu-score/complete-lesson`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ lessonId, pointsEarned })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete lesson');
    }

    return response.json();
  }

  // Sync methods
  async syncFromSupabase(supabaseUserId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sync/from-supabase`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ supabaseUserId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync from Supabase');
    }

    return response.json();
  }

  async getSyncStatus(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sync/status`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get sync status');
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const mongoAPI = new MongoAPI();
export default mongoAPI;
