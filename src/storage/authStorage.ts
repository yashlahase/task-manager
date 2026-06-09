import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@TaskFlow:authToken';
const EMAIL_KEY = '@TaskFlow:userEmail';
const USERS_KEY = '@TaskFlow:registeredUsers';
const TOKEN_EXPIRY_KEY = '@TaskFlow:tokenExpiry';

interface RegisteredUser {
  email: string;
  passwordHash: string; // Plain password for offline demonstration
}

const DEFAULT_USER: RegisteredUser = {
  email: 'user@example.com',
  passwordHash: 'password123',
};

export const authStorage = {
  async saveToken(token: string): Promise<boolean> {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // Add 7 days
      
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
      return true;
    } catch (error) {
      console.error('Error saving auth token to AsyncStorage:', error);
      return false;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const expiryStr = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!token || !expiryStr) {
        return null;
      }
      
      const expiryDate = new Date(expiryStr);
      const now = new Date();
      
      // If current date is past the expiry date, expire the session
      if (now > expiryDate) {
        await this.clearAuth();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting auth token from AsyncStorage:', error);
      return null;
    }
  },

  async removeToken(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
      return true;
    } catch (error) {
      console.error('Error removing auth token from AsyncStorage:', error);
      return false;
    }
  },

  async saveUserEmail(email: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(EMAIL_KEY, email);
      return true;
    } catch (error) {
      console.error('Error saving user email to AsyncStorage:', error);
      return false;
    }
  },

  async getUserEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(EMAIL_KEY);
    } catch (error) {
      console.error('Error getting user email from AsyncStorage:', error);
      return null;
    }
  },

  async getRegisteredUsers(): Promise<RegisteredUser[]> {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting registered users:', error);
      return [];
    }
  },

  async registerUser(email: string, password: string): Promise<boolean> {
    try {
      const users = await this.getRegisteredUsers();
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email already registered (or matches default user)
      if (normalizedEmail === DEFAULT_USER.email) {
        return false;
      }
      const exists = users.some(u => u.email === normalizedEmail);
      if (exists) {
        return false;
      }

      users.push({ email: normalizedEmail, passwordHash: password });
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  },

  async verifyCredentials(email: string, password: string): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Verify against default user
      if (normalizedEmail === DEFAULT_USER.email && password === DEFAULT_USER.passwordHash) {
        return true;
      }

      const users = await this.getRegisteredUsers();
      const user = users.find(u => u.email === normalizedEmail);
      if (user && user.passwordHash === password) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return false;
    }
  },

  async clearAuth(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, EMAIL_KEY, TOKEN_EXPIRY_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing auth state from AsyncStorage:', error);
      return false;
    }
  }
};

