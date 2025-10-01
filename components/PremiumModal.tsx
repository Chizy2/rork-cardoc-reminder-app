import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Crown,
  X,
  Check,
  Shield,
  Users,
  Zap,
  Clock,
  Bell,
  Wrench,
  HeadphonesIcon,
  Bot,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { User } from '@/types';
import { SubscriptionPlan, PlanDetails } from '@/hooks/useSubscription';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  user: User | null;
  availablePlans: PlanDetails[];
}

const benefits = [
  {
    icon: Shield,
    title: 'Unlimited Vehicle & Document Storage',
    description: 'Store unlimited vehicles and documents without restrictions',
  },
  {
    icon: Bot,
    title: 'AI Mechanic Assistant',
    description: 'Get instant expert advice and diagnostics from our AI-powered mechanic',
  },
  {
    icon: Users,
    title: 'Dedicated Agent',
    description: 'Get personal assistance from our dedicated support agents',
  },
  {
    icon: Zap,
    title: 'Fast Document Renewals',
    description: 'Quick and efficient document renewal processing',
  },
  {
    icon: Shield,
    title: 'Penalty Fee Coverage',
    description: 'We bear the cost for any missed renewals where we failed to send reminders and agents did not contact you',
  },
  {
    icon: Bell,
    title: 'Automatic Expiry Reminders',
    description: 'Never miss a renewal with smart automated reminders',
  },
  {
    icon: Clock,
    title: 'Manual Maintenance Reminders',
    description: 'Set custom reminders for maintenance and services',
  },
  {
    icon: Wrench,
    title: 'Renewal Service Assistance',
    description: 'Professional help with all your renewal processes',
  },
  {
    icon: HeadphonesIcon,
    title: 'Priority Support',
    description: '24/7 priority customer support and assistance',
  },
];

export default function PremiumModal({ visible, onClose, onSubscribe, user, availablePlans }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('12-months');

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
    onClose();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Crown size={32} color={theme.colors.primary} />
            <Text style={styles.title}>Go Premium</Text>
            <Text style={styles.subtitle}>
              Unlock all features and get the best Cardan experience
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <View key={`benefit-${benefit.title}-${index}`} style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <IconComponent size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </View>
                  <Check size={16} color={theme.colors.success} />
                </View>
              );
            })}
          </View>

          <View style={styles.pricingContainer}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            {availablePlans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.pricingCard,
                    isSelected && styles.pricingCardSelected,
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planTitleRow}>
                      <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                        {plan.name}
                      </Text>
                      {plan.savings && (
                        <View style={styles.savingsBadge}>
                          <Text style={styles.savingsText}>{plan.savings}</Text>
                        </View>
                      )}
                    </View>
                    <View style={[
                      styles.radioButton,
                      isSelected && styles.radioButtonSelected,
                    ]}>
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                  </View>
                  
                  <View style={styles.priceRow}>
                    <Text style={[styles.currency, isSelected && styles.currencySelected]}>₦</Text>
                    <Text style={[styles.price, isSelected && styles.priceSelected]}>
                      {formatPrice(plan.totalPrice)}
                    </Text>
                  </View>
                  
                  <Text style={[styles.pricingNote, isSelected && styles.pricingNoteSelected]}>
                    ₦{formatPrice(plan.monthlyPrice)}/month for {plan.duration} months
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.guaranteeContainer}>
            <Shield size={20} color={theme.colors.success} />
            <Text style={styles.guaranteeText}>
              30-day money-back guarantee. Cancel anytime.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Crown size={20} color="#FFFFFF" />
            <Text style={styles.subscribeButtonText}>Proceed to Subscription</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
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
    backgroundColor: theme.colors.card,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  benefitsContainer: {
    marginTop: theme.spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  benefitContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  benefitTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  pricingContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  pricingCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  planName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  planNameSelected: {
    color: theme.colors.primary,
  },
  savingsBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  savingsText: {
    fontSize: theme.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  pricingLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  currency: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  currencySelected: {
    color: theme.colors.primary,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  priceSelected: {
    color: theme.colors.primary,
  },
  period: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  pricingNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  pricingNoteSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  guaranteeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subscribeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
});