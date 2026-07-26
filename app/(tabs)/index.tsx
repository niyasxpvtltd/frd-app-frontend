import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar as RNStatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '@/services/storage';

const { width, height } = Dimensions.get('window');

interface ConnectUser {
  id: string;
  name: string;
  language: string;
  avatar: string;
  bgCardColor: string;
  btnColor: string;
  langBgColor: string;
  langTextColor: string;
  online: boolean;
}

const CONNECT_PROFILES: ConnectUser[] = [
  {
    id: '1',
    name: 'Nila',
    language: 'தமிழ்',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bgCardColor: '#FFF0F4',
    btnColor: '#FF4B72',
    langBgColor: '#FCE7F3',
    langTextColor: '#DB2777',
    online: true,
  },
  {
    id: '2',
    name: 'Arun',
    language: 'தமிழ்',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bgCardColor: '#EBF5FF',
    btnColor: '#3B82F6',
    langBgColor: '#DBEAFE',
    langTextColor: '#1D4ED8',
    online: true,
  },
  {
    id: '3',
    name: 'Priya',
    language: 'English',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bgCardColor: '#F0FDF4',
    btnColor: '#10B981',
    langBgColor: '#D1FAE5',
    langTextColor: '#047857',
    online: true,
  },
  {
    id: '4',
    name: 'Vikram',
    language: 'Hindi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bgCardColor: '#FAF5FF',
    btnColor: '#8B5CF6',
    langBgColor: '#EDE9FE',
    langTextColor: '#6D28D9',
    online: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('Friend');
  const [coinsBalance, setCoinsBalance] = useState(120);

  // Dynamic status bar and bottom inset calculations
  const topPadding = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 10);
  const bottomPadding = (insets.bottom > 0 ? insets.bottom : 10) + 64;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await storage.getUser();
    if (userData && userData.profile && userData.profile.fullName) {
      setUserName(userData.profile.fullName.split(' ')[0]);
    }
  };

  const handleVoiceCall = (name: string) => {
    alert(`Connecting 5-minute instant call with ${name}...`);
  };

  const handleLogout = async () => {
    await storage.clearSession();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="light-content" backgroundColor="#FF4B72" translucent />
      <View
        style={[
          styles.mainScreenContainer,
          {
            paddingTop: topPadding + 4,
            paddingBottom: bottomPadding,
          },
        ]}
      >
        {/* TOP NAVIGATION BAR */}
        <View style={styles.topBar}>
          {/* Left User Profile Avatar */}
          <TouchableOpacity onPress={() => router.push('/onboarding')} style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
              }}
              style={styles.userAvatar}
            />
            <View style={styles.onlineBadge} />
          </TouchableOpacity>

          {/* Center Coins Balance Pill */}
          <View style={styles.coinPill}>
            <View style={styles.coinIconCircle}>
              <Text style={styles.coinEmoji}>🪙</Text>
            </View>
            <Text style={styles.coinCountText}>{coinsBalance}</Text>
          </View>

          {/* Right Action Icons */}
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.trophyBtn} onPress={() => alert('Daily Rewards & Trophies!')}>
              <Ionicons name="trophy" size={20} color="#F59E0B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO WELCOME BANNER */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#FFF5F8', '#FFEBEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroLeft}>
              <Text style={styles.greetingText}>Good Evening 👋</Text>
              <Text style={styles.welcomeHeading}>
                Welcome to <Text style={styles.brandHighlight}>BAE</Text>
              </Text>
              <Text style={styles.subHeadingText}>
                Make real connections, have fun & stay safe
              </Text>
            </View>

            {/* Heart Illustration Graphic */}
            <View style={styles.heroGraphic}>
              <View style={styles.heartGraphicContainer}>
                <Ionicons name="heart" size={44} color="#FF4B72" />
                <View style={styles.smallHeartFloating}>
                  <Ionicons name="heart" size={22} color="#FF8E53" />
                </View>
                <View style={styles.sparkleIcon}>
                  <Ionicons name="sparkles" size={14} color="#F59E0B" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* SECTION HEADER: BAE CONNECT */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.brandPink}>BAE</Text> Connect
          </Text>

          <TouchableOpacity style={styles.randomChip} onPress={() => alert('Finding random online match...')}>
            <Text style={styles.randomChipText}>Random</Text>
            <Ionicons name="shuffle-outline" size={14} color="#4F46E5" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL CONNECT CARDS */}
        <View style={styles.cardsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {/* VOICE CALL INSTANT CONNECT CARD (POPULAR FEATURED) */}
            <TouchableOpacity
              style={styles.featuredCallCard}
              onPress={() => handleVoiceCall('Instant Match')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF3B70', '#FF6584']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.featuredGradient}
              >
                <View style={styles.popularBadge}>
                  <Ionicons name="flame" size={11} color="#D97706" />
                  <Text style={styles.popularBadgeText}>Popular</Text>
                </View>

                <Text style={styles.featuredTitle}>Voice Call</Text>
                <Text style={styles.featuredSubTitle}>Instant Connect</Text>

                <View style={styles.coupleIllustrationRow}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                    }}
                    style={styles.coupleAvatarLeft}
                  />
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    }}
                    style={styles.coupleAvatarRight}
                  />
                </View>

                <View style={styles.whiteCallBtn}>
                  <Ionicons name="call" size={14} color="#FF3B70" />
                  <Text style={styles.whiteCallBtnText}>FREE 5 mins</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* DYNAMIC USER CARDS */}
            {CONNECT_PROFILES.map((profile) => (
              <View
                key={profile.id}
                style={[styles.userCard, { backgroundColor: profile.bgCardColor }]}
              >
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: profile.avatar }} style={styles.userCardAvatar} />
                  <View style={styles.onlineDot} />
                </View>

                <View style={[styles.langChip, { backgroundColor: profile.langBgColor }]}>
                  <Text style={[styles.langText, { color: profile.langTextColor }]}>
                    {profile.language}
                  </Text>
                </View>

                <Text style={styles.userNameText}>{profile.name}</Text>

                <TouchableOpacity
                  style={[styles.userCallBtn, { backgroundColor: profile.btnColor }]}
                  onPress={() => handleVoiceCall(profile.name)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="call" size={13} color="#FFFFFF" />
                  <Text style={styles.userCallBtnText}>FREE 5 mins</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* INVITE & EARN BANNER */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteLeft}>
            <Text style={styles.inviteTitle}>Invite & Earn</Text>
            <Text style={styles.inviteSubtitle}>
              Invite friends & earn coins 🪙
            </Text>
          </View>

          <View style={styles.giftIconBox}>
            <Text style={{ fontSize: 28 }}>🎁</Text>
          </View>

          <TouchableOpacity style={styles.inviteBtn} onPress={() => alert('Sharing invite link!')}>
            <Text style={styles.inviteBtnText}>Invite Now</Text>
            <Ionicons name="chevron-forward" size={12} color="#FF4B72" />
          </TouchableOpacity>
        </View>

        {/* 100% SAFE & SECURE BANNER */}
        <View style={styles.securityCard}>
          <View style={styles.securityIconBox}>
            <Ionicons name="shield-checkmark" size={26} color="#6C5CE7" />
            <View style={styles.securityCheckBadge}>
              <Ionicons name="checkmark" size={8} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.securityMiddle}>
            <Text style={styles.securityTitle}>100% Safe & Secure</Text>
            <Text style={styles.securitySubtitle}>
              Your privacy is our priority. Connect with confidence.
            </Text>
          </View>

          <TouchableOpacity style={styles.learnMoreBtn} onPress={() => alert('Safety Guidelines')}>
            <Text style={styles.learnMoreBtnText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF4B72',
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4B72',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  coinIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinEmoji: {
    fontSize: 14,
  },
  coinCountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trophyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuNotificationDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B72',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },

  /* HERO WELCOME BANNER */
  heroCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 2,
  },
  welcomeHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  brandHighlight: {
    color: '#FF4B72',
    fontWeight: '900',
  },
  subHeadingText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },

  heroGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartGraphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
  },
  smallHeartFloating: {
    position: 'absolute',
    top: -4,
    right: -2,
  },
  sparkleIcon: {
    position: 'absolute',
    bottom: 0,
    left: -4,
  },

  /* SECTION HEADER */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  brandPink: {
    color: '#FF4B72',
  },
  randomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  randomChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  /* HORIZONTAL CARDS WRAPPER */
  cardsWrapper: {
    height: 195,
    marginBottom: 8,
  },
  horizontalScrollContent: {
    gap: 12,
    paddingRight: 16,
  },

  /* Featured Call Card */
  featuredCallCard: {
    width: 130,
    height: 195,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#FF3B70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  featuredGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 3,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  featuredSubTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  coupleIllustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  coupleAvatarLeft: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: -8,
    zIndex: 2,
  },
  coupleAvatarRight: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  whiteCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  whiteCallBtnText: {
    color: '#FF3B70',
    fontSize: 11,
    fontWeight: '800',
  },

  /* User Profile Cards */
  userCard: {
    width: 124,
    height: 195,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 2,
  },
  userCardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  userCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  userCallBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  /* INVITE CARD */
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F4',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  inviteLeft: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  inviteSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  giftIconBox: {
    paddingHorizontal: 6,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  inviteBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF4B72',
    marginRight: 2,
  },

  /* SECURITY CARD */
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  securityIconBox: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4B72',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityMiddle: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 1,
  },
  securitySubtitle: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
  },
  learnMoreBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  learnMoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
