import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import RooflineLayoutSignout from '@/components/RooflineLayoutSignout';
import { PropertyList } from '@/components/PropertyList'; 
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function LandingPage() {
  // --- STATE FOR FILTERING ---
  const [selectedCountry, setSelectedCountry] = useState('IE');
  const [searchText, setSearchText] = useState(''); // Tracks typing
  const [appliedSearch, setAppliedSearch] = useState(''); // Tracks "Discover" clicks

  // --- HANDLE SEARCH ACTION ---
  const handleSearch = () => {
    console.log("Searching for:", searchText);
    setAppliedSearch(searchText); // This triggers the PropertyList update
  };

  return (
    <RooflineLayoutSignout>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Your path to property in {'\n'}
            <Text style={styles.heroTitleAccent}>Ireland & Spain.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Analyze your finances, compare mortgage rates between Dublin and Madrid, 
            and securely store your documents for a one-click application.
          </Text>

          {/* Search Bar - UPDATED */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search areas (e.g. Malaga, Wicklow...)"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch} // Trigger on "Enter" key
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonText}>Discover Property</Text>
            </TouchableOpacity>
          </View>

          {/* --- COUNTRY TOGGLE TABS --- */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, selectedCountry === 'IE' && styles.activeTab]}
              onPress={() => setSelectedCountry('IE')}
            >
              <Text style={[styles.tabText, selectedCountry === 'IE' && styles.activeTabText]}>🇮🇪 Ireland</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, selectedCountry === 'ES' && styles.activeTab]}
              onPress={() => setSelectedCountry('ES')}
            >
              <Text style={[styles.tabText, selectedCountry === 'ES' && styles.activeTabText]}>🇪🇸 Spain</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- LIVE PROPERTY LIST SECTION --- */}
        <View style={styles.resultsSection}>
          <View style={styles.sectionHeaderInside}>
            <Text style={styles.sectionTitle}>
              {appliedSearch ? `Search Results for "${appliedSearch}"` : "Featured Listings"}
            </Text>
            <Text style={styles.sectionDescription}>
              Showing real-time results from your selected market.
            </Text>
          </View>
          
          {/* UPDATED: Passing searchQuery to the component */}
          <PropertyList 
            country={selectedCountry} 
            searchQuery={appliedSearch} 
          />
        </View>

        {/* ... Rest of your code (Market Intelligence, Features) remains the same ... */}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Market Intelligence</Text>
          <Text style={styles.sectionDescription}>
            We analyze real-time tax laws, mortgage interest rates, and purchasing costs 
            to give you a clear comparison.
          </Text>
        </View>

        <View style={styles.marketGrid}>
          {/* Ireland Card */}
          <View style={styles.marketCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.flag}>🇮🇪</Text>
              <View>
                <Text style={styles.avgRateLabel}>AVG. RATE</Text>
                <Text style={styles.avgRateValue}>3.85%</Text>
              </View>
            </View>
            <Text style={styles.countryName}>Ireland Mortgage</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Buying Costs (Stamp Duty)</Text>
              <Text style={styles.dataValue}>1.0%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Max Borrowing</Text>
              <Text style={styles.dataValue}>4.0x Gross Income</Text>
            </View>
          </View>

          {/* Spain Card */}
          <View style={styles.marketCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.flag}>🇪🇸</Text>
              <View>
                <Text style={styles.avgRateLabel}>AVG. RATE</Text>
                <Text style={styles.avgRateValue}>3.15%</Text>
              </View>
            </View>
            <Text style={styles.countryName}>Spain Mortgage</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Buying Costs (ITP/VAT)</Text>
              <Text style={styles.dataValue}>8.0% to 10.0%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Max Borrowing</Text>
              <Text style={styles.dataValue}>70% LTV (Non-Res)</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="lock-closed" size={24} color="#1E40AF" />
            </View>
            <Text style={styles.featureTitle}>Secure Vault</Text>
            <Text style={styles.featureText}>Save your payslips and IDs securely. Apply to multiple lenders with one click.</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="people" size={24} color="#92400E" />
            </View>
            <Text style={styles.featureTitle}>Local Agents</Text>
            <Text style={styles.featureText}>Instant connection to verified agents in Dublin, Barcelona, Marbella, or Cork.</Text>
          </View>
        </View>
      </ScrollView>
    </RooflineLayoutSignout>
  );
}

// ... Styles remain the same ...

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: isMobile ? 60 : 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC', // Soft background for the hero
  },
  heroTitle: {
    fontSize: isMobile ? 36 : 56,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
    lineHeight: isMobile ? 44 : 64,
  },
  heroTitleAccent: {
    color: '#4F46E5',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 650,
    marginTop: 24,
    lineHeight: 26,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 40,
    width: '100%',
    maxWidth: 700,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 }
    })
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0F172A',
  },
  searchButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  
  // --- TABS STYLING ---
  tabContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFF',
  },

  // --- RESULTS SECTION ---
  resultsSection: {
    paddingHorizontal: isMobile ? 20 : 60,
    marginTop: 40,
  },
  sectionHeaderInside: {
    marginBottom: 20,
  },

  sectionHeader: {
    paddingHorizontal: isMobile ? 20 : 60,
    marginTop: 80,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionDescription: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 10,
    maxWidth: 550,
    lineHeight: 22,
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    paddingHorizontal: isMobile ? 20 : 60,
    marginTop: 40,
  },
  marketCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  flag: {
    fontSize: 32,
  },
  avgRateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  avgRateValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
  },
  countryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 24,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dataLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20,
    marginTop: 100,
  },
  featureItem: {
    width: 300,
    alignItems: 'center',
    padding: 20,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});