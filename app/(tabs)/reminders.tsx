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
import { Plus, Calendar, Trash2, Search, Edit3, CheckCircle, Clock, History } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { formatDate } from '@/utils/date';

export default function RemindersScreen() {
  const { reminders, vehicles, deleteReminder, completeReminder } = useAppState();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const filteredAndSortedReminders = useMemo(() => {
    let filtered = reminders.filter(reminder => 
      showCompleted ? reminder.isCompleted : !reminder.isCompleted
    );
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(reminder => {
        const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
        return (
          reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reminder.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (reminder.description && reminder.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (vehicle && vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }
    
    return filtered.sort((a, b) => {
      if (showCompleted) {
        return new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [reminders, vehicles, searchQuery, showCompleted]);

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return theme.colors.warning;
      case 'insurance':
      case 'registration':
        return theme.colors.primary;
      case 'service':
      case 'oil_change':
      case 'tire_rotation':
        return theme.colors.secondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {reminders.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reminders..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !showCompleted && styles.toggleButtonActive]}
              onPress={() => setShowCompleted(false)}
            >
              <Clock size={16} color={!showCompleted ? '#FFFFFF' : theme.colors.textSecondary} />
              <Text style={[styles.toggleButtonText, !showCompleted && styles.toggleButtonTextActive]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, showCompleted && styles.toggleButtonActive]}
              onPress={() => setShowCompleted(true)}
            >
              <History size={16} color={showCompleted ? '#FFFFFF' : theme.colors.textSecondary} />
              <Text style={[styles.toggleButtonText, showCompleted && styles.toggleButtonTextActive]}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={theme.colors.primary} />
            <Text style={styles.emptyTitle}>No Reminders Set</Text>
            <Text style={styles.emptyText}>
              Create custom reminders for maintenance and renewals
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-reminder')}
            >
              <Text style={styles.addButtonText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAndSortedReminders.length === 0 ? (
          <View style={styles.noResultsContainer}>
            {showCompleted ? (
              <>
                <History size={48} color={theme.colors.textSecondary} />
                <Text style={styles.noResultsTitle}>No completed reminders</Text>
                <Text style={styles.noResultsText}>
                  Complete some reminders to see them here
                </Text>
              </>
            ) : (
              <>
                <Search size={48} color={theme.colors.textSecondary} />
                <Text style={styles.noResultsTitle}>No active reminders found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your search terms
                </Text>
              </>
            )}
          </View>
        ) : (
          filteredAndSortedReminders.map(reminder => {
            const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
            const typeColor = getReminderTypeColor(reminder.type);
            
            return (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
                <View style={styles.reminderContent}>
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderInfo}>
                      <Text style={[styles.reminderTitle, reminder.isCompleted && styles.completedText]}>
                        {reminder.title}
                      </Text>
                      <Text style={styles.reminderVehicle}>
                        {vehicle?.name || 'Unknown Vehicle'}
                      </Text>
                      <Text style={styles.reminderDate}>
                        {showCompleted && reminder.completedAt 
                          ? `Completed: ${formatDate(reminder.completedAt.split('T')[0])}`
                          : `${formatDate(reminder.date)} at ${reminder.time}`
                        }
                      </Text>
                      {reminder.description && (
                        <Text style={styles.reminderDescription}>
                          {reminder.description}
                        </Text>
                      )}
                      {showCompleted && reminder.history && reminder.history.length > 0 && (
                        <Text style={styles.historyCount}>
                          Completed {reminder.history.length} time{reminder.history.length !== 1 ? 's' : ''}
                        </Text>
                      )}
                    </View>
                    <View style={styles.actionButtons}>
                      {!showCompleted && !reminder.isCompleted && (
                        <>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.push(`/edit-reminder?id=${reminder.id}`)}
                          >
                            <Edit3 size={18} color={theme.colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => completeReminder(reminder.id)}
                          >
                            <CheckCircle size={18} color={theme.colors.success} />
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 size={18} color={theme.colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.reminderType}>
                    <Text style={[styles.reminderTypeText, { color: typeColor }]}>
                      {reminder.type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {reminders.length > 0 && !showCompleted && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-reminder')}
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
  reminderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIndicator: {
    width: 4,
  },
  reminderContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  reminderVehicle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  reminderDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  reminderDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  reminderType: {
    marginTop: theme.spacing.sm,
  },
  reminderTypeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  completeButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  completedText: {
    opacity: 0.7,
  },
  historyCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
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