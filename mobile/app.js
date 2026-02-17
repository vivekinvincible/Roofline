import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

export default function App() {
  const [savings, setSavings] = useState('');
  const [buyingPower, setBuyingPower] = useState(null);

  const calculatePower = async () => {
    // Calling your FastAPI backend (from the previous step)
    const response = await fetch('http://http://127.0.0.1:8000/calculate-buying-power/spain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savings_eur: parseFloat(savings), annual_income_eur: 50000 })
    });
    const data = await response.json();
    setBuyingPower(data.max_property_price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spain Property Calculator</Text>
      <TextInput 
        style={styles.input}
        placeholder="Savings in Ireland (€)"
        keyboardType="numeric"
        onChangeText={setSavings}
      />
      <Button title="Calculate" onPress={calculatePower} />
      {buyingPower && <Text>Max Property: €{buyingPower}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});