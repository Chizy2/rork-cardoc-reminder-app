import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { Vehicle } from '@/types';

const vehicleTypes = ['car', 'truck', 'bike', 'bus', 'other'] as const;

export default function AddVehicleScreen() {
  const { addVehicle } = useAppState();
  const [type, setType] = useState<Vehicle['type']>('car');
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [imageUri, setImageUri] = useState<string>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !registrationNumber || !make || !model || !year) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addVehicle({
      type,
      name,
      registrationNumber,
      make,
      model,
      year,
      imageUri,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.vehicleImage} />
          ) : (
            <>
              <Camera size={32} color={theme.colors.textSecondary} />
              <Text style={styles.imageUploadText}>Add Vehicle Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <View style={styles.typeSelector}>
              {vehicleTypes.map(vType => (
                <TouchableOpacity
                  key={vType}
                  style={[
                    styles.typeOption,
                    type === vType && styles.typeOptionActive,
                  ]}
                  onPress={() => setType(vType)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === vType && styles.typeOptionTextActive,
                    ]}
                  >
                    {vType.charAt(0).toUpperCase() + vType.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., My Honda Civic"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration/License Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ABC-123"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Make *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Honda"
              value={make}
              onChangeText={setMake}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Civic"
              value={model}
              onChangeText={setModel}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2020"
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 3,
  },
  imageUpload: {
    height: 200,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imageUploadText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  form: {
    marginBottom: theme.spacing.xl * 2,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  typeOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  typeOptionTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});