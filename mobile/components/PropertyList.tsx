import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PropertyCard } from './PropertyCard';

// Dummy data for now - we can connect this to FastAPI later!
const DUMMY_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Villa with Sea View',
    location: 'Marbella, Spain',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Traditional Country Home',
    location: 'Galway, Ireland',
    price: 425000,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  },
];

export const PropertyList = () => {
  return (
    <FlatList
      data={DUMMY_PROPERTIES}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PropertyCard property={item} />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
});
