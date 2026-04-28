import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import RooflineLayout from '@/components/RooflineLayout';
import { PropertyList } from '@/components/PropertyList';

export default function Home() {
  const [activeCountry, setActiveCountry] = useState<'IE' | 'ES'>('IE');
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleSearch = () => {
    // We use a browser alert as a backup to console logs
    // alert("Search Triggered: " + searchText); 
    console.log("CRITICAL_LOG: Button Pressed");
    setAppliedSearch(searchText);
  };

  return (
    <RooflineLayout>
      <View style={styles.container}>
        {/* --- HERO --- */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Your path to property in <Text style={styles.highlight}>Ireland & Spain.</Text>
          </Text>
        </View>

        {/* --- SEARCH SECTION --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <TextInput 
              placeholder="Search areas..." 
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            <Pressable 
              onPress={handleSearch}
              style={({ pressed }) => [
                styles.discoverBtn,
                { opacity: pressed ? 0.5 : 1 }
              ]}
            >
              <Text style={styles.discoverText}>Discover</Text>
            </Pressable>
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable 
              onPress={() => setActiveCountry('IE')}
              style={[styles.tgl, activeCountry === 'IE' && styles.tglActive]}
            >
              <Text style={activeCountry === 'IE' ? styles.tglTextActive : styles.tglText}>🇮🇪 IE</Text>
            </Pressable>
            <Pressable 
              onPress={() => setActiveCountry('ES')}
              style={[styles.tgl, activeCountry === 'ES' && styles.tglActive]}
            >
              <Text style={activeCountry === 'ES' ? styles.tglTextActive : styles.tglText}>🇪🇸 ES</Text>
            </Pressable>
          </View>
        </View>

        {/* --- LIST --- */}
        <View style={styles.listSection}>
          <Text style={styles.resultCount}>
            {appliedSearch ? `Matches for "${appliedSearch}"` : "Recent Properties"}
          </Text>
          <PropertyList country={activeCountry} searchQuery={appliedSearch} />
        </View>
      </View>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { padding: 40, backgroundColor: '#F8FAFC' },
  heroTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  highlight: { color: '#4F46E5' },
  searchSection: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    zIndex: 999, // Force this to be on top of everything
  },
  searchBarContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    flex: 1,
    maxWidth: 400,
    padding: 5,
    alignItems: 'center'
  },
  input: { flex: 1, paddingHorizontal: 10, height: 40 },
  discoverBtn: { backgroundColor: '#0F172A', padding: 10, borderRadius: 8 },
  discoverText: { color: '#FFF', fontWeight: 'bold' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4 },
  tgl: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  tglActive: { backgroundColor: '#4F46E5' },
  tglText: { color: '#64748B', fontWeight: 'bold' },
  tglTextActive: { color: '#FFF', fontWeight: 'bold' },
  listSection: { padding: 20 },
  resultCount: { fontSize: 20, fontWeight: '700', marginBottom: 20 }
});