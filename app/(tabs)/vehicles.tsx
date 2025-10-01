import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { VehicleCard } from '@/components/VehicleCard';

export default function VehiclesScreen() {
  const { vehicles, documents } = useAppState();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    
    return vehicles.filter(vehicle => 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vehicles, searchQuery]);

  return (
    <View style={styles.container}>
      {vehicles.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search vehicles..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        {vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <TouchableOpacity
              style={styles.emptyCard}
              onPress={() => router.push('/add-vehicle')}
            >
              <Plus size={48} color={theme.colors.primary} />
              <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
              <Text style={styles.emptyText}>
                Add your first vehicle to start tracking documents
              </Text>
              <View style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Vehicle</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : filteredVehicles.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Search size={48} color={theme.colors.textSecondary} />
            <Text style={styles.noResultsTitle}>No vehicles found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms
            </Text>
          </View>
        ) : (
          <>
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                documents={documents.filter(d => d.vehicleId === vehicle.id)}
                onPress={() => router.push(`/vehicle/${vehicle.id}`)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {vehicles.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-vehicle')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  noResultsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  noResultsText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl * 2,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});