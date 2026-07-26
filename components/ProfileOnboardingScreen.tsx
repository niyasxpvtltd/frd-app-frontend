import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar as RNStatusBar,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const formatDateString = (dateObj: Date): string => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const applyProfileData = (rootObj: any): boolean => {
    if (!rootObj) return false;

    const candidates = [
      rootObj.profile,
      rootObj.data?.profile,
      rootObj.data,
      rootObj.user,
      rootObj,
    ];

    for (const c of candidates) {
      if (!c) continue;
      const name = c.fullName || c.full_name || c.name;
      const gender = c.gender;
      const dobVal = c.dob || c.date_of_birth || c.dateOfBirth;
      const bioVal = c.bio;

      if (name || gender || dobVal || bioVal) {
        setIsEditing(true);
        if (name) setFullName(String(name));
        if (gender) setSelectedGender(String(gender));
        if (dobVal) {
          setDob(String(dobVal));
          const parsed = new Date(String(dobVal));
          if (!isNaN(parsed.getTime())) {
            setSelectedDate(parsed);
          }
        }
        if (bioVal) setBio(String(bioVal));
        return true;
      }
    }
    return false;
  };

  const loadExistingProfile = async () => {
    try {
      setIsLoading(true);

      // 1. Instant pre-fill from local secure storage
      const userData = await storage.getUser();
      if (userData) {
        applyProfileData(userData);
      }

      // 2. Fetch fresh profile data from backend API
      const token = await storage.getToken();
      if (token) {
        const profileRes = await apiService.getMyProfile(token);
        if (profileRes.success && profileRes.data) {
          applyProfileData(profileRes.data);
        } else {
          const meRes = await apiService.getMe(token);
          if (meRes.success && meRes.data) {
            applyProfileData(meRes.data);
          }
        }
      }
    } catch (e) {
      console.log('[PROFILE] Error loading profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setDob(formatDateString(date));
    }
  };

  const handleContinue = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!selectedGender) {
      setErrorMessage('Please select your gender.');
      return;
    }

    if (!dob.trim()) {
      setErrorMessage('Please select your Date of Birth (DOB).');
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
        setSuccessMessage(isEditing ? 'Profile updated successfully!' : 'Profile saved successfully!');

        const updatedProfile = {
          fullName: fullName.trim(),
          gender: selectedGender,
          dob: dob.trim(),
          bio: bio.trim(),
        };

        const currentUser = (await storage.getUser()) || {};
        await storage.saveUser({
          ...currentUser,
          hasProfile: true,
          profile: updatedProfile,
          ...updatedProfile,
        });

        setTimeout(() => {
          router.replace('/(tabs)');
        }, 800);
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
        <View style={styles.mainScreenContainer}>
          {/* Top Bar with Back Button */}
          <View style={styles.topNavRow}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.backBtnText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#FF4B72', '#6C5CE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBadge}
            >
              <Ionicons name={isEditing ? 'create-outline' : 'person-add'} size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>{isEditing ? 'Edit Profile' : 'Complete Profile'}</Text>
            <Text style={styles.subtitle}>
              {isEditing
                ? 'Update your personal details & preferences.'
                : 'Tell us a bit about yourself to find your best matches.'}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.cardContainer}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Full Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
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
                        size={16}
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

            {/* Date of Birth Picker Button */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Date of Birth (DOB) *</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar" size={18} color="#FF4B72" style={styles.inputIcon} />
                <Text style={[styles.textInput, { paddingTop: 12, color: dob ? '#FFFFFF' : '#64748B' }]}>
                  {dob || 'Select Date of Birth'}
                </Text>
                <Ionicons name="chevron-down-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Bio (Optional) */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Bio (Optional)</Text>
              <View style={[styles.inputWrapper, { height: 52, alignItems: 'center' }]}>
                <Ionicons name="document-text-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Share your vibe, hobbies, or interests..."
                  placeholderTextColor="#64748B"
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
                    <Text style={styles.submitBtnText}>
                      {isEditing ? 'Save Changes' : 'Continue to App'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* DATE PICKER MODAL FOR IOS & WEB / ANDROID TRIGGER */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="slide" visible={showDatePicker}>
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Select Date of Birth</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.doneBtn}
                  >
                    <Text style={styles.doneBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  minimumDate={new Date(1950, 0, 1)}
                  onChange={handleDateChange}
                  textColor="#FFFFFF"
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
            onChange={handleDateChange}
          />
        )
      )}
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
  mainScreenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },

  topNavRow: {
    marginBottom: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Header */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  /* Card */
  cardContainer: {
    backgroundColor: '#161824',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 6,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 6,
  },
  successText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },

  /* Fields */
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2132',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3248',
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },

  /* Gender Grid */
  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2132',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3248',
    paddingVertical: 9,
    gap: 6,
  },
  genderChipSelected: {
    backgroundColor: '#FF4B72',
    borderColor: '#FF4B72',
  },
  genderText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Save Changes Button */
  submitBtnTouchable: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#FF4B72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitGradient: {
    height: 46,
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
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* DATE PICKER MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#161824',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneBtn: {
    backgroundColor: '#FF4B72',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
