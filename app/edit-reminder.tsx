import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, Calendar, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import type { ReminderType } from '@/types';

const REMINDER_TYPES: { value: ReminderType; label: string }[] = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'registration', label: 'Registration' },
  { value: 'service', label: 'Service' },
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'other', label: 'Other' },
];

export default function EditReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicles, reminders, updateReminder } = useAppState();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<ReminderType>('maintenance');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [showVehiclePicker, setShowVehiclePicker] = useState<boolean>(false);
  const [showTypePicker, setShowTypePicker] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const parseDate = (dateStr: string): Date => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  useEffect(() => {
    if (id) {
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        setSelectedVehicle(reminder.vehicleId);
        setTitle(reminder.title);
        setType(reminder.type);
        setSelectedDate(parseDate(reminder.date));
        setSelectedTime(parseTime(reminder.time));
        setDescription(reminder.description || '');
      }
    }
  }, [id, reminders]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleSave = () => {
    if (!selectedVehicle || !title) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Reminder ID not found');
      return;
    }

    updateReminder(id, {
      vehicleId: selectedVehicle,
      title,
      type,
      date: formatDate(selectedDate),
      time: formatTime(selectedTime),
      description,
    });

    Alert.alert('Success', 'Reminder updated successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const selectedVehicleName = vehicles.find(v => v.id === selectedVehicle)?.name || 'Select Vehicle';
  const selectedTypeName = REMINDER_TYPES.find(t => t.value === type)?.label || 'Select Type';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Vehicle *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowVehiclePicker(!showVehiclePicker)}
          >
            <Text style={[styles.pickerText, !selectedVehicle && styles.placeholder]}>
              {selectedVehicleName}
            </Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showVehiclePicker && (
            <View style={styles.pickerOptions}>
              {vehicles.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedVehicle(vehicle.id);
                    setShowVehiclePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{vehicle.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter reminder title"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <Text style={styles.pickerText}>{selectedTypeName}</Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showTypePicker && (
            <View style={styles.pickerOptions}>
              {REMINDER_TYPES.map(reminderType => (
                <TouchableOpacity
                  key={reminderType.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    setType(reminderType.value);
                    setShowTypePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{reminderType.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: theme.spacing.sm }]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={formatDate(selectedDate)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    if (!isNaN(newDate.getTime())) {
                      setSelectedDate(newDate);
                    }
                    setShowDatePicker(false);
                  }}
                  style={styles.webDateInput}
                />
              ) : (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )
            )}
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: theme.spacing.sm }]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={theme.colors.primary} />
              <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              Platform.OS === 'web' ? (
                <input
                  type="time"
                  value={formatTime(selectedTime)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newTime = new Date();
                    newTime.setHours(hours || 0, minutes || 0, 0, 0);
                    setSelectedTime(newTime);
                    setShowTimePicker(false);
                  }}
                  style={styles.webTimeInput}
                />
              ) : (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )
            )}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Update Reminder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 3,
  },
  field: {
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 100,
  },
  picker: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSecondary,
  },
  pickerOptions: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerOptionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  dateTimeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  dateTimeText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  webDateInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  webTimeInput: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
});