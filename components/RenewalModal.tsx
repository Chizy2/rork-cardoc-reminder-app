import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Calendar, Upload, CheckCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Document } from '@/types';
import { formatDate } from '@/utils/date';

interface RenewalModalProps {
  visible: boolean;
  onClose: () => void;
  document: Document;
  onRenew: (newExpiryDate: string, imageUri?: string) => void;
}

export function RenewalModal({ visible, onClose, document, onRenew }: RenewalModalProps) {
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRenew = async () => {
    if (!newExpiryDate.trim()) {
      Alert.alert('Error', 'Please enter a new expiry date');
      return;
    }

    const selectedDate = new Date(newExpiryDate);
    const today = new Date();
    
    if (selectedDate <= today) {
      Alert.alert('Error', 'Expiry date must be in the future');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onRenew(newExpiryDate, imageUri || undefined);
      setNewExpiryDate('');
      setImageUri('');
      onClose();
      Alert.alert('Success', 'Document renewed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to renew document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewExpiryDate('');
    setImageUri('');
    onClose();
  };

  const handleImageUpload = () => {
    // Placeholder for image upload functionality
    Alert.alert(
      'Upload Image',
      'Image upload functionality will be implemented with camera/gallery access',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mock Upload', 
          onPress: () => setImageUri('https://via.placeholder.com/300x200?text=Document+Image')
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mark as Renewed</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>
              {document.customName || document.type}
            </Text>
            <Text style={styles.currentExpiry}>
              Current expiry: {formatDate(document.expiryDate)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Expiry Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
                value={newExpiryDate}
                onChangeText={setNewExpiryDate}
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              />
            </View>
            <Text style={styles.helperText}>
              Enter the new expiry date in YYYY-MM-DD format
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Image (Optional)</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Upload size={20} color={theme.colors.primary} />
              <Text style={styles.uploadButtonText}>
                {imageUri ? 'Change Image' : 'Upload New Image'}
              </Text>
            </TouchableOpacity>
            {imageUri && (
              <View style={styles.imagePreview}>
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={styles.imagePreviewText}>Image selected</Text>
              </View>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens when you renew?</Text>
            <Text style={styles.infoText}>
              • The current document will be moved to history{"\n"}
              • A new document entry will be created with the updated expiry date{"\n"}
              • You'll receive new reminders based on the new expiry date
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.renewButton, isSubmitting && styles.disabledButton]}
            onPress={handleRenew}
            disabled={isSubmitting}
          >
            <Text style={styles.renewButtonText}>
              {isSubmitting ? 'Renewing...' : 'Mark as Renewed'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  documentInfo: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  documentTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  currentExpiry: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  helperText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    gap: theme.spacing.sm,
  },
  uploadButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  imagePreviewText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
  },
  infoBox: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '600',
  },
  renewButton: {
    backgroundColor: theme.colors.primary,
  },
  renewButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.card,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});