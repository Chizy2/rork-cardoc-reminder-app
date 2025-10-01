import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Camera, Calendar, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';

type DocumentType = 'insurance' | 'license' | 'roadworthiness' | 'emission' | 'registration' | 'other';

const DOCUMENT_CATEGORIES: { value: DocumentType; label: string }[] = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'license', label: 'License' },
  { value: 'roadworthiness', label: 'Roadworthiness' },
  { value: 'emission', label: 'Emission Certificate' },
  { value: 'registration', label: 'Registration' },
  { value: 'other', label: 'Other' },
];

export default function AddDocumentScreen() {
  const { vehicleId, documentId } = useLocalSearchParams<{ vehicleId: string; documentId?: string }>();
  const { vehicles, documents, addDocument, updateDocument } = useAppState();
  const insets = useSafeAreaInsets();
  
  const vehicle = vehicles.find(v => v.id === vehicleId);
  const existingDocument = documentId ? documents.find(d => d.id === documentId) : null;
  const isEditing = !!existingDocument;
  
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>(
    existingDocument?.type || 'insurance'
  );
  const [customCategoryName, setCustomCategoryName] = useState<string>(
    existingDocument?.customName || ''
  );
  const [expiryDate, setExpiryDate] = useState<Date>(
    existingDocument ? new Date(existingDocument.expiryDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | undefined>(existingDocument?.imageUri);
  const [isLoading, setIsLoading] = useState(false);

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vehicle not found</Text>
      </View>
    );
  }

  const handleImagePicker = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission denied for media library');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCamera = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission denied for camera');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleImageOptions = () => {
    if (Platform.OS === 'web') {
      handleImagePicker();
    } else {
      Alert.alert(
        'Select Image',
        'Choose how you want to add the document image',
        [
          { text: 'Camera', onPress: handleCamera },
          { text: 'Photo Library', onPress: handleImagePicker },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleSave = async () => {
    if (!imageUri) {
      console.log('Image required for document');
      return;
    }

    if (selectedCategory === 'other' && !customCategoryName.trim()) {
      console.log('Custom category name required when "Other" is selected');
      return;
    }

    setIsLoading(true);
    try {
      const documentData = {
        type: selectedCategory,
        customName: selectedCategory === 'other' ? customCategoryName.trim() : undefined,
        expiryDate: expiryDate.toISOString(),
        imageUri,
      };

      if (isEditing && existingDocument) {
        // Store old document in history before updating
        const history = existingDocument.history || [];
        const newHistoryEntry = {
          id: Date.now().toString(),
          expiryDate: existingDocument.expiryDate,
          imageUri: existingDocument.imageUri,
          updatedAt: existingDocument.updatedAt,
        };
        
        updateDocument(existingDocument.id, {
          ...documentData,
          history: [...history, newHistoryEntry],
        });
      } else {
        addDocument({
          vehicleId: vehicle.id,
          ...documentData,
        });
      }
      
      router.back();
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate instanceof Date) {
      setExpiryDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: isEditing ? 'Edit Document' : 'Add Document',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            >
              <Text style={[styles.saveButtonText, isLoading && styles.saveButtonTextDisabled]}>
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView 
        style={[styles.container, { paddingBottom: insets.bottom }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleDetails}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Category</Text>
          <View style={styles.categoryGrid}>
            {DOCUMENT_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.value && styles.categoryButtonSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(category.value);
                  if (category.value !== 'other') {
                    setCustomCategoryName('');
                  }
                }}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.value && styles.categoryButtonTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedCategory === 'other' && (
            <View style={styles.customCategoryContainer}>
              <Text style={styles.customCategoryLabel}>Document Name</Text>
              <TextInput
                style={styles.customCategoryInput}
                placeholder="Enter document name (e.g., Permit, Certificate)"
                value={customCategoryName}
                onChangeText={setCustomCategoryName}
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="words"
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expiry Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.dateButtonText}>{formatDate(expiryDate)}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Image</Text>
          
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.documentImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(undefined)}
              >
                <X size={20} color={theme.colors.card} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageOptions}>
              <Upload size={32} color={theme.colors.primary} />
              <Text style={styles.uploadButtonText}>Add Document Image</Text>
              <Text style={styles.uploadButtonSubtext}>
                Take a photo or choose from library
              </Text>
            </TouchableOpacity>
          )}
          
          {imageUri && (
            <TouchableOpacity style={styles.changeImageButton} onPress={handleImageOptions}>
              <Camera size={16} color={theme.colors.primary} />
              <Text style={styles.changeImageButtonText}>Change Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing && existingDocument?.history && existingDocument.history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document History</Text>
            {existingDocument.history.map((historyItem) => (
              <View key={historyItem.id} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  Expired: {formatDate(new Date(historyItem.expiryDate))}
                </Text>
                <Text style={styles.historyUpdated}>
                  Updated: {formatDate(new Date(historyItem.updatedAt))}
                </Text>
                {historyItem.imageUri && (
                  <Image source={{ uri: historyItem.imageUri }} style={styles.historyImage} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  saveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl * 3,
  },
  section: {
    padding: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  vehicleInfo: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  vehicleName: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  vehicleDetails: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: '45%',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: theme.colors.card,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  dateButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  uploadButtonSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  documentImage: {
    width: 300,
    height: 200,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
  },
  removeImageButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.danger,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  changeImageButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  historyDate: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  historyUpdated: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  historyImage: {
    width: 100,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  customCategoryContainer: {
    marginTop: theme.spacing.lg,
  },
  customCategoryLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  customCategoryInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});