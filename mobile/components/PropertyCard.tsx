import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const PropertyCard = ({ property }: { property: any }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: property.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.price}>€{property.price.toLocaleString()}</Text>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>{property.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 200 },
  info: { padding: 12 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  title: { fontSize: 16, color: '#34495e', marginVertical: 4 },
  location: { fontSize: 14, color: '#7f8c8d' },
});