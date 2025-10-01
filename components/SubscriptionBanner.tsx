import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, X, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useSubscription } from '@/hooks/useSubscription';
import { useAppState } from '@/hooks/useAppState';
import PremiumModal from './PremiumModal';

interface SubscriptionBannerProps {
  onDismiss?: () => void;
}

export default function SubscriptionBanner({ onDismiss }: SubscriptionBannerProps) {
  const { isPremium, isTrialActive, daysLeftInTrial, showUpgradePrompt, getAvailablePlans, activatePremium } = useSubscription();
  const { user, setUser } = useAppState();

  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

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
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // Don't show banner if user is premium or banner is dismissed
  if (isPremium || isDismissed) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
    },
    trialContainer: {
      backgroundColor: theme.colors.warning + '10',
      borderColor: theme.colors.warning,
    },
    expiredContainer: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    trialText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.warning,
      fontWeight: '500' as const,
    },
    expiredText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: '500' as const,
    },
    upgradeButton: {
      backgroundColor: theme.colors.warning,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    upgradeButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.xs,
      fontWeight: '600' as const,
    },
    premiumButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
    },
    premiumButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.xs,
      fontWeight: '600' as const,
    },
    dismissButton: {
      padding: theme.spacing.xs,
    },
  });

  // Show trial banner if trial is active
  if (isTrialActive) {
    return (
      <View style={[styles.container, styles.trialContainer]}>
        <View style={styles.content}>
          <Clock size={16} color={theme.colors.warning} />
          <Text style={styles.trialText}>
            {daysLeftInTrial} days left in your free trial
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => setShowPremiumModal(true)}
        >
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
          <X size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
          user={user}
          availablePlans={getAvailablePlans()}
        />
      </View>
    );
  }

  // Show upgrade banner if trial has expired
  if (showUpgradePrompt()) {
    return (
      <View style={[styles.container, styles.expiredContainer]}>
        <View style={styles.content}>
          <Crown size={16} color={theme.colors.primary} />
          <Text style={styles.expiredText}>
            Upgrade to Premium for unlimited access
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.premiumButton}
          onPress={() => setShowPremiumModal(true)}
        >
          <Text style={styles.premiumButtonText}>Go Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
          <X size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
          user={user}
          availablePlans={getAvailablePlans()}
        />
      </View>
    );
  }

  return null;
}

