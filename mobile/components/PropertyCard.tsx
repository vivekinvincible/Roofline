import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const PropertyCard = ({ property }: { property: any }) => {
  // Calculations for the finance table
  const stampDuty = property.price * 0.01;
  const notaryFees = property.country_code === 'IE' ? 2500 : 5000;
  const totalCost = property.price + stampDuty + notaryFees;

  // Format specs from your DB columns
  const specsString = `${property.rooms} Bed • ${property.bathrooms} Bath • ${property.area}${property.area_unit}`;

  return (
    <View style={styles.card}>
      {/* Left: Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.image_url || 'https://via.placeholder.com/400' }} 
          style={styles.image} 
        />
      </View>

      {/* Right: Info Section */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.marketBadge}>
            <Text style={styles.marketText}>
              Market Place : {property.country_code === 'IE' ? 'Ireland' : 'Spain'}
            </Text>
          </View>
          <TouchableOpacity><Text style={{fontSize: 20}}>♡</Text></TouchableOpacity>
        </View>

        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.specs}>{specsString}</Text>
        <Text style={styles.price}>€{property.price.toLocaleString()}</Text>

        {/* Finance Table */}
        <View style={styles.financeTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Asking Price</Text>
            <Text style={styles.tableValue}>€{property.price.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Stamp Duty (1%)</Text>
            <Text style={styles.tableValue}>€{stampDuty.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Legal & Notary Fees</Text>
            <Text style={styles.tableValue}>€{notaryFees.toLocaleString()}</Text>
          </View>
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>€{totalCost.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>Contact Agent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- THIS WAS THE MISSING PART ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Ensures card doesn't look squashed on web/tablet
    width: '100%',
  },
  imageContainer: { 
    width: '40%',
  },
  image: { 
    width: '100%', 
    height: '100%', 
    minHeight: 300 
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  marketBadge: { 
    backgroundColor: '#94A3B8', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 5 
  },
  marketText: { 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: '700' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#0F172A', 
    marginTop: 10 
  },
  specs: { 
    fontSize: 13, 
    color: '#64748B', 
    marginVertical: 5 
  },
  price: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#0F172A', 
    marginBottom: 15 
  },
  financeTable: { 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    paddingTop: 15 
  },
  tableRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 6 
  },
  tableLabel: { 
    color: '#475569', 
    fontSize: 12,
    fontWeight: '600' 
  },
  tableValue: { 
    color: '#0F172A', 
    fontSize: 12,
    fontWeight: '700' 
  },
  totalRow: { 
    marginTop: 8, 
    paddingTop: 8, 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0' 
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: '800' 
  },
  totalValue: { 
    fontSize: 16, 
    fontWeight: '800',
    color: '#4F46E5' 
  },
  contactBtn: { 
    backgroundColor: '#0F172A', 
    borderRadius: 10, 
    padding: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  contactBtnText: { 
    color: '#FFF', 
    fontWeight: '700' 
  }
});