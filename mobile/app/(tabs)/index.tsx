import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function LandingPage() {
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

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search areas (e.g. Malaga, Wicklow...)"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Discover Property</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- MARKET INTELLIGENCE SECTION --- */}
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
            <TouchableOpacity style={styles.breakdownButton}>
              <Text style={styles.breakdownButtonText}>Full Breakdown</Text>
            </TouchableOpacity>
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
            <TouchableOpacity style={styles.breakdownButton}>
              <Text style={styles.breakdownButtonText}>Full Breakdown</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- FEATURES SECTION --- */}
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

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="stats-chart" size={24} color="#6B21A8" />
            </View>
            <Text style={styles.featureTitle}>Affordability Sync</Text>
            <Text style={styles.featureText}>We sync with your financial state to show properties you can actually afford.</Text>
          </View>
        </View>

      </ScrollView>
    </RooflineLayoutSignout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: isMobile ? 60 : 100,
    paddingBottom: 60,
    paddingHorizontal: 20,
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
  breakdownButton: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  breakdownButtonText: {
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