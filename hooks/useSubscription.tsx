import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { User } from '@/types';

export type SubscriptionPlan = '3-months' | '6-months' | '12-months';

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  duration: number;
  monthlyPrice: number;
  totalPrice: number;
  savings?: string;
}

interface SubscriptionState {
  isPremium: boolean;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  subscriptionExpiry: string | null;
  currentPlan: SubscriptionPlan | null;
  
  // Actions
  activatePremium: (plan: SubscriptionPlan) => void;
  checkSubscriptionStatus: (user: User | null) => void;
  showUpgradePrompt: () => boolean;
  getAvailablePlans: () => PlanDetails[];
}

export const [SubscriptionProvider, useSubscription] = createContextHook<SubscriptionState>(() => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [daysLeftInTrial, setDaysLeftInTrial] = useState<number>(0);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);

  const getAvailablePlans = useCallback((): PlanDetails[] => [
    {
      id: '3-months',
      name: '3 Months Plan',
      duration: 3,
      monthlyPrice: 2500,
      totalPrice: 7500,
    },
    {
      id: '6-months',
      name: '6 Months Plan',
      duration: 6,
      monthlyPrice: 2000,
      totalPrice: 12000,
      savings: 'Save ₦3,000',
    },
    {
      id: '12-months',
      name: '12 Months Plan',
      duration: 12,
      monthlyPrice: 1666.67,
      totalPrice: 20000,
      savings: 'Save ₦10,000',
    },
  ], []);

  const checkSubscriptionStatus = useCallback((user: User | null) => {
    if (!user) {
      setIsPremium(false);
      setIsTrialActive(false);
      setDaysLeftInTrial(0);
      setSubscriptionExpiry(null);
      return;
    }

    const now = new Date();
    const expiry = new Date(user.subscriptionExpiry);
    const isExpired = now > expiry;

    switch (user.subscriptionStatus) {
      case 'active':
        setIsPremium(!isExpired);
        setIsTrialActive(false);
        setSubscriptionExpiry(user.subscriptionExpiry);
        break;
      case 'trial':
        const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        setIsTrialActive(daysLeft > 0);
        setDaysLeftInTrial(daysLeft);
        setIsPremium(daysLeft > 0);
        setSubscriptionExpiry(user.subscriptionExpiry);
        break;
      case 'expired':
      default:
        setIsPremium(false);
        setIsTrialActive(false);
        setDaysLeftInTrial(0);
        setSubscriptionExpiry(user.subscriptionExpiry);
        break;
    }
  }, []);

  const activatePremium = useCallback((plan: SubscriptionPlan) => {
    setIsPremium(true);
    setIsTrialActive(false);
    setCurrentPlan(plan);
    
    const plans = getAvailablePlans();
    const selectedPlan = plans.find(p => p.id === plan);
    const durationInDays = (selectedPlan?.duration || 12) * 30;
    
    const newExpiry = new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000).toISOString();
    setSubscriptionExpiry(newExpiry);
  }, [getAvailablePlans]);

  const showUpgradePrompt = useCallback((): boolean => {
    // Show upgrade prompt if user is not premium and trial has expired
    return !isPremium && !isTrialActive;
  }, [isPremium, isTrialActive]);

  return useMemo(() => ({
    isPremium,
    isTrialActive,
    daysLeftInTrial,
    subscriptionExpiry,
    currentPlan,
    activatePremium,
    checkSubscriptionStatus,
    showUpgradePrompt,
    getAvailablePlans,
  }), [isPremium, isTrialActive, daysLeftInTrial, subscriptionExpiry, currentPlan, activatePremium, checkSubscriptionStatus, showUpgradePrompt, getAvailablePlans]);
});