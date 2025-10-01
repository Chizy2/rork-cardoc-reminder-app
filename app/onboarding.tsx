import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, Car, FileText, Bell, Shield } from 'lucide-react-native';
import { theme } from '@/constants/theme';



interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Manage Your Vehicles',
    description: 'Keep all your vehicle information organized in one secure place. Add multiple vehicles and track their details effortlessly.',
    icon: <Car size={80} color={theme.colors.primary} />,
    color: theme.colors.primaryLight,
  },
  {
    id: 2,
    title: 'Store Documents Safely',
    description: 'Upload and store all your important vehicle documents. Never lose track of registration, insurance, or inspection papers again.',
    icon: <FileText size={80} color={theme.colors.accent} />,
    color: '#E6F9F7',
  },
  {
    id: 3,
    title: 'Never Miss Renewals',
    description: 'Get timely reminders for document renewals and vehicle maintenance. Stay compliant and avoid penalties with smart notifications.',
    icon: <Bell size={80} color={theme.colors.warning} />,
    color: '#FEF3E2',
  },
  {
    id: 4,
    title: 'Premium Protection',
    description: 'Upgrade to Premium for unlimited storage, dedicated support, and liability coverage for missed registrations.',
    icon: <Shield size={80} color={theme.colors.success} />,
    color: theme.colors.successLight,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
          {step.icon}
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentStep
                      ? theme.colors.primary
                      : theme.colors.border,
                  width: index === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  skipButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  skipText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },
});