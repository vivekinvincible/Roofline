import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { PropertyCard } from './PropertyCard';

const API_URL = 'http://192.168.1.4:8000'; 
const PAGE_SIZE = 3;

export const PropertyList = ({ country }: { country: string }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination States
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Reset everything when the country changes
  useEffect(() => {
    fetchProperties(true);
  }, [country]);

  const fetchProperties = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = isInitial ? 0 : offset;
      const response = await fetch(
        `${API_URL}/properties/${country}?limit=${PAGE_SIZE}&offset=${currentOffset}`
      );

      if (!response.ok) throw new Error('Failed to fetch properties');

      const data = await response.json();

      if (isInitial) {
        setProperties(data.properties);
      } else {
        setProperties(prev => [...prev, ...data.properties]);
      }

      setTotalCount(data.total);
      setOffset(currentOffset + PAGE_SIZE);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#5850EC" style={{ marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  const hasMore = properties.length < totalCount;

  return (
    <View style={styles.listContainer}>
      {properties.map((item: any) => (
        <PropertyCard key={item.id} property={item} />
      ))}

      {hasMore && (
        <TouchableOpacity 
          style={styles.loadMoreBtn} 
          onPress={() => fetchProperties(false)}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loadMoreText}>Show More Properties</Text>
          )}
        </TouchableOpacity>
      )}

      {!hasMore && properties.length > 0 && (
        <Text style={styles.endText}>Showing all {totalCount} properties</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { padding: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  loadMoreBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  loadMoreText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  endText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginVertical: 20,
    fontSize: 14,
    fontStyle: 'italic'
  }
});