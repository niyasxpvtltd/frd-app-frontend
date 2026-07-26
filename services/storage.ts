import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'frd_user_auth_token';
const USER_KEY = 'frd_user_profile_data';

// Helper for web platform fallback
const isWeb = Platform.OS === 'web';

export const storage = {
  // Save sensitive JWT token securely
  async saveToken(token: string): Promise<void> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.error('[STORAGE] Error saving secure token:', e);
    }
  },

  // Get secure JWT token
  async getToken(): Promise<string | null> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(TOKEN_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('[STORAGE] Error retrieving secure token:', e);
      return null;
    }
  },

  // Delete secure JWT token
  async removeToken(): Promise<void> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.error('[STORAGE] Error removing secure token:', e);
    }
  },

  // Save user object securely
  async saveUser(user: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(user);
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(USER_KEY, jsonValue);
        }
      } else {
        await SecureStore.setItemAsync(USER_KEY, jsonValue);
      }
    } catch (e) {
      console.error('[STORAGE] Error saving user data:', e);
    }
  },

  // Get saved user object
  async getUser(): Promise<any | null> {
    try {
      let jsonValue: string | null = null;
      if (isWeb) {
        if (typeof window !== 'undefined') {
          jsonValue = window.localStorage.getItem(USER_KEY);
        }
      } else {
        jsonValue = await SecureStore.getItemAsync(USER_KEY);
      }
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('[STORAGE] Error retrieving user data:', e);
      return null;
    }
  },

  // Clear entire user session
  async clearSession(): Promise<void> {
    await this.removeToken();
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(USER_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (e) {
      console.error('[STORAGE] Error clearing session:', e);
    }
  },
};
