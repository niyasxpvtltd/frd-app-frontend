import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, StatusBar as RNStatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { apiService } from '@/services/api';

export default function IndexScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      // 1. Retrieve token & saved session from secure storage
      const token = await storage.getToken();
      const savedUser = await storage.getUser();

      if (!token) {
        // No session found -> Redirect to Login screen
        console.log('[AUTH GATEWAY] No active session token found. Redirecting to /login');
        router.replace('/login');
        return;
      }

      // 2. Validate token & user profile with backend API
      const res = await apiService.getMe(token);

      if (res.success && res.data) {
        const hasProfile = res.data.hasProfile ?? savedUser?.hasProfile ?? false;

        if (hasProfile) {
          console.log('[AUTH GATEWAY] Session valid & profile complete. Redirecting to /(tabs)');
          router.replace('/(tabs)');
        } else {
          console.log('[AUTH GATEWAY] Session valid but profile incomplete. Redirecting to /onboarding');
          router.replace('/onboarding');
        }
      } else {
        // Token invalid or expired -> Clear session and redirect to /login
        console.warn('[AUTH GATEWAY] Invalid or expired token. Clearing session & redirecting to /login');
        await storage.clearSession();
        router.replace('/login');
      }
    } catch (error) {
      console.error('[AUTH GATEWAY] Error checking user session:', error);
      router.replace('/login');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" backgroundColor="#0D0E15" />
      <LinearGradient
        colors={['#FF4B72', '#6C5CE7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoBadge}
      >
        <Ionicons name="sparkles" size={40} color="#FFFFFF" />
      </LinearGradient>

      <Text style={styles.brandName}>FRD</Text>
      <Text style={styles.tagline}>Dating & Friends</Text>

      <ActivityIndicator size="large" color="#FF4B72" style={styles.spinner} />
      <Text style={styles.loadingText}>Checking session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0E15',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
});
