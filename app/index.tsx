import { Redirect } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useAppState();
  const insets = useSafeAreaInsets();
  
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Redirect href="/(auth)/login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});