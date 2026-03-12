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
  const [disposableIncome, setDisposableIncome] = useState<number | null>(null);
  const [debtToIncome, setDebtToIncome] = useState<number | null>(null);
  const [savingsSecurity, setSavingsSecurity] = useState<number | null>(null);
  const [baseLending, setBaseLending] = useState<number | null>(null);
  const [savingsAdded, setSavingsAdded] = useState<number | null>(null);
  const [taxes, setTaxes] = useState<number | null>(null);

  useEffect(() => {
    if (annualIncome || monthlyDebts || totalSavings) {
      handleCalculate();
    }
  }, [country, annualIncome, monthlyDebts, totalSavings]);

 const handleCalculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const savings = parseFloat(totalSavings) || 0;

    if (country === 'ireland') {
      const base = income * 4;
      const totalPotential = base + savings;
      const stampDuty = totalPotential * 0.01;
      const price = totalPotential - stampDuty;

      setBaseLending(base);
      setSavingsAdded(savings);
      setTaxes(stampDuty);
      setMaxPrice(price);
      setDisposableIncome(income / 12 - debts);
      setDebtToIncome(debts / (income / 12) || 0);
      setSavingsSecurity(savings);
    } else {
      // --- REAL WORLD SPANISH LOGIC ---
      const monthlyNet = (income * 0.75) / 12; // Estimating net after tax
      const dtiLimit = 0.33; // 33% max DTI
      const maxMonthlyPayment = (monthlyNet * dtiLimit) - debts;

      // Calculate max loan based on 3.5% interest over 25 years
      // Formula: P = (PMT * (1 - (1 + r)^-n)) / r
      const monthlyRate = 0.035 / 12;
      const numberOfPayments = 25 * 12;
      const maxLoanDTI = maxMonthlyPayment > 0 
        ? maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate)
        : 0;

      // Upfront costs in Spain (ITP + Fees) are ~12%
      // Total Cash Needed = (Property Price * 0.30 deposit) + (Property Price * 0.12 taxes)
      // Total Cash Needed = Property Price * 0.42
      // Therefore, Max Price based on Savings = Savings / 0.42
      const maxPriceSavings = savings / 0.42;

      // The final price is the lower of the two constraints
      const price = Math.min(maxLoanDTI + (savings - (maxPriceSavings * 0.12)), maxPriceSavings);
      
      const estimatedTaxes = price * 0.12;
      const actualLoan = price * 0.70; // 70% LTV

      setBaseLending(actualLoan);
      setSavingsAdded(savings);
      setTaxes(estimatedTaxes);
      setMaxPrice(price);
      setDisposableIncome(monthlyNet - debts);
      setDebtToIncome(debts / monthlyNet || 0);
      setSavingsSecurity(savings);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '€0';
    return `€${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <RooflineLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.subtitle}>
          Cross-border financial planning for Ireland & Spain
        </Text>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Financial Inputs</Text>
            <Text style={styles.inputLabel}>Annual Gross Income (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={annualIncome}
              onChangeText={setAnnualIncome}
              placeholder="e.g. 65000"
            />
            <Text style={styles.inputLabel}>Monthly Debts (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={monthlyDebts}
              onChangeText={setMonthlyDebts}
              placeholder="e.g. 400"
            />
            <Text style={styles.inputLabel}>Total Savings (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={totalSavings}
              onChangeText={setTotalSavings}
              placeholder="e.g. 50000"
            />
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Update Results</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Estimated Buying Power</Text>
            <Text style={styles.largeValue}>
              {formatCurrency(maxPrice)}
            </Text>
            
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>
                  {country === 'ireland' ? 'LOAN (4X)' : 'EST. LOAN'}
                </Text>
                <Text style={styles.breakdownValue}>{formatCurrency(baseLending)}</Text>
              </View>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>SAVINGS</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(savingsAdded)}</Text>
              </View>
              <View style={styles.breakdownBox}>
                <Text style={styles.breakdownLabel}>
                  {country === 'ireland' ? 'STAMP (1%)' : 'TAX/ITP (12%)'}
                </Text>
                <Text style={[styles.breakdownValue, { color: '#EF4444' }]}>
                  {taxes !== null ? `-${formatCurrency(taxes)}` : '€0'}
                </Text>
              </View>
            </View>

            <Text style={styles.savingsLabel}>Savings Security (Liquid Assets)</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${savingsSecurity && maxPrice ? Math.min((savingsSecurity / maxPrice) * 100, 100) : 0}%` },
                ]}
              />
            </View>
            <Text style={styles.savingsText}>{formatCurrency(savingsSecurity)}</Text>
          </View>
        </View>

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

        {maxPrice !== null && (
          <View style={styles.certificateCard}>
            <Text style={styles.certificateTitle}>Buying Power Certificate</Text>
            <Text style={styles.certificateText}>
              Estimated budget for your property search in {country === 'ireland' ? 'Ireland' : 'Spain'}:
            </Text>
            <Text style={styles.certificateValue}>{formatCurrency(maxPrice)}</Text>
            <TouchableOpacity style={styles.certificateButton}>
              <Text style={styles.certificateButtonText}>Share / Save</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Tax Context</Text>
            <Text style={styles.infoText}>
              {country === 'ireland'
                ? "Includes 1% Stamp Duty. Lending is generally capped at 4x gross income for first-time buyers."
                : "Includes ~12% ITP (Transfer Tax) and Notary fees. Mortgages for non-residents usually cap at 70% LTV."}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Financial Health</Text>
            <Text style={styles.infoText}>
              {disposableIncome !== null && debtToIncome !== null
                ? `Disposable: ${formatCurrency(disposableIncome)}/mo. DTI Ratio: ${(debtToIncome * 100).toFixed(1)}%.`
                : 'Enter details to view metrics.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </RooflineLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputLabel: { fontSize: 14, marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 16 },
  largeValue: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#4F46E5' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  breakdownBox: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, flex: 1 },
  breakdownLabel: { fontSize: 9, color: '#6B7280', marginBottom: 4, fontWeight: '600' },
  breakdownValue: { fontSize: 13, fontWeight: 'bold' },
  savingsLabel: { fontSize: 12, marginTop: 20, marginBottom: 4 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5' },
  savingsText: { marginTop: 4, fontSize: 14, textAlign: 'right', fontWeight: '500' },
  switchRow: { flexDirection: 'row', marginTop: 30, borderRadius: 8, backgroundColor: '#E5E7EB', padding: 4 },
  switchButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 6 },
  switchActive: { backgroundColor: '#4F46E5' },
  switchText: { color: '#374151', fontWeight: '600' },
  switchActiveText: { color: '#fff', fontWeight: '600' },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 40, marginBottom: 60 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 300, elevation: 5 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 660,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 2,
    borderColor: '#4F46E5',
    elevation: 5,
  },
  certificateTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  certificateText: { fontSize: 14, textAlign: 'center', marginBottom: 8, color: '#4B5563' },
  certificateValue: { fontSize: 36, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  certificateButton: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  certificateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  calculateButton: { marginTop: 20, backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  calculateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});