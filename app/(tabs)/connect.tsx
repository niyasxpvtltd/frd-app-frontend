import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConnectScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect</Text>
          <Text style={styles.subtitle}>Instant Voice & Video Matches</Text>
        </View>

        <TouchableOpacity style={styles.matchCard}>
          <LinearGradient colors={['#FF4B72', '#6C5CE7']} style={styles.cardGradient}>
            <Ionicons name="call" size={48} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Instant Voice Match</Text>
            <Text style={styles.cardSub}>Tap to connect with someone new instantly</Text>
            <View style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start Call Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  matchCard: { borderRadius: 24, overflow: 'hidden', height: 260 },
  cardGradient: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginTop: 14 },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center' },
  startBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 20 },
  startBtnText: { color: '#FF4B72', fontWeight: '800', fontSize: 15 },
});
