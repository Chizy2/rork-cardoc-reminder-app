import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  LogOut,
  Crown,
  Calendar,
  Edit3
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { useSubscription } from '@/hooks/useSubscription';
import { formatDate } from '@/utils/date';
import PremiumModal from '@/components/PremiumModal';

export default function ProfileScreen() {
  const { user, setUser, vehicles, documents } = useAppState();
  const { isPremium, isTrialActive, daysLeftInTrial, checkSubscriptionStatus, getAvailablePlans, activatePremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // Update subscription status when user changes
  React.useEffect(() => {
    checkSubscriptionStatus(user);
  }, [user, checkSubscriptionStatus]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleUpgrade = () => {
    setShowPremiumModal(true);
  };

  const handleSubscribe = (plan: import('@/hooks/useSubscription').SubscriptionPlan) => {
    activatePremium(plan);
    if (user) {
      const plans = getAvailablePlans();
      const selectedPlan = plans.find(p => p.id === plan);
      const durationInDays = (selectedPlan?.duration || 12) * 30;
      
      setUser({
        ...user,
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000).toISOString(),
      });
      Alert.alert('Success', 'Your premium subscription has been activated! Welcome to Cardan Premium.');
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        setUser({
          ...user,
          profilePhoto: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        setUser({
          ...user,
          profilePhoto: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handleSelectPhoto },
        ...(user?.profilePhoto ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: handleRemovePhoto }] : []),
      ]
    );
  };

  const handleRemovePhoto = () => {
    if (user) {
      setUser({
        ...user,
        profilePhoto: undefined,
      });
    }
  };

  if (!user) return null;

  const getSubscriptionColor = () => {
    switch (user.subscriptionStatus) {
      case 'active':
        return theme.colors.success;
      case 'trial':
        return theme.colors.warning;
      case 'expired':
        return theme.colors.danger;
      default:
        return theme.colors.textSecondary;
    }
  };







  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.xl,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
    },
    editPhotoButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.card,
    },
    name: {
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subscriptionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      gap: 4,
    },
    subscriptionText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.sm,
      fontWeight: '600' as const,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.md,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.lg,
    },
    section: {
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    infoText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },
    upgradeButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      margin: theme.spacing.lg,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    upgradeButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
    },
    trialButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      margin: theme.spacing.lg,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    trialButtonText: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    actionText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },

  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePhotoOptions}>
          <View style={styles.avatar}>
            {user.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.profileImage} />
            ) : (
              <User size={48} color={theme.colors.primary} />
            )}
          </View>
          <View style={styles.editPhotoButton}>
            <Edit3 size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <View style={[styles.subscriptionBadge, { backgroundColor: getSubscriptionColor() }]}>
          <Crown size={14} color="#FFFFFF" />
          <Text style={styles.subscriptionText}>
            {isPremium ? (isTrialActive ? `Trial (${daysLeftInTrial} days left)` : 'Premium') : 'Expired'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{vehicles.length}</Text>
          <Text style={styles.statLabel}>Vehicles</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{documents.length}</Text>
          <Text style={styles.statLabel}>Documents</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoItem}>
          <Mail size={20} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Phone size={20} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>

        <View style={styles.infoItem}>
          <Calendar size={20} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            Expires: {formatDate(user.subscriptionExpiry)}
          </Text>
        </View>
      </View>

      {!isPremium && (
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
          <Crown size={20} color="#FFFFFF" />
          <Text style={styles.upgradeButtonText}>
            {isTrialActive ? 'View Premium Details' : 'Start 14 Days Trial'}
          </Text>
        </TouchableOpacity>
      )}

      {isTrialActive && (
        <TouchableOpacity style={styles.trialButton} onPress={handleUpgrade}>
          <Crown size={20} color={theme.colors.primary} />
          <Text style={styles.trialButtonText}>14 Days Trial - View Premium Details</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => router.push('/renewal')}
        >
          <CreditCard size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>Renewal Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <LogOut size={20} color={theme.colors.danger} />
          <Text style={[styles.actionText, { color: theme.colors.danger }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={handleSubscribe}
        user={user}
        availablePlans={getAvailablePlans()}
      />
    </ScrollView>
  );
}

