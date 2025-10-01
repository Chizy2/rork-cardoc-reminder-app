import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Car, Truck, Bike, Bus, ChevronRight } from 'lucide-react-native';
import { Vehicle, Document } from '@/types';
import { theme } from '@/constants/theme';
import { StatusBadge } from './StatusBadge';
import { getDocumentStatus, getDaysUntilExpiry, getStatusText } from '@/utils/date';

interface VehicleCardProps {
  vehicle: Vehicle;
  documents: Document[];
  onPress: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, documents, onPress }) => {

  
  const getVehicleIcon = () => {
    const iconProps = { size: 24, color: theme.colors.primary };
    switch (vehicle.type) {
      case 'car':
        return <Car {...iconProps} />;
      case 'truck':
        return <Truck {...iconProps} />;
      case 'bike':
        return <Bike {...iconProps} />;
      case 'bus':
        return <Bus {...iconProps} />;
      default:
        return <Car {...iconProps} />;
    }
  };

  const getMostUrgentDocument = () => {
    if (documents.length === 0) return null;
    
    const sortedDocs = [...documents].sort((a, b) => {
      const daysA = getDaysUntilExpiry(a.expiryDate);
      const daysB = getDaysUntilExpiry(b.expiryDate);
      return daysA - daysB;
    });
    
    return sortedDocs[0];
  };

  const urgentDoc = getMostUrgentDocument();
  const urgentStatus = urgentDoc ? getDocumentStatus(urgentDoc.expiryDate) : null;
  const urgentDays = urgentDoc ? getDaysUntilExpiry(urgentDoc.expiryDate) : null;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    vehicleImage: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: 2,
    },
    details: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    registration: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: '500' as const,
    },
    statusContainer: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footer: {
      marginTop: theme.spacing.sm,
    },
    documentCount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {vehicle.imageUri ? (
            <Image source={{ uri: vehicle.imageUri }} style={styles.vehicleImage} />
          ) : (
            getVehicleIcon()
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.details}>
            {vehicle.make} {vehicle.model} • {vehicle.year}
          </Text>
          <Text style={styles.registration}>{vehicle.registrationNumber}</Text>
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      </View>
      
      {urgentDoc && urgentStatus && urgentDays !== null && (
        <View style={styles.statusContainer}>
          <StatusBadge 
            status={urgentStatus} 
            text={`${urgentDoc.customName || urgentDoc.type}: ${getStatusText(urgentDays)}`}
          />
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.documentCount}>
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

