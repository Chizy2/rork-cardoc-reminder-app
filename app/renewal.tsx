import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';

import { ChevronDown, MessageCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';

const CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Kaduna',
  'Jos',
];

const VEHICLE_CATEGORIES = [
  'Car',
  'Truck',
  'Bus',
  'Motorcycle',
  'Trailer',
  'Other',
];

const DOCUMENT_TYPES = [
  { value: 'insurance', label: 'Vehicle Insurance', price: 25000 },
  { value: 'registration', label: 'Vehicle Registration', price: 15000 },
  { value: 'roadworthiness', label: 'Roadworthiness Certificate', price: 8000 },
  { value: 'drivers_license', label: 'Driver\'s License', price: 6500 },
  { value: 'permit', label: 'Commercial Permit', price: 12000 },
];

const PAPER_TYPES: Record<string, string[]> = {
  insurance: ['Third Party', 'Comprehensive', 'Commercial'],
  registration: ['New Registration', 'Renewal', 'Change of Ownership'],
  roadworthiness: ['New Certificate', 'Renewal'],
  drivers_license: ['New License', 'Renewal', 'Replacement'],
  permit: ['New Permit', 'Renewal'],
};

export default function RenewalScreen() {
  const { vehicles } = useAppState();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [selectedPaper, setSelectedPaper] = useState<string>('');
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState<boolean>(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [showDocumentPicker, setShowDocumentPicker] = useState<boolean>(false);
  const [showPaperPicker, setShowPaperPicker] = useState<boolean>(false);

  const selectedDocumentData = DOCUMENT_TYPES.find(d => d.value === selectedDocument);
  const availablePapers = selectedDocument ? PAPER_TYPES[selectedDocument] || [] : [];
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  const handleStartRenewal = () => {
    if (!selectedCity || !selectedCategory || !selectedDocument || !selectedPaper) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const vehicleInfo = selectedVehicle && selectedVehicleData 
      ? `${selectedVehicleData.name} (${selectedVehicleData.registrationNumber})`
      : registrationNumber;

    const message = `Hi! I would like to renew my vehicle documents with the following details:\n\n` +
      `📍 City: ${selectedCity}\n` +
      `🚗 Vehicle: ${vehicleInfo}\n` +
      `📋 Category: ${selectedCategory}\n` +
      `📄 Document Type: ${selectedDocumentData?.label}\n` +
      `📝 Paper Type: ${selectedPaper}\n` +
      `💰 Estimated Price: ₦${selectedDocumentData?.price.toLocaleString()}\n\n` +
      `Please let me know the next steps to proceed with the renewal process.`;

    const whatsappUrl = `whatsapp://send?phone=+2348027482094&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            'WhatsApp Not Available',
            'Please install WhatsApp or contact us directly at +234 802 748 2094'
          );
        }
      })
      .catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert(
          'Error',
          'Unable to open WhatsApp. Please contact us directly at +234 802 748 2094'
        );
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Renewal Service</Text>
        <Text style={styles.subtitle}>
          Let us help you renew your vehicle documents quickly and easily
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>City *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowCityPicker(!showCityPicker)}
          >
            <Text style={[styles.pickerText, !selectedCity && styles.placeholder]}>
              {selectedCity || 'Select City'}
            </Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showCityPicker && (
            <View style={styles.pickerOptions}>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedCity(city);
                    setShowCityPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowVehiclePicker(!showVehiclePicker)}
          >
            <Text style={[styles.pickerText, !selectedVehicle && styles.placeholder]}>
              {selectedVehicleData?.name || 'Select from your vehicles'}
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
                    setRegistrationNumber(vehicle.registrationNumber);
                    setSelectedCategory(vehicle.type);
                    setShowVehiclePicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>
                    {vehicle.name} ({vehicle.registrationNumber})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            style={styles.input}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="Enter registration number"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Category *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerText, !selectedCategory && styles.placeholder]}>
              {selectedCategory || 'Select Category'}
            </Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.pickerOptions}>
              {VEHICLE_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Document Type *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowDocumentPicker(!showDocumentPicker)}
          >
            <Text style={[styles.pickerText, !selectedDocument && styles.placeholder]}>
              {selectedDocumentData?.label || 'Select Document Type'}
            </Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showDocumentPicker && (
            <View style={styles.pickerOptions}>
              {DOCUMENT_TYPES.map(docType => (
                <TouchableOpacity
                  key={docType.value}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedDocument(docType.value);
                    setSelectedPaper('');
                    setShowDocumentPicker(false);
                  }}
                >
                  <View style={styles.documentOption}>
                    <Text style={styles.pickerOptionText}>{docType.label}</Text>
                    <Text style={styles.priceText}>₦{docType.price.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedDocument && availablePapers.length > 0 && (
          <View style={styles.field}>
            <Text style={styles.label}>Paper Type *</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowPaperPicker(!showPaperPicker)}
            >
              <Text style={[styles.pickerText, !selectedPaper && styles.placeholder]}>
                {selectedPaper || 'Select Paper Type'}
              </Text>
              <ChevronDown size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {showPaperPicker && (
              <View style={styles.pickerOptions}>
                {availablePapers.map(paper => (
                  <TouchableOpacity
                    key={paper}
                    style={styles.pickerOption}
                    onPress={() => {
                      setSelectedPaper(paper);
                      setShowPaperPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{paper}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {selectedDocumentData && (
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceAmount}>₦{selectedDocumentData.price.toLocaleString()}</Text>
            <Text style={styles.priceNote}>
              *Final price may vary based on specific requirements
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.renewalButton} onPress={handleStartRenewal}>
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.renewalButtonText}>Start Renewal Process</Text>
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
  header: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  form: {
    padding: theme.spacing.lg,
  },
  field: {
    marginBottom: theme.spacing.lg,
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
  documentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  priceLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  priceAmount: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  priceNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  renewalButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  renewalButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});