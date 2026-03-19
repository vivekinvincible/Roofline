import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PropertyCard } from './PropertyCard';

const DUMMY_DATA = [
  {
    id: '1',
    country: 'IE',
    title: 'Luxury Family Villa',
    location: 'Ireland',
    price: 550000,
    specs: '4 Bed • 3 Bath • 220m²',
    stampDuty: 5500,
    fees: 2500,
    total: 558000,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    country: 'IE',
    title: 'Seaside Apartment',
    location: 'Ireland',
    price: 350000,
    specs: '2 Bed • 2 Bath • 85m²',
    stampDuty: 3500,
    fees: 1800,
    total: 355300,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
];

export const PropertyList = ({ country }: { country: string }) => {
  const filteredData = DUMMY_DATA.filter(p => p.country === country);

  return (
    <View>
      {filteredData.map(item => (
        <PropertyCard key={item.id} property={item} />
      ))}
    </View>
  );
};