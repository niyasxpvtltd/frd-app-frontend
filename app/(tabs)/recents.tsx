import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RecentsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 10);
  const bottomPadding = (insets.bottom > 0 ? insets.bottom : 10) + 70;

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="light-content" backgroundColor="#FF4B72" translucent />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: topPadding, paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Recents</Text>
          <Text style={styles.subtitle}>Recent Call History & Matches</Text>
        </View>

        <View style={styles.historyItem}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>Nila</Text>
            <Text style={styles.time}>Voice Call • 5 mins ago</Text>
          </View>
          <TouchableOpacity style={styles.callBackBtn}>
            <Ionicons name="call" size={16} color="#FF4B72" />
          </TouchableOpacity>
        </View>

        <View style={styles.historyItem}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>Arun</Text>
            <Text style={styles.time}>Voice Call • 2 hours ago</Text>
          </View>
          <TouchableOpacity style={styles.callBackBtn}>
            <Ionicons name="call" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 20 },
  header: { marginBottom: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  info: { flex: 1, marginLeft: 14 },
  name: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  time: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  callBackBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
});
