import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RooflineLayout from '@/components/RooflineLayout';



export default function WalletPage() {
  const [country, setCountry] = useState<'ireland' | 'spain'>('ireland');
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [totalSavings, setTotalSavings] = useState('');

  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [baseLending, setBaseLending] = useState<number | null>(null);
  const [taxes, setTaxes] = useState<number | null>(null);
  const [disposableIncome, setDisposableIncome] = useState<number | null>(null);

  useEffect(() => {
    handleCalculate();
  }, [country, annualIncome, monthlyDebts, totalSavings]);

  const handleCalculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const savings = parseFloat(totalSavings) || 0;

    if (income === 0 && savings === 0) {
      setMaxPrice(0);
      return;
    }

    if (country === 'ireland') {
      // --- IRELAND LOGIC (4x Salary) ---
      const mortgage = income * 4;
      const totalPotential = mortgage + savings;
      const stampDuty = totalPotential * 0.01;
      const finalPrice = totalPotential - stampDuty;

      setBaseLending(mortgage);
      setTaxes(stampDuty);
      setMaxPrice(finalPrice);
      setDisposableIncome((income / 12) - debts);
    } else {
      // --- SPAIN LOGIC (REALISTIC) ---
const mortgage = income * 4.5;

// Property value assuming mortgage covers 80%
const propertyValue = mortgage / 0.8;

// Estimated taxes and fees (10–12%)
const estimatedTaxes = propertyValue * 0.12;

// Required down payment (20%)
const downPayment = propertyValue * 0.20;

setBaseLending(mortgage);
setTaxes(estimatedTaxes);
setMaxPrice(propertyValue);
setDisposableIncome(((income * 0.78) / 12) - debts);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === 0) return '€0';
    return `€${Math.round(value).toLocaleString()}`;
  };

  return (
    <RooflineLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Financial Wallet</Text>
        <Text style={styles.subtitle}>Real-time buying power for Ireland & Spain</Text>

        <View style={styles.row}>
          {/* Inputs Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Financial Inputs</Text>
            
            <Text style={styles.inputLabel}>Annual Gross Income (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={annualIncome}
              onChangeText={setAnnualIncome}
              placeholder="e.g. 60000"
            />
            
            <Text style={styles.inputLabel}>Monthly Debts (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={monthlyDebts}
              onChangeText={setMonthlyDebts}
              placeholder="e.g. 300"
            />

            <Text style={styles.inputLabel}>Total Savings (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={totalSavings}
              onChangeText={setTotalSavings}
              placeholder="e.g. 50000"
            />

            <View style={styles.switchRow}>
              <TouchableOpacity
                onPress={() => setCountry('ireland')}
                style={[styles.switchButton, country === 'ireland' && styles.switchActive]}
              >
                <Text style={country === 'ireland' ? styles.switchActiveText : styles.switchText}>Ireland</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCountry('spain')}
                style={[styles.switchButton, country === 'spain' && styles.switchActive]}
              >
                <Text style={country === 'spain' ? styles.switchActiveText : styles.switchText}>Spain</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Results Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estimated Buying Power</Text>
            <Text style={styles.largeValue}>{formatCurrency(maxPrice)}</Text>
            
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>MORTGAGE</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(baseLending)}</Text>
              </View>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>TAXES/FEES</Text>
                <Text style={[styles.breakdownValue, { color: '#EF4444' }]}>
                   -{formatCurrency(taxes)}
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Monthly Status</Text>
              <Text style={styles.infoBoxText}>
                Disposable: {formatCurrency(disposableIncome)} /mo
              </Text>
            </View>
          </View>
        </View>

        {maxPrice !== null && maxPrice > 0 && (
          <View style={styles.certificateCard}>
            <Text style={styles.certificateTitle}>Buying Power Certificate</Text>
            <Text style={styles.certificateText}>
              Estimated budget for your property search in {country === 'ireland' ? 'Ireland' : 'Spain'}:
            </Text>
            <Text style={styles.certificateValue}>{formatCurrency(maxPrice)}</Text>
            <Text style={styles.certificateFooter}>
              {country === 'spain' 
                ? "Based on 4.5x salary and 20% down payment." 
                : "Based on Central Bank 4x salary rules."}
            </Text>
          </View>
        )}
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: '800', marginTop: 20, color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 340,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#374151' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, fontSize: 16 },
  largeValue: { fontSize: 34, fontWeight: '800', marginBottom: 20, color: '#6366F1' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  breakdownBox: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, flex: 1 },
  breakdownLabel: { fontSize: 10, color: '#6B7280', fontWeight: '700', marginBottom: 4 },
  breakdownValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  infoBox: { marginTop: 20, padding: 12, backgroundColor: '#EEF2FF', borderRadius: 10 },
  infoBoxTitle: { fontSize: 12, fontWeight: '700', color: '#4338CA', marginBottom: 2 },
  infoBoxText: { fontSize: 14, color: '#1E1B4B', fontWeight: '600' },
  switchRow: { flexDirection: 'row', marginTop: 24, borderRadius: 10, backgroundColor: '#F3F4F6', padding: 4 },
  switchButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  switchActive: { backgroundColor: '#6366F1' },
  switchText: { color: '#4B5563', fontWeight: '700' },
  switchActiveText: { color: '#fff', fontWeight: '700' },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'dashed',
  },
  certificateTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  certificateText: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 12 },
  certificateValue: { fontSize: 48, fontWeight: '900', color: '#6366F1', marginBottom: 12 },
  certificateFooter: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' },
});