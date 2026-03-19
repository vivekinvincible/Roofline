import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const PropertyCard = ({ property }: { property: any }) => {
  return (
    <View style={styles.card}>
      {/* Left: Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.image} />
      </View>

      {/* Right: Info Section */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.marketBadge}>
            <Text style={styles.marketText}>Market Place : {property.location}</Text>
          </View>
          <TouchableOpacity><Text style={{fontSize: 20}}>♡</Text></TouchableOpacity>
        </View>

        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.specs}>{property.specs}</Text>
        <Text style={styles.price}>€{property.price.toLocaleString()}</Text>

        {/* Finance Table */}
        <View style={styles.financeTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Asking Price</Text>
            <Text style={styles.tableValue}>€{property.price.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Stamp Duty (1%)</Text>
            <Text style={styles.tableValue}>€{property.stampDuty.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Legal & Notary Fees</Text>
            <Text style={styles.tableValue}>€{property.fees.toLocaleString()}</Text>
          </View>
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Cost of Purchase</Text>
            <Text style={styles.totalValue}>€{property.total.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contact Agent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageContainer: { width: '45%' },
  image: { width: '100%', height: '100%', minHeight: 350 },
  content: { flex: 1, padding: 25 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketBadge: { backgroundColor: '#94A3B8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  marketText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginTop: 10 },
  specs: { fontSize: 14, color: '#64748B', marginVertical: 5 },
  price: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 15 },
  financeTable: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 15 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tableLabel: { color: '#475569', fontWeight: '600' },
  tableValue: { color: '#0F172A', fontWeight: '700' },
  totalRow: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  totalLabel: { fontSize: 18, fontWeight: '800' },
  totalValue: { fontSize: 18, fontWeight: '800' },
  contactBtn: { backgroundColor: '#5850EC', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 20 },
  contactBtnText: { color: '#FFF', fontWeight: '700' }
});