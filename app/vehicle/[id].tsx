import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Edit, Trash2, FileText, Search, RefreshCw } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { StatusBadge } from '@/components/StatusBadge';
import { RenewalModal } from '@/components/RenewalModal';
import { formatDate, getDocumentStatus } from '@/utils/date';
import { Document } from '@/types';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicles, documents, deleteVehicle, deleteDocument, renewDocument } = useAppState();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [renewalModalVisible, setRenewalModalVisible] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const vehicle = vehicles.find(v => v.id === id);
  const vehicleDocuments = documents.filter(d => d.vehicleId === id);
  
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return vehicleDocuments;
    
    return vehicleDocuments.filter(document => 
      (document.customName && document.customName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      document.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vehicleDocuments, searchQuery]);

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vehicle not found</Text>
      </View>
    );
  }

  const handleDeleteVehicle = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle and all its documents?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteVehicle(vehicle.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDeleteDocument = (documentId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDocument(documentId),
        },
      ]
    );
  };

  const handleRenewDocument = (document: Document) => {
    setSelectedDocument(document);
    setRenewalModalVisible(true);
  };

  const handleRenewalSubmit = async (newExpiryDate: string, imageUri?: string) => {
    if (!selectedDocument) return;
    
    renewDocument(selectedDocument.id, newExpiryDate, imageUri);
    setRenewalModalVisible(false);
    setSelectedDocument(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehicleDetails}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.vehicleNumber}>{vehicle.registrationNumber}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/edit-vehicle?id=${vehicle.id}` as any)}
          >
            <Edit size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteVehicle}
          >
            <Trash2 size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push(`/add-document?vehicleId=${vehicle.id}` as any)}
          >
            <Plus size={20} color={theme.colors.primary} />
            <Text style={styles.addButtonText}>Add Document</Text>
          </TouchableOpacity>
        </View>
        
        {vehicleDocuments.length > 0 && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search documents..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}

        {vehicleDocuments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Documents</Text>
            <Text style={styles.emptyText}>
              Add documents for this vehicle to track expiry dates
            </Text>
          </View>
        ) : filteredDocuments.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Search size={48} color={theme.colors.textSecondary} />
            <Text style={styles.noResultsTitle}>No documents found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms
            </Text>
          </View>
        ) : (
          filteredDocuments.map(document => {
            const status = getDocumentStatus(document.expiryDate);
            
            return (
              <TouchableOpacity 
                key={document.id} 
                style={styles.documentCard}
                onPress={() => router.push(`/document-history/${document.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.documentInfo}>
                  <Text style={styles.documentType}>
                    {document.customName || document.type}
                  </Text>
                  <Text style={styles.documentExpiry}>
                    Expires: {formatDate(document.expiryDate)}
                  </Text>
                  {document.history && document.history.length > 0 && (
                    <Text style={styles.historyIndicator}>
                      {document.history.length} previous version{document.history.length > 1 ? 's' : ''}
                    </Text>
                  )}
                </View>
                <View style={styles.documentActions}>
                  <StatusBadge status={status} text={status === 'expired' ? 'Expired' : status === 'expiring' ? 'Expiring' : 'Valid'} />
                  <TouchableOpacity
                    style={styles.renewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRenewDocument(document);
                    }}
                  >
                    <RefreshCw size={14} color={theme.colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.documentEditButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/add-document?vehicleId=${vehicle.id}&documentId=${document.id}` as any);
                    }}
                  >
                    <Edit size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.documentDeleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(document.id);
                    }}
                  >
                    <Trash2 size={16} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
      
      {selectedDocument && (
        <RenewalModal
          visible={renewalModalVisible}
          onClose={() => {
            setRenewalModalVisible(false);
            setSelectedDocument(null);
          }}
          document={selectedDocument}
          onRenew={handleRenewalSubmit}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  vehicleDetails: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  vehicleNumber: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: theme.spacing.lg,
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  documentCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  documentExpiry: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  historyIndicator: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  documentEditButton: {
    padding: theme.spacing.sm,
  },
  documentDeleteButton: {
    padding: theme.spacing.sm,
  },
  renewButton: {
    padding: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});