import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import RooflineLayout from '../components/RooflineLayout';
import { PropertyList } from '../components/PropertyList';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [activeCountry, setActiveCountry] = useState<'IE' | 'ES'>('IE');

  return (
    <RooflineLayout>
      <ScrollView style={styles.container} stickyHeaderIndices={[1]}>
        {/* --- HERO SECTION --- */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Your path to property in <Text style={styles.highlight}>Ireland & Spain.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Ireland calculates Stamp Duty at 1% for properties under €1m. Solicitor fees are typically fixed.
          </Text>
        </View>

        {/* --- TOGGLE & SEARCH BAR --- */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBox}>
            <TextInput 
              placeholder="Search areas (e.g. Malaga, Wicklow...)" 
              style={styles.input}
            />
            <TouchableOpacity style={styles.discoverBtn}>
              <Text style={styles.discoverText}>Discover Property</Text>
            </TouchableOpacity>
          </View>

          {/* Country Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeCountry === 'IE' && styles.toggleActive]}
              onPress={() => setActiveCountry('IE')}
            >
              <Text style={activeCountry === 'IE' ? styles.toggleTextActive : styles.toggleText}>🇮🇪 IE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, activeCountry === 'ES' && styles.toggleActive]}
              onPress={() => setActiveCountry('ES')}
            >
              <Text style={activeCountry === 'ES' ? styles.toggleTextActive : styles.toggleText}>🇪🇸 ES</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PROPERTY LIST --- */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.resultCount}>102 Matching Properties for Sale</Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortText}>Best Match</Text>
              <Ionicons name="chevron-down" size={14} color="#4F46E5" />
            </TouchableOpacity>
          </View>
          
          <PropertyList country={activeCountry} />
        </View>
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: { padding: 40, alignItems: 'center', backgroundColor: '#F8FAFC' },
  heroTitle: { fontSize: 32, fontWeight: '800', textAlign: 'center', color: '#0F172A' },
  highlight: { color: '#4F46E5' },
  heroSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 15, maxWidth: 600 },
  searchBarContainer: { 
    padding: 20, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchBox: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    width: '50%',
    padding: 5
  },
  input: { flex: 1, paddingHorizontal: 15 },
  discoverBtn: { backgroundColor: '#0F172A', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  discoverText: { color: '#FFF', fontWeight: '700' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4 },
  toggleBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  toggleActive: { backgroundColor: '#4F46E5' },
  toggleText: { color: '#64748B', fontWeight: '700' },
  toggleTextActive: { color: '#FFF', fontWeight: '700' },
  listSection: { paddingHorizontal: 40, paddingBottom: 60 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30 },
  resultCount: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#E2E8F0', padding: 8, borderRadius: 8 },
  sortText: { fontWeight: '600', color: '#4F46E5' }
});