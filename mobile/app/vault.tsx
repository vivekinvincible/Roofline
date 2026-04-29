import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RooflineLayout from '@/components/RooflineLayout';

// --- DYNAMIC DATA LOGIC ---
const GET_FOLDERS = (country: 'IE' | 'ES') => {
  const common = [
    { id: '1', title: 'Identity', icon: 'person-outline', count: 2, color: '#10B981' },
    { id: '2', title: 'Bank Statements', icon: 'document-text-outline', count: 0, color: '#64748B' },
  ];

  const regional = country === 'IE' 
    ? [
        { id: '3', title: 'PPS & Tax (P60)', icon: 'library-outline', count: 1, color: '#F59E0B' },
        { id: '4', title: 'Help to Buy', icon: 'home-outline', count: 0, color: '#64748B' },
      ]
    : [
        { id: '3', title: 'NIE & Residency', icon: 'card-outline', count: 1, color: '#F59E0B' },
        { id: '4', title: 'Spanish Tax (ITP)', icon: 'receipt-outline', count: 0, color: '#64748B' },
      ];

  return [...common, ...regional];
};

export default function SecureVault() {
  const [country, setCountry] = useState<'IE' | 'ES'>('IE');
  const [readiness] = useState(0.45); 

  const folders = useMemo(() => GET_FOLDERS(country), [country]);

  const handleUpload = () => {
    Alert.alert("Upload", `Adding document to ${country} requirements folder.`);
  };

  return (
    <RooflineLayout>
      <View style={styles.mainContainer}>
        
        {/* --- VAULT HEADER --- */}
        <View style={styles.vaultHeader}>
          <View>
            <Text style={styles.title}>Secure Vault</Text>
            <View style={styles.encryptionBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10B981" />
              <Text style={styles.encryptionText}>ENCRYPTED CLOUD STORAGE</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.biometricBtn}>
            <Ionicons name="finger-print" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* --- COUNTRY SELECTOR (UX IMPROVEMENT) --- */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity 
            style={[styles.tab, country === 'IE' && styles.activeTab]} 
            onPress={() => setCountry('IE')}
          >
            <Text style={[styles.tabText, country === 'IE' && styles.activeTabText]}>🇮🇪 Ireland</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, country === 'ES' && styles.activeTab]} 
            onPress={() => setCountry('ES')}
          >
            <Text style={[styles.tabText, country === 'ES' && styles.activeTabText]}>🇪🇸 Spain</Text>
          </TouchableOpacity>
        </View>

        {/* --- READINESS CARD --- */}
        <View style={styles.readinessCard}>
          <View style={styles.readinessInfo}>
            <Text style={styles.readinessLabel}>{country === 'IE' ? 'Mortgage' : 'Compra'} Readiness</Text>
            <Text style={styles.readinessPercent}>{Math.round(readiness * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${readiness * 100}%` }]} />
          </View>
          <Text style={styles.hintText}>
            Required: Upload your {country === 'IE' ? 'PPS Number' : 'NIE Certificate'} to proceed.
          </Text>
        </View>

        {/* --- FOLDER GRID --- */}
        <Text style={styles.sectionLabel}>Required Documents</Text>
        <View style={styles.grid}>
          {folders.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.folderCard}>
              <View style={[styles.iconBox, { backgroundColor: cat.color + '15' }]}>
                <Ionicons name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <View>
                <Text style={styles.folderTitle}>{cat.title}</Text>
                <Text style={styles.folderCount}>{cat.count} Files</Text>
              </View>
              {cat.count > 0 && (
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* --- ACTION BANNER --- */}
        <TouchableOpacity style={styles.actionBanner}>
          <Ionicons name="share-social-outline" size={20} color="#FFF" />
          <Text style={styles.actionText}>Share with {country === 'IE' ? 'Solicitor' : 'Abogado'}</Text>
        </TouchableOpacity>

        {/* --- FLOATING UPLOAD BUTTON --- */}
        <TouchableOpacity style={styles.fab} onPress={handleUpload}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>

      </View>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#F8FAFC' },
  vaultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  encryptionBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  encryptionText: { fontSize: 10, fontWeight: '700', color: '#64748B', letterSpacing: 0.5 },
  biometricBtn: { padding: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },

  // Selector Styles
  selectorContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 25 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#0F172A', fontWeight: '700' },

  readinessCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#E2E8F0' },
  readinessInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  readinessLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  readinessPercent: { fontSize: 16, fontWeight: '800', color: '#4F46E5' },
  progressTrack: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 4 },
  hintText: { fontSize: 13, color: '#64748B', marginTop: 10 },

  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  folderCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', minHeight: 120, justifyContent: 'space-between' },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  folderTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  folderCount: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  checkIcon: { position: 'absolute', top: 12, right: 12 },

  actionBanner: { backgroundColor: '#0F172A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, gap: 10, marginBottom: 120 },
  actionText: { color: '#FFF', fontWeight: '700', fontSize: 15 },

  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#4F46E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 8 },
});