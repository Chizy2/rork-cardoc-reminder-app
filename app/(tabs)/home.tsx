import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Plus, 
  Car, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { VehicleCard } from '@/components/VehicleCard';
import { StatusBadge } from '@/components/StatusBadge';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { getDocumentStatus, getDaysUntilExpiry, getStatusText } from '@/utils/date';

export default function HomeScreen() {
  const { user, vehicles, documents, reminders } = useAppState();


  const upcomingExpiries = useMemo(() => {
    return documents
      .map(doc => ({
        ...doc,
        daysUntil: getDaysUntilExpiry(doc.expiryDate),
        status: getDocumentStatus(doc.expiryDate),
        vehicle: vehicles.find(v => v.id === doc.vehicleId)
      }))
      .filter(doc => doc.daysUntil <= 60)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  }, [documents, vehicles]);

  const upcomingReminders = useMemo(() => {
    const now = new Date();
    return reminders
      .filter(reminder => new Date(reminder.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [reminders]);

  const stats = useMemo(() => {
    const expired = documents.filter(doc => getDaysUntilExpiry(doc.expiryDate) < 0).length;
    const expiringSoon = documents.filter(doc => {
      const days = getDaysUntilExpiry(doc.expiryDate);
      return days >= 0 && days <= 60;
    }).length;
    const valid = documents.filter(doc => getDaysUntilExpiry(doc.expiryDate) > 60).length;
    
    return { expired, expiringSoon, valid };
  }, [documents]);

  if (!user) return null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.lg,
      paddingBottom: 100,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    greeting: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.textSecondary,
    },
    userName: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginTop: 4,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    statCard: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    statNumber: {
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600' as const,
      color: theme.colors.text,
    },
    viewAllText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: '500' as const,
    },
    emptyCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    emptyTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    expiryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    expiryInfo: {
      flex: 1,
    },
    expiryCategory: {
      fontSize: theme.fontSize.md,
      fontWeight: '500' as const,
      color: theme.colors.text,
    },
    expiryVehicle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    reminderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: '500' as const,
      color: theme.colors.text,
    },
    reminderDetails: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    quickActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing.sm,
    },
    actionText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.primary,
      fontWeight: '500' as const,
    },
    renewalButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    renewalButtonText: {
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    renewalButtonSubtext: {
      fontSize: theme.fontSize.sm,
      color: '#FFFFFF',
      opacity: 0.8,
      marginTop: 4,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.userName}>{user.name}!</Text>
      </View>

      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.success + '20' }]}>
          <CheckCircle size={24} color={theme.colors.success} />
          <Text style={styles.statNumber}>{stats.valid}</Text>
          <Text style={styles.statLabel}>Valid</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.warning + '20' }]}>
          <Clock size={24} color={theme.colors.warning} />
          <Text style={styles.statNumber}>{stats.expiringSoon}</Text>
          <Text style={styles.statLabel}>Expiring Soon</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.danger + '20' }]}>
          <AlertTriangle size={24} color={theme.colors.danger} />
          <Text style={styles.statNumber}>{stats.expired}</Text>
          <Text style={styles.statLabel}>Expired</Text>
        </View>
      </View>

      {/* Vehicles Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Vehicles</Text>
          {vehicles.length > 1 && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/vehicles')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {vehicles.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => router.push('/add-vehicle')}
          >
            <Car size={32} color={theme.colors.primary} />
            <Text style={styles.emptyTitle}>Add Your First Vehicle</Text>
            <Text style={styles.emptyText}>Start tracking your documents</Text>
          </TouchableOpacity>
        ) : (
          <VehicleCard
            vehicle={vehicles[0]}
            documents={documents.filter(d => d.vehicleId === vehicles[0].id)}
            onPress={() => router.push(`/vehicle/${vehicles[0].id}`)}
          />
        )}
      </View>

      {/* Upcoming Expiries */}
      {upcomingExpiries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Expiries</Text>
          {upcomingExpiries.map(doc => (
            <TouchableOpacity 
              key={doc.id} 
              style={styles.expiryItem}
              onPress={() => router.push(`/document-history/${doc.id}`)}
            >
              <View style={styles.expiryInfo}>
                <Text style={styles.expiryCategory}>{doc.type}</Text>
                <Text style={styles.expiryVehicle}>{doc.vehicle?.name}</Text>
              </View>
              <StatusBadge 
                status={doc.status} 
                text={getStatusText(doc.daysUntil)}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/reminders')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingReminders.map(reminder => {
            const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
            return (
              <TouchableOpacity 
                key={reminder.id} 
                style={styles.reminderItem}
                onPress={() => router.push(`/edit-reminder?id=${reminder.id}`)}
              >
                <Calendar size={20} color={theme.colors.primary} />
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDetails}>
                    {vehicle?.name} • {reminder.date} at {reminder.time}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/add-vehicle')}
          >
            <Plus size={20} color={theme.colors.primary} />
            <Text style={styles.actionText}>Add Vehicle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/add-reminder')}
          >
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.actionText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Renewal Service */}
      <TouchableOpacity
        style={styles.renewalButton}
        onPress={() => router.push('/renewal')}
      >
        <Text style={styles.renewalButtonText}>Need Document Renewal?</Text>
        <Text style={styles.renewalButtonSubtext}>Let us handle it for you</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

