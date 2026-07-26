import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar as RNStatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services/api';
import { storage } from '@/services/storage';

export default function LoginScreen() {
  const router = useRouter();

  // Auth Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Demo Autofill
  const handleQuickDemo = () => {
    setErrorMessage(null);
    setEmail('alex.frd@example.com');
    setPassword('password123');
  };

  // Auth Submit (Login / Signup)
  const handleAuthSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (authMode === 'signup' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        // LOGIN API CALL
        const res = await apiService.login({ email: email.trim(), password });
        setIsLoading(false);

        if (res.success && res.data) {
          // Store token & user securely on mobile app
          await storage.saveToken(res.data.token);
          await storage.saveUser(res.data.user);

          setSuccessMessage('Login successful!');

          setTimeout(() => {
            if (res.data?.hasProfile) {
              router.replace('/(tabs)');
            } else {
              router.replace('/onboarding');
            }
          }, 600);
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      } else {
        // SIGNUP API CALL
        const res = await apiService.signup({ email: email.trim(), password });
        setIsLoading(false);

        if (res.success && res.data) {
          // Store token & user securely on mobile app
          await storage.saveToken(res.data.token);
          await storage.saveUser(res.data.user);

          setSuccessMessage('Account created! Let us set up your profile.');

          setTimeout(() => {
            router.replace('/onboarding');
          }, 600);
        } else {
          setErrorMessage(res.message || 'Registration failed. Try a different email.');
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Network error. Unable to reach authentication server.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="light-content" backgroundColor="#0D0E15" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Branding */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#FF4B72', '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBadge}
            >
              <Ionicons name="sparkles" size={34} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>FRD</Text>
              <View style={styles.appTagBadge}>
                <Text style={styles.appTagText}>Dating & Friends</Text>
              </View>
            </View>
            <Text style={styles.tagline}>
              Find your vibe. Connect, Date & Make Real Friends.
            </Text>
          </View>

          {/* Mode Switcher: Sign In / Create Account */}
          <View style={styles.authModeContainer}>
            <TouchableOpacity
              style={[
                styles.authModeTab,
                authMode === 'login' && styles.authModeTabActive,
              ]}
              onPress={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.authModeText,
                  authMode === 'login' && styles.authModeTextActive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.authModeTab,
                authMode === 'signup' && styles.authModeTabActive,
              ]}
              onPress={() => {
                setAuthMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.authModeText,
                  authMode === 'signup' && styles.authModeTextActive,
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <View style={styles.cardContainer}>
            {/* Feedback Banners */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.labelWithLink}>
                <Text style={styles.fieldLabel}>Password</Text>
                {authMode === 'login' && (
                  <TouchableOpacity onPress={() => alert('Password reset link sent to your email.')}>
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleQuickDemo}>
                <Text style={styles.demoFillText}>✨ Quick Demo Fill</Text>
              </TouchableOpacity>
            </View>

            {/* Main Submit Button */}
            <TouchableOpacity
              style={styles.submitBtnTouchable}
              onPress={handleAuthSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FF4B72', '#6C5CE7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.submitBtnContent}>
                    <Text style={styles.submitBtnText}>
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch Footer Link */}
            <TouchableOpacity
              style={styles.switchAuthRow}
              onPress={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              <Text style={styles.switchAuthText}>
                {authMode === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.switchAuthHighlight}>
                  {authMode === 'login' ? 'Create Account' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to FRD's{' '}
              <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0E15',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 30 : 20,
    paddingBottom: 40,
  },

  /* Header */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  appTagBadge: {
    backgroundColor: 'rgba(255, 75, 114, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 114, 0.4)',
  },
  appTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF4B72',
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  /* Auth Mode Switcher */
  authModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#171925',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#26293B',
  },
  authModeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  authModeTabActive: {
    backgroundColor: '#26293B',
  },
  authModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  authModeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Card */
  cardContainer: {
    backgroundColor: '#161824',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  /* Fields */
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  labelWithLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 13,
    color: '#FF4B72',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2132',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D3248',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },

  /* Options Row */
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF4B72',
    borderColor: '#FF4B72',
  },
  rememberText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  demoFillText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Submit Button */
  submitBtnTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitGradient: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Switch Auth Row */
  switchAuthRow: {
    alignItems: 'center',
    marginTop: 18,
  },
  switchAuthText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  switchAuthHighlight: {
    color: '#FF4B72',
    fontWeight: '700',
  },

  /* Footer */
  footerContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  termsText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  termsHighlight: {
    color: '#CBD5E1',
    textDecorationLine: 'underline',
  },
});
