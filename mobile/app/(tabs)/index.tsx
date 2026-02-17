import { View, StyleSheet } from 'react-native';
import { PropertyList } from '@/components/PropertyList';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PropertyList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
});