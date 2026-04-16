import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { PropertyCard } from './PropertyCard';

const API_URL = 'http://192.168.1.12:8000'; 
const PAGE_SIZE = 3;

interface PropertyListProps {
  country: string;
  maxPrice?: number | null;
  searchQuery?: string; // Added this prop
}

export const PropertyList = ({ country, maxPrice, searchQuery }: PropertyListProps) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);

  // Re-run fetch whenever country, budget, OR search query changes
  // Inside PropertyList.tsx
  useEffect(() => {
    console.log("PropertyList triggered with search:", searchQuery);
    fetchProperties(true);
  }, [country, maxPrice, searchQuery]);

  const fetchProperties = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = isInitial ? 0 : offset;
      
      // Build Query Parameters
      const params = new URLSearchParams();
      params.append('limit', PAGE_SIZE.toString());
      params.append('offset', currentOffset.toString());
      
      if (maxPrice) {
        params.append('max_price', maxPrice.toString());
      }
      
      if (searchQuery && searchQuery.trim().length > 0) {
        params.append('search', searchQuery.trim()); // Match this key to your FastAPI backend
      }

      const url = `${API_URL}/properties/${country}?${params.toString()}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url);

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
    } catch (err: any) {
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
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>Error connecting to server</Text>
        <TouchableOpacity style={styles.loadMoreBtn} onPress={() => fetchProperties(true)}>
          <Text style={styles.loadMoreText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasMore = properties.length < totalCount;

  return (
    <View style={styles.listContainer}>
      {/* Handle Empty State */}
      {properties.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties found.</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery 
              ? `We couldn't find matches for "${searchQuery}".` 
              : "Try adjusting your filters or search area."}
          </Text>
        </View>
      )}

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
        <Text style={styles.endText}>Showing all {totalCount} results</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { padding: 10 },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 10, fontWeight: '600' },
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
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  }
});