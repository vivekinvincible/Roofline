import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RooflineLayout from '@/components/RooflineLayout';

// UseCase 1: The "Big Three" Mortgage Pack Logic
const GET_MORTGAGE_PACK = (country: 'IE' | 'ES', vaultData: any) => {
  return [
    { 
      id: 'identity', 
      title: 'Identity', 
      icon: 'person-outline', 
      desc: country === 'IE' ? 'Passport & PPS' : 'Passport & NIE',
      count: vaultData?.id_count || 0, 
      color: '#10B981' 
    },
    { 
      id: 'income', 
      title: 'Income', 
      icon: 'briefcase-outline', 
      desc: country === 'IE' ? '3 Months Payslips + P60' : 'Nominas + Certificado',
      count: vaultData?.income_count || 0, 
      color: '#6366F1' 
    },
    { 
      id: 'funds', 
      title: 'Funds', 
      icon: 'wallet-outline', 
      desc: 'Proof of Deposit',
      count: vaultData?.funds_count || 0, 
      color: '#F59E0B' 
    },
  ];
};

export default function SecureVault() {
  const [country, setCountry] = useState<'IE' | 'ES'>('IE');
  const [loading, setLoading] = useState(false);
  
  // State for UseCase 3 (Alerts) and UseCase 5 (Costs)
  const [vaultData, setVaultData] = useState({
    readiness: 0.65,
    alerts: [{ type: 'Passport', days: 12 }], // Mocking backend logic
    costs: { tax: 4500, fees: 2100 },
    id_count: 2,
    income_count: 1,
    funds_count: 0
  });

  useEffect(() => {
    // In production, trigger: GET /vault/status/1?country={country}
    refreshVault();
  }, [country]);

  const refreshVault = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => setLoading(false), 800);
  };

  const mortgagePack = useMemo(() => GET_MORTGAGE_PACK(country, vaultData), [country, vaultData]);

  return (
    <RooflineLayout>
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <View style={styles.vaultHeader}>
          <View>
            <Text style={styles.title}>Secure Vault</Text>
            <View style={styles.encryptionBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10B981" />
              <Text style={styles.encryptionText}>AES-256 ENCRYPTED</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.biometricBtn}>
            <Ionicons name="finger-print" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* --- COUNTRY SELECTOR --- */}
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

        {/* --- USECASE 3: SMART EXPIRY ALERTS --- */}
        {vaultData.alerts.map((alert, index) => (
          <View key={index} style={styles.alertBanner}>
            <Ionicons name="warning" size={20} color="#991B1B" />
            <Text style={styles.alertText}>
              Your <Text style={{fontWeight: '800'}}>{alert.type}</Text> expires in {alert.days} days. Renew to avoid closing delays.
            </Text>
          </View>
        ))}

        {/* --- USECASE 1 & 5: READINESS & COST TRACKER --- */}
        <View style={styles.readinessCard}>
          <View style={styles.readinessHeader}>
            <Text style={styles.readinessLabel}>Mortgage Readiness</Text>
            <Text style={styles.readinessPercent}>{Math.round(vaultData.readiness * 100)}%</Text>
          </View>
          
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${vaultData.readiness * 100}%` }]} />
          </View>

          {/* UseCase 5: Budget Snapshot (Cost of Purchase Tracker) */}
          <View style={styles.budgetGrid}>
            <View style={styles.budgetItems}>
              <Text style={styles.budgetValue}>€{vaultData.costs.tax.toLocaleString()}</Text>
              <Text style={styles.budgetLabel}>{country === 'IE' ? 'Stamp Duty' : 'ITP Tax'}</Text>
            </View>
            <View style={styles.budgetDivider} />
            <View style={styles.budgetItems}>
              <Text style={styles.budgetValue}>€{vaultData.costs.fees.toLocaleString()}</Text>
              <Text style={styles.budgetLabel}>Notary & Legal</Text>
            </View>
          </View>
        </View>

        {/* --- FOLDER LIST --- */}
        <Text style={styles.sectionLabel}>The "Big Three" Mortgage Pack</Text>
        {mortgagePack.map((item) => (
          <TouchableOpacity key={item.id} style={styles.docRow}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.docTitle}>{item.title}</Text>
              <Text style={styles.docDesc}>{item.desc}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: item.count > 0 ? '#10B981' : '#64748B' }]}>
                {item.count > 0 ? `${item.count} Files` : 'Missing'}
              </Text>
              <Ionicons 
                name={item.count > 0 ? "checkmark-circle" : "chevron-forward"} 
                size={18} 
                color={item.count > 0 ? "#10B981" : "#CBD5E1"} 
              />
            </View>
          </TouchableOpacity>
        ))}

        {/* --- USECASE 4: DIRECT SHARING --- */}
        <TouchableOpacity style={styles.shareBanner} activeOpacity={0.8}>
          <View style={styles.shareIconCircle}>
            <Ionicons name="send" size={18} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.shareTitle}>One-Click Mortgage Pack</Text>
            <Text style={styles.shareSubtitle}>Share encrypted docs with your {country === 'IE' ? 'Solicitor' : 'Abogado'}</Text>
          </View>
        </TouchableOpacity>

        <View style={{height: 120}} />
      </ScrollView>

      {/* --- FLOATING UPLOAD --- */}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("Upload", "Select file source...")}>
        <Ionicons name="cloud-upload" size={26} color="#FFF" />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#F8FAFC' },
  vaultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  encryptionBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  encryptionText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  biometricBtn: { padding: 12, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },

  selectorContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#0F172A', fontWeight: '700' },

  // UseCase 3: Alert styles
  alertBanner: { backgroundColor: '#FEF2F2', borderLeftWidth: 4, borderLeftColor: '#EF4444', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  alertText: { flex: 1, color: '#991B1B', fontSize: 13, lineHeight: 18 },

  // Readiness & Budget
  readinessCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  readinessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  readinessLabel: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  readinessPercent: { fontSize: 22, fontWeight: '900', color: '#4F46E5' },
  progressTrack: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4F46E5' },
  
  // UseCase 5: Budget Tracker styles
  budgetGrid: { flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  budgetItems: { flex: 1, alignItems: 'center' },
  budgetValue: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  budgetLabel: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '600' },
  budgetDivider: { width: 1, height: '80%', backgroundColor: '#E2E8F0' },

  sectionLabel: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  docRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  docTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  docDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // UseCase 4: Share Banner
  shareBanner: { backgroundColor: '#EEF2FF', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: '#C7D2FE' },
  shareIconCircle: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  shareTitle: { fontSize: 15, fontWeight: '800', color: '#3730A3' },
  shareSubtitle: { fontSize: 12, color: '#4F46E5', marginTop: 1 },

  fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: '#4F46E5', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#4F46E5', shadowOpacity: 0.4, shadowRadius: 12 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }
});