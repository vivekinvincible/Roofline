import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import RooflineLayout from '@/components/RooflineLayout';
import { PropertyList } from '@/components/PropertyList';

export default function WalletPage() {
  const [country, setCountry] = useState<'ireland' | 'spain'>('ireland');
  const [monthlyGross, setMonthlyGross] = useState('');
  const [monthlySpending, setMonthlySpending] = useState('');
  const [annualCosts, setAnnualCosts] = useState('');
  const [totalSavings, setTotalSavings] = useState('');

  // Use null as the initial state to distinguish between "not calculated" and "zero"
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [loanLimit, setLoanLimit] = useState<number | null>(null);
  const [taxes, setTaxes] = useState<number | null>(null);
  const [netDisposable, setNetDisposable] = useState<number | null>(null);

  useEffect(() => {
    handleCalculate();
  }, [country, monthlyGross, monthlySpending, annualCosts, totalSavings]);

  const handleCalculate = () => {
    // Check if we have the bare minimum to calculate
    if (!monthlyGross && !totalSavings) {
      setMaxPrice(null);
      setLoanLimit(null);
      setTaxes(null);
      setNetDisposable(null);
      return;
    }

    const mGross = parseFloat(monthlyGross) || 0;
    const mSpend = parseFloat(monthlySpending) || 0;
    const aCosts = parseFloat(annualCosts) || 0;
    const savings = parseFloat(totalSavings) || 0;

    // Effective Annual Income for Lending
    const effectiveAnnualGross = (mGross * 12) - aCosts;
    const estimatedNetMonthly = mGross * 0.75; 

    let mortgageCapacity = 0;
    let taxRate = 0;
    let fixedFees = 0;

    if (country === 'ireland') {
      mortgageCapacity = effectiveAnnualGross * 4;
      taxRate = 0.01; 
      fixedFees = 2500; 
    } else {
      const maxMonthlyPayment = (estimatedNetMonthly - mSpend) * 0.35;
      mortgageCapacity = maxMonthlyPayment * 200; 
      taxRate = 0.12; 
      fixedFees = 1500;
    }

    const rawBuyingPower = (mortgageCapacity + savings - fixedFees) / (1 + taxRate);
    
    setLoanLimit(mortgageCapacity);
    setTaxes(rawBuyingPower * taxRate + fixedFees);
    setMaxPrice(rawBuyingPower > 0 ? rawBuyingPower : 0);
    setNetDisposable(estimatedNetMonthly - mSpend);
  };

  // UX Helper: Renders a dash or placeholder if the value is null
  const formatValue = (v: number | null, isCurrency = true) => {
    if (v === null) return '--';
    if (!isCurrency) return Math.round(v).toLocaleString();
    return `€${Math.round(v).toLocaleString()}`;
  };

  return (
    <RooflineLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Buying Power Engine</Text>
        <Text style={styles.subtitle}>Factor in loans, spending, and local taxes</Text>

        <View style={styles.row}>
          {/* Detailed Inputs */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Cashflow</Text>
            
            <Text style={styles.inputLabel}>Monthly Gross Income (€)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={monthlyGross} onChangeText={setMonthlyGross} placeholder="e.g. 5000" />
            
            <Text style={styles.inputLabel}>Monthly Spending (€)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={monthlySpending} onChangeText={setMonthlySpending} placeholder="Rent, food, car loans..." />

            <Text style={styles.inputLabel}>Annual Fixed Costs (€)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={annualCosts} onChangeText={setAnnualCosts} placeholder="Insurance, taxes, holidays..." />

            <Text style={styles.inputLabel}>Total Savings / Deposit (€)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={totalSavings} onChangeText={setTotalSavings} placeholder="e.g. 60000" />

            <View style={styles.switchRow}>
              <TouchableOpacity onPress={() => setCountry('ireland')} style={[styles.switchButton, country === 'ireland' && styles.switchActive]}>
                <Text style={country === 'ireland' ? styles.switchActiveText : styles.switchText}>Ireland</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCountry('spain')} style={[styles.switchButton, country === 'spain' && styles.switchActive]}>
                <Text style={country === 'spain' ? styles.switchActiveText : styles.switchText}>Spain</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Loan Capability Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Loan Eligibility</Text>
            <Text style={[styles.largeValue, !maxPrice && { color: '#9CA3AF' }]}>
                {formatValue(maxPrice)}
            </Text>
            
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>EST. MORTGAGE</Text>
                <Text style={styles.breakdownValue}>{formatValue(loanLimit)}</Text>
              </View>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>FEES & TAXES</Text>
                <Text style={[styles.breakdownValue, { color: taxes ? '#EF4444' : '#6B7280' }]}>
                    {taxes ? `-${formatValue(taxes)}` : '--'}
                </Text>
              </View>
            </View>

            <View style={[
                styles.infoBox, 
                { backgroundColor: maxPrice === null ? '#F3F4F6' : (netDisposable || 0) > 500 ? '#F0FDF4' : '#FEF2F2' }
            ]}>
              <Text style={[
                  styles.infoBoxTitle, 
                  { color: maxPrice === null ? '#6B7280' : (netDisposable || 0) > 500 ? '#166534' : '#991B1B' }
              ]}>
                Post-Mortgage Surplus
              </Text>
              <Text style={styles.infoBoxText}>{formatValue(netDisposable)} /mo</Text>
            </View>
          </View>
        </View>

        {/* Only show matches when we have a valid maxPrice */}
        {maxPrice !== null && maxPrice > 0 && (
          <View style={styles.matchSection}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchTitle}>Verified Matches</Text>
              <Text style={styles.matchSubtitle}>Properties within your calculated loan capacity</Text>
            </View>
            <PropertyList country={country === 'ireland' ? 'IE' : 'ES'} maxPrice={maxPrice} />
          </View>
        )}
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', paddingBottom: 60 },
  title: { fontSize: 30, fontWeight: '800', marginTop: 10, color: '#111827' },
  subtitle: { fontSize: 15, color: '#6B7280', marginBottom: 30 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 350, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 15, color: '#374151' },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 15 },
  largeValue: { fontSize: 32, fontWeight: '800', marginBottom: 15, color: '#4F46E5' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  breakdownBox: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, flex: 1 },
  breakdownLabel: { fontSize: 9, color: '#6B7280', fontWeight: '700', marginBottom: 2 },
  breakdownValue: { fontSize: 13, fontWeight: '700' },
  infoBox: { marginTop: 15, padding: 10, borderRadius: 8 },
  infoBoxTitle: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  infoBoxText: { fontSize: 15, fontWeight: '700' },
  switchRow: { flexDirection: 'row', marginTop: 20, borderRadius: 8, backgroundColor: '#F3F4F6', padding: 3 },
  switchButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  switchActive: { backgroundColor: '#4F46E5' },
  switchText: { color: '#4B5563', fontWeight: '700', fontSize: 13 },
  switchActiveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  matchSection: { width: '100%', maxWidth: 800, marginTop: 40 },
  matchHeader: { marginBottom: 20, paddingHorizontal: 10 },
  matchTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  matchSubtitle: { fontSize: 13, color: '#6B7280' },
});