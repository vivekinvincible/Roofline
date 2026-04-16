import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const PropertyCard = ({ property }: { property: any }) => {
  // --- DYNAMIC FINANCE LOGIC ---
  const isIreland = property.country_code === 'IE';
  
  // Ireland: 1% Stamp Duty. Spain: ~10% ITP (Transfer Tax)
  const stampDutyRate = isIreland ? 0.01 : 0.10;
  const stampDuty = property.price * stampDutyRate;
  
  // Ireland: Fixed legal fees (~€2,500). Spain: Notary/Registry (~€2,500)
  // We add 2% extra for Spain to cover the AJD and Registry
  const legalFees = isIreland ? 2500 : (property.price * 0.02);
  
  const totalCost = property.price + stampDuty + legalFees;

  // --- DATA DEFENSE (Handles the "null" issues) ---
  const beds = property.rooms ?? '0';
  const baths = property.bathrooms ?? '0';
  const area = property.area ?? '—';
  const unit = property.area_unit ?? '';
  
  const specsString = `${beds} Bed • ${baths} Bath • ${area}${unit}`;
  
  // Fallback image for Ireland if data is missing
  const displayImage = property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400';

  return (
    <View style={styles.card}>
      {/* Left: Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: displayImage }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      {/* Right: Info Section */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.marketBadge, { backgroundColor: isIreland ? '#059669' : '#DC2626' }]}>
            <Text style={styles.marketText}>
              {isIreland ? '🇮🇪 Ireland' : '🇪🇸 Spain'}
            </Text>
          </View>
          <TouchableOpacity><Text style={{fontSize: 20, color: '#94A3B8'}}>♡</Text></TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={1}>{property.title || 'Property Listing'}</Text>
        <Text style={styles.specs}>{specsString}</Text>
        <Text style={styles.price}>€{property.price.toLocaleString()}</Text>

        {/* Finance Table */}
        <View style={styles.financeTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Asking Price</Text>
            <Text style={styles.tableValue}>€{property.price.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>
              {isIreland ? 'Stamp Duty (1%)' : 'Transfer Tax (ITP 10%)'}
            </Text>
            <Text style={styles.tableValue}>€{Math.round(stampDuty).toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Legal & Notary</Text>
            <Text style={styles.tableValue}>€{Math.round(legalFees).toLocaleString()}</Text>
          </View>
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Budget</Text>
            <Text style={styles.totalValue}>€{Math.round(totalCost).toLocaleString()}</Text>
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: { width: '35%' },
  image: { width: '100%', height: '100%', minHeight: 280 },
  content: { flex: 1, padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  marketText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  title: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginTop: 8 },
  specs: { fontSize: 12, color: '#64748B', marginVertical: 4 },
  price: { fontSize: 22, fontWeight: '900', color: '#4F46E5', marginBottom: 12 },
  financeTable: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableLabel: { color: '#64748B', fontSize: 11, fontWeight: '600' },
  tableValue: { color: '#1E293B', fontSize: 11, fontWeight: '700' },
  totalRow: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  totalValue: { fontSize: 15, fontWeight: '900', color: '#4F46E5' },
  contactBtn: { backgroundColor: '#1E293B', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 15 },
  contactBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 }
});