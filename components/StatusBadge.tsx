import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface StatusBadgeProps {
  status: 'valid' | 'expiring' | 'expired';
  text: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {

  
  const getStatusStyle = () => {
    switch (status) {
      case 'expired':
        return {
          backgroundColor: theme.colors.danger + '20',
          borderColor: theme.colors.danger,
          color: theme.colors.danger,
        };
      case 'expiring':
        return {
          backgroundColor: theme.colors.warning + '20',
          borderColor: theme.colors.warning,
          color: theme.colors.warning,
        };
      case 'valid':
        return {
          backgroundColor: theme.colors.success + '20',
          borderColor: theme.colors.success,
          color: theme.colors.success,
        };
    }
  };

  const statusStyle = getStatusStyle();
  
  const styles = StyleSheet.create({
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      backgroundColor: statusStyle.backgroundColor,
      borderColor: statusStyle.borderColor,
    },
    text: {
      fontSize: theme.fontSize.xs,
      fontWeight: '600' as const,
      color: statusStyle.color,
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

