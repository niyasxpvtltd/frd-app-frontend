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

const GENDER_OPTIONS = [
  { id: 'Female', label: 'Female', icon: 'woman-outline' },
  { id: 'Male', label: 'Male', icon: 'man-outline' },
  { id: 'Non-Binary', label: 'Non-Binary', icon: 'transgender-outline' },
  { id: 'Other', label: 'Other', icon: 'person-outline' },
];

export default function ProfileOnboardingScreen() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState('');
  const [selectedGender, setSelectedGender] = useState('Female');
  const [dob, setDob] = useState('');
  const [bio, setBio] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = async () => {
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!selectedGender) {
      setErrorMessage('Please select your gender.');
      return;
    }

    if (!dob.trim()) {
      setErrorMessage('Please enter your Date of Birth (DOB).');
      return;
    }

    setIsLoading(true);

    try {
      const token = await storage.getToken();
      if (!token) {
        setErrorMessage('Authentication session expired. Please log in again.');
        setIsLoading(false);
        router.replace('/login');
        return;
      }

      const res = await apiService.createProfile(
        {
          fullName: fullName.trim(),
          gender: selectedGender,
          dob: dob.trim(),
          bio: bio.trim() || undefined,
        },
        token
      );

      setIsLoading(false);

      if (res.success) {
        // Save profile to secure storage
        const currentUser = (await storage.getUser()) || {};
        await storage.saveUser({
          ...currentUser,
          hasProfile: true,
          profile: res.data,
        });

        // Navigate to main dashboard
        router.replace('/(tabs)');
      } else {
        setErrorMessage(res.message || 'Failed to save profile details.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Network error while saving profile. Please try again.');
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#FF4B72', '#6C5CE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBadge}
            >
              <Ionicons name="person-add" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Tell us a bit about yourself to find your best matches on FRD.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.cardContainer}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Full Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor="#64748B"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Gender *</Text>
              <View style={styles.genderGrid}>
                {GENDER_OPTIONS.map((g) => {
                  const isSelected = selectedGender === g.id;
                  return (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.genderChip, isSelected && styles.genderChipSelected]}
                      onPress={() => setSelectedGender(g.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={g.icon as any}
                        size={18}
                        color={isSelected ? '#FFFFFF' : '#94A3B8'}
                      />
                      <Text style={[styles.genderText, isSelected && styles.genderTextSelected]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Date of Birth (DOB) *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD or MM/DD/YYYY"
                  placeholderTextColor="#64748B"
                  value={dob}
                  onChangeText={setDob}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>

            {/* Bio (Optional) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Bio (Optional)</Text>
              <View style={[styles.inputWrapper, { height: 80, alignItems: 'flex-start', paddingTop: 10 }]}>
                <Ionicons name="document-text-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { textAlignVertical: 'top' }]}
                  placeholder="Share your vibe, hobbies, or interests..."
                  placeholderTextColor="#64748B"
                  multiline
                  numberOfLines={3}
                  value={bio}
                  onChangeText={setBio}
                />
              </View>
            </View>

            {/* Submit / Continue Button */}
            <TouchableOpacity
              style={styles.submitBtnTouchable}
              onPress={handleContinue}
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
                    <Text style={styles.submitBtnText}>Continue to App</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
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
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 16,
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

  /* Fields */
  fieldContainer: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
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

  /* Gender Grid */
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genderChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2132',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D3248',
    paddingVertical: 12,
    gap: 8,
  },
  genderChipSelected: {
    backgroundColor: '#FF4B72',
    borderColor: '#FF4B72',
  },
  genderText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Continue Button */
  submitBtnTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
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
});
