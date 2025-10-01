import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Calendar, FileText, Clock, X } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { formatDate, getDocumentStatus } from '@/utils/date';
import { StatusBadge } from '@/components/StatusBadge';

export default function DocumentHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documents, vehicles } = useAppState();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const document = documents.find(d => d.id === id);
  const vehicle = document ? vehicles.find(v => v.id === document.vehicleId) : null;
  
  if (!document || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: 'Document History' }} />
        <View style={styles.container}>
          <Text style={styles.errorText}>Document not found</Text>
        </View>
      </>
    );
  }
  
  const currentStatus = getDocumentStatus(document.expiryDate);
  const allVersions = [
    {
      id: 'current',
      expiryDate: document.expiryDate,
      imageUri: document.imageUri,
      updatedAt: document.updatedAt,
      isCurrent: true,
    },
    ...(document.history || []).map(h => ({ ...h, isCurrent: false })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Document History',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {document.customName || document.type}
            </Text>
            <Text style={styles.vehicleInfo}>
              {vehicle.name} • {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <View style={styles.statusContainer}>
              <StatusBadge 
                status={currentStatus} 
                text={currentStatus === 'expired' ? 'Expired' : currentStatus === 'expiring' ? 'Expiring Soon' : 'Valid'} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Versions</Text>
          <Text style={styles.sectionSubtitle}>
            View all versions of this document including renewal history
          </Text>
          
          {allVersions.map((version, index) => {
            const versionStatus = getDocumentStatus(version.expiryDate);
            
            return (
              <View key={version.id} style={styles.versionCard}>
                <View style={styles.versionHeader}>
                  <View style={styles.versionInfo}>
                    <View style={styles.versionTitleRow}>
                      <Text style={styles.versionTitle}>
                        {version.isCurrent ? 'Current Version' : `Version ${allVersions.length - index}`}
                      </Text>
                      {version.isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.versionDetails}>
                      <View style={styles.versionDetailRow}>
                        <Calendar size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.versionDetailText}>
                          Expires: {formatDate(version.expiryDate)}
                        </Text>
                      </View>
                      
                      <View style={styles.versionDetailRow}>
                        <Clock size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.versionDetailText}>
                          Updated: {formatDate(version.updatedAt)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.versionStatusContainer}>
                      <StatusBadge 
                        status={versionStatus} 
                        text={versionStatus === 'expired' ? 'Expired' : versionStatus === 'expiring' ? 'Expiring' : 'Valid'} 
                      />
                    </View>
                  </View>
                </View>
                
                {version.imageUri && (
                  <View style={styles.imageContainer}>
                    <Text style={styles.imageLabel}>Document Image:</Text>
                    <TouchableOpacity 
                      style={styles.imageWrapper}
                      onPress={() => {
                        console.log('Opening document image:', version.imageUri);
                        setSelectedImage(version.imageUri || null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Image 
                        source={{ uri: version.imageUri }} 
                        style={styles.documentImage} 
                        resizeMode="cover"
                      />
                      <View style={styles.imageOverlay}>
                        <FileText size={20} color={theme.colors.card} />
                        <Text style={styles.imageOverlayText}>Tap to view full size</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                
                {!version.imageUri && (
                  <View style={styles.noImageContainer}>
                    <FileText size={24} color={theme.colors.textSecondary} />
                    <Text style={styles.noImageText}>No image available</Text>
                  </View>
                )}
              </View>
            );
          })}
          
          {allVersions.length === 1 && (
            <View style={styles.noHistoryContainer}>
              <FileText size={48} color={theme.colors.textSecondary} />
              <Text style={styles.noHistoryTitle}>No History Available</Text>
              <Text style={styles.noHistoryText}>
                This document hasn&apos;t been renewed yet. History will appear here when you renew or update the document.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <X size={28} color={theme.colors.card} />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
          
          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>View Only - Document cannot be edited</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  header: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  documentInfo: {
    alignItems: 'flex-start',
  },
  documentTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.sm,
  },
  vehicleInfo: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  versionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  versionHeader: {
    marginBottom: theme.spacing.md,
  },
  versionInfo: {
    flex: 1,
  },
  versionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  versionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  currentBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  currentBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.card,
  },
  versionDetails: {
    marginBottom: theme.spacing.sm,
  },
  versionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  versionDetailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  versionStatusContainer: {
    alignSelf: 'flex-start',
  },
  imageContainer: {
    marginTop: theme.spacing.md,
  },
  imageLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  imageWrapper: {
    position: 'relative' as const,
    alignSelf: 'center',
  },
  documentImage: {
    width: 280,
    height: 180,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  imageOverlayText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
  },
  noImageContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
  },
  noImageText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  noHistoryContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  noHistoryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  noHistoryText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute' as const,
    top: 50,
    right: theme.spacing.lg,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: theme.spacing.sm,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  modalFooter: {
    position: 'absolute' as const,
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalFooterText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
});