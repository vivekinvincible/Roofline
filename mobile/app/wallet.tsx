import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RooflineLayout from '@/components/RooflineLayout';
import { PropertyList } from '@/components/PropertyList';

interface EligibilityMetrics {
  dti_ratio: number;
  is_dti_healthy: boolean;
  stress_test_monthly: number;
  repayment_capacity: number;
}

interface EligibilityResponse {
  max_price: number;
  loan_limit: number;
  closing_costs: number;
  metrics: EligibilityMetrics;
}

export default function WalletPage() {
  const [country, setCountry] = useState<'ireland' | 'spain'>('ireland');
  const [monthlyGross, setMonthlyGross] = useState('5000');
  const [monthlyDebt, setMonthlyDebt] = useState('350'); // Example: PCP or Loan
  const [currentRent, setCurrentRent] = useState('1200');
  const [monthlySavings, setMonthlySavings] = useState('500');
  const [totalSavings, setTotalSavings] = useState('65000');

  const [results, setResults] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    noOverdraft: true,
    noGambling: true,
    savingsConsistent: false,
    idValid: true
  });

  const fetchEligibility = useCallback(async () => {
    if (!monthlyGross || !totalSavings) return;
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.13:8000/calculate-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          monthly_gross: parseFloat(monthlyGross) || 0,
          monthly_debt: parseFloat(monthlyDebt) || 0,
          current_rent: parseFloat(currentRent) || 0,
          monthly_savings: parseFloat(monthlySavings) || 0,
          total_savings: parseFloat(totalSavings) || 0,
        }),
      });
      const data = await response.json();
      if (response.ok) setResults(data);
    } catch (error) {
      console.error("Eligibility API Error:", error);
    } finally {
      setLoading(false);
    }
  }, [country, monthlyGross, monthlyDebt, currentRent, monthlySavings, totalSavings]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchEligibility(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchEligibility]);

  const formatCurrency = (val: number | undefined) => 
    val ? `€${Math.round(val).toLocaleString()}` : '€0';

  // Logic to show how much "Buying Power" the loan is eating
  const debtPenalty = (parseFloat(monthlyDebt) || 0) * (country === 'ireland' ? 12 * 4 : 180);

  const handleShare = async () => {
    if (!results) return;
    await Share.share({
      message: `Hassle-Free Buying Power: ${formatCurrency(results.max_price)} in ${country}. DTI: ${results.metrics.dti_ratio}%.`
    });
  };

  return (
    <RooflineLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Buyer Roadmap</Text>
          <Text style={styles.subtitle}>Verified buying power & mortgage readiness checklist.</Text>
        </View>

        <View style={styles.mainGrid}>
          {/* LEFT COLUMN: INPUTS & READINESS */}
          <View style={styles.column}>
            <View style={styles.inputCard}>
              <View style={styles.switchRow}>
                <TouchableOpacity onPress={() => setCountry('ireland')} style={[styles.switchBtn, country === 'ireland' && styles.activeBtn]}>
                  <Text style={country === 'ireland' ? styles.activeText : styles.inactiveText}>🇮🇪 Ireland</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCountry('spain')} style={[styles.switchBtn, country === 'spain' && styles.activeBtn]}>
                  <Text style={country === 'spain' ? styles.activeText : styles.inactiveText}>🇪🇸 Spain</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Monthly Gross Income</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={monthlyGross} onChangeText={setMonthlyGross} />

              <Text style={styles.label}>Existing Loans / PCP (Monthly)</Text>
              <TextInput style={[styles.input, parseFloat(monthlyDebt) > 0 && styles.inputWarning]} keyboardType="numeric" value={monthlyDebt} onChangeText={setMonthlyDebt} />

              <View style={styles.dualInputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Current Rent</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={currentRent} onChangeText={setCurrentRent} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.label}>Savings /mo</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={monthlySavings} onChangeText={setMonthlySavings} />
                </View>
              </View>

              <Text style={styles.label}>Total Deposit Cash</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={totalSavings} onChangeText={setTotalSavings} />
            </View>

            <View style={styles.checklistCard}>
              <Text style={styles.cardTitle}>Bank Readiness (6mo)</Text>
              {Object.keys(checklist).map((key) => (
                <TouchableOpacity key={key} style={styles.checkRow} onPress={() => setChecklist(prev => ({...prev, [key]: !prev[key as keyof typeof checklist]}))}>
                  <Ionicons name={checklist[key as keyof typeof checklist] ? "checkmark-circle" : "ellipse-outline"} size={20} color={checklist[key as keyof typeof checklist] ? "#10B981" : "#CBD5E1"} />
                  <Text style={styles.checkText}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* RIGHT COLUMN: ELIGIBILITY & DEBT IMPACT */}
          <View style={styles.column}>
            <View style={styles.resultsCard}>
              <View style={styles.priceHeader}>
                <Text style={styles.resultsTitle}>ESTIMATED BUYING POWER</Text>
                {loading && <ActivityIndicator color="#6366F1" size="small" />}
              </View>
              
              <Text style={styles.mainPrice}>{formatCurrency(results?.max_price)}</Text>
              
              <View style={styles.statGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>LOAN LIMIT</Text>
                  <Text style={styles.statValue}>{formatCurrency(results?.loan_limit)}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>FEES/TAXES</Text>
                  <Text style={[styles.statValue, { color: '#F87171' }]}>-{formatCurrency(results?.closing_costs)}</Text>
                </View>
              </View>

              {/* LOAN IMPACT SECTION */}
              {parseFloat(monthlyDebt) > 0 && (
                <View style={styles.debtImpactBox}>
                  <Ionicons name="alert-circle" size={18} color="#FBBF24" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.debtImpactTitle}>Debt Penalty: -{formatCurrency(debtPenalty)}</Text>
                    <Text style={styles.debtImpactText}>Your PCP/Loans reduce your total house budget by this amount.</Text>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.metricRow}>
                <Ionicons name="speedometer-outline" size={22} color={results?.metrics.is_dti_healthy ? "#10B981" : "#FBBF24"} />
                <View style={styles.metricText}>
                  <Text style={styles.metricLabel}>DTI Ratio: {results?.metrics.dti_ratio}%</Text>
                  <Text style={styles.metricSub}>{results?.metrics.is_dti_healthy ? "Healthy borrowing levels." : "High debt. Approval may be difficult."}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareBtnText}>Share Eligibility Certificate</Text>
                <Ionicons name="share-outline" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>

            {/* REPAYMENT CAPACITY VISUAL */}
            <View style={styles.trendCard}>
              <Text style={styles.cardTitle}>Proven Repayment Capacity</Text>
              <View style={styles.chartArea}>
                 <View style={styles.chartBarGroup}>
                    <View style={[styles.bar, { height: 80, backgroundColor: '#6366F1' }]} />
                    <Text style={styles.barLabel}>Rent+Save</Text>
                    <Text style={styles.barValue}>{formatCurrency(results?.metrics.repayment_capacity)}</Text>
                 </View>
                 <Ionicons name="arrow-forward" size={20} color="#CBD5E1" style={{ marginBottom: 25 }} />
                 <View style={styles.chartBarGroup}>
                    <View style={[styles.bar, { height: 65, backgroundColor: '#0F172A' }]} />
                    <Text style={styles.barLabel}>Mortgage</Text>
                    <Text style={styles.barValue}>{formatCurrency((results?.loan_limit || 0) / 240)}</Text>
                 </View>
              </View>
              <Text style={styles.chartHint}>If Rent+Save is higher than Mortgage, banks see you as "Low Risk".</Text>
            </View>
          </View>
        </View>

        {results && results.max_price > 0 && (
          <View style={styles.propertySection}>
            <Text style={styles.sectionTitle}>Verified Matches for your Budget</Text>
            <PropertyList country={country === 'ireland' ? 'IE' : 'ES'} maxPrice={results.max_price} />
          </View>
        )}
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100, backgroundColor: '#F8FAFC' },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8 },
  mainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  column: { width: '100%', maxWidth: 420, gap: 20 },
  
  // Input Styles
  inputCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 11, fontWeight: '800', color: '#64748B', marginTop: 14, marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  inputWarning: { borderLeftWidth: 4, borderLeftColor: '#FBBF24' },
  dualInputRow: { flexDirection: 'row' },
  
  switchRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 14, marginBottom: 10 },
  switchBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11 },
  activeBtn: { backgroundColor: '#FFF', elevation: 3, shadowOpacity: 0.1 },
  activeText: { fontWeight: '800', color: '#0F172A' },
  inactiveText: { fontWeight: '600', color: '#94A3B8' },

  // Results Styles
  resultsCard: { backgroundColor: '#0F172A', padding: 28, borderRadius: 24 },
  mainPrice: { color: '#FFF', fontSize: 42, fontWeight: '900', marginVertical: 10 },
  resultsTitle: { color: '#6366F1', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statGrid: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12 },
  statLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '800' },
  statValue: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  
  debtImpactBox: { backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  debtImpactTitle: { color: '#FBBF24', fontSize: 12, fontWeight: '800' },
  debtImpactText: { color: '#94A3B8', fontSize: 11 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  metricRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  metricText: { flex: 1 },
  metricLabel: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  metricSub: { color: '#94A3B8', fontSize: 12 },

  shareBtn: { backgroundColor: '#6366F1', padding: 16, borderRadius: 14, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  shareBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  // Visual Roadmap
  checklistCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  checkText: { fontSize: 14, fontWeight: '600', color: '#475569' },

  trendCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  chartArea: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 140, paddingVertical: 10 },
  chartBarGroup: { alignItems: 'center', width: 80 },
  bar: { width: 40, borderRadius: 8, marginBottom: 8 },
  barLabel: { fontSize: 10, fontWeight: '800', color: '#64748B' },
  barValue: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  chartHint: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 10, lineHeight: 16 },

  propertySection: { marginTop: 40, width: '100%' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 20 }
});