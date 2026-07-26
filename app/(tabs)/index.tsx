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
import { storage } from '@/services/storage';

const { width } = Dimensions.get('window');

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
  const [userName, setUserName] = useState('Friend');
  const [coinsBalance, setCoinsBalance] = useState(120);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
              <Ionicons name="trophy" size={22} color="#F59E0B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => alert('Menu Options')}>
              <Ionicons name="menu" size={20} color="#FFFFFF" />
              <View style={styles.menuNotificationDot} />
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
                <Ionicons name="heart" size={54} color="#FF4B72" />
                <View style={styles.smallHeartFloating}>
                  <Ionicons name="heart" size={26} color="#FF8E53" />
                </View>
                <View style={styles.sparkleIcon}>
                  <Ionicons name="sparkles" size={16} color="#F59E0B" />
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
            <Ionicons name="shuffle-outline" size={16} color="#4F46E5" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL CONNECT CARDS */}
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
              {/* Popular Badge */}
              <View style={styles.popularBadge}>
                <Ionicons name="flame" size={12} color="#D97706" />
                <Text style={styles.popularBadgeText}>Popular</Text>
              </View>

              <Text style={styles.featuredTitle}>Voice Call</Text>
              <Text style={styles.featuredSubTitle}>Instant Connect</Text>

              {/* Couple Avatar Illustration */}
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

              {/* Call Pill Button */}
              <View style={styles.whiteCallBtn}>
                <Ionicons name="call" size={16} color="#FF3B70" />
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
              {/* Avatar with Headphones & Online Dot */}
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: profile.avatar }} style={styles.userCardAvatar} />
                <View style={styles.onlineDot} />
              </View>

              {/* Language Tag */}
              <View style={[styles.langChip, { backgroundColor: profile.langBgColor }]}>
                <Text style={[styles.langText, { color: profile.langTextColor }]}>
                  {profile.language}
                </Text>
              </View>

              {/* User Name */}
              <Text style={styles.userNameText}>{profile.name}</Text>

              {/* Call Action Button */}
              <TouchableOpacity
                style={[styles.userCallBtn, { backgroundColor: profile.btnColor }]}
                onPress={() => handleVoiceCall(profile.name)}
                activeOpacity={0.85}
              >
                <Ionicons name="call" size={14} color="#FFFFFF" />
                <Text style={styles.userCallBtnText}>FREE 5 mins</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* INVITE & EARN BANNER */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteLeft}>
            <Text style={styles.inviteTitle}>Invite & Earn</Text>
            <Text style={styles.inviteSubtitle}>
              Invite your friends {'\n'}& earn coins 🪙
            </Text>
          </View>

          {/* Gift Box Graphic */}
          <View style={styles.giftIconBox}>
            <Text style={{ fontSize: 36 }}>🎁</Text>
          </View>

          {/* Invite Pill Button */}
          <TouchableOpacity style={styles.inviteBtn} onPress={() => alert('Sharing invite link!')}>
            <Text style={styles.inviteBtnText}>Invite Now</Text>
            <Ionicons name="chevron-forward" size={14} color="#FF4B72" />
          </TouchableOpacity>
        </View>

        {/* 100% SAFE & SECURE BANNER */}
        <View style={styles.securityCard}>
          <View style={styles.securityIconBox}>
            <Ionicons name="shield-checkmark" size={32} color="#6C5CE7" />
            <View style={styles.securityCheckBadge}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 40,
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  avatarContainer: {
    position: 'relative',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FF4B72',
  },
  onlineBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4B72',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  coinIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinEmoji: {
    fontSize: 16,
  },
  coinCountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuNotificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FF4B72',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },

  /* HERO WELCOME BANNER */
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 22,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 22,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  welcomeHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  brandHighlight: {
    color: '#FF4B72',
    fontWeight: '900',
  },
  subHeadingText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },

  heroGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartGraphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  smallHeartFloating: {
    position: 'absolute',
    top: -6,
    right: -4,
  },
  sparkleIcon: {
    position: 'absolute',
    bottom: 2,
    left: -4,
  },

  /* SECTION HEADER */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  randomChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },

  /* HORIZONTAL CARDS */
  horizontalScrollContent: {
    gap: 14,
    paddingRight: 18,
    marginBottom: 22,
  },

  /* Featured Call Card */
  featuredCallCard: {
    width: 148,
    height: 230,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#FF3B70',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  featuredGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  featuredSubTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  coupleIllustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  coupleAvatarLeft: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: -10,
    zIndex: 2,
  },
  coupleAvatarRight: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  whiteCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  whiteCallBtnText: {
    color: '#FF3B70',
    fontSize: 13,
    fontWeight: '800',
  },

  /* User Profile Cards */
  userCard: {
    width: 140,
    height: 230,
    borderRadius: 22,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 6,
  },
  userCardAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  userCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  userCallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  /* INVITE CARD */
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F4',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  inviteLeft: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  inviteSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  giftIconBox: {
    paddingHorizontal: 8,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  inviteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF4B72',
    marginRight: 2,
  },

  /* SECURITY CARD */
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 22,
    padding: 16,
    gap: 12,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF4B72',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityMiddle: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  learnMoreBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  learnMoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
