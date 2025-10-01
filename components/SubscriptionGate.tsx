import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, Lock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useSubscription } from '@/hooks/useSubscription';
import { useAppState } from '@/hooks/useAppState';
import PremiumModal from './PremiumModal';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  showUpgradeButton?: boolean;
}

export default function SubscriptionGate({ 
  children, 
  feature, 
  description = 'This feature requires a premium subscription',
  showUpgradeButton = true 
}: SubscriptionGateProps) {
  const { isPremium, getAvailablePlans, activatePremium } = useSubscription();
  const { user, setUser } = useAppState();
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

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

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockContainer}>
        <Lock size={32} color={theme.colors.textSecondary} />
        <Text style={styles.title}>{feature} - Premium Feature</Text>
        <Text style={styles.description}>{description}</Text>
        
        {showUpgradeButton && (
          <TouchableOpacity 
            style={styles.upgradeButton} 
            onPress={() => setShowPremiumModal(true)}
          >
            <Crown size={16} color="#FFFFFF" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});