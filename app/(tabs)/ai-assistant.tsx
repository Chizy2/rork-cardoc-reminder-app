import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot, User, AlertCircle, Car, X } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppState } from '@/hooks/useAppState';
import { Vehicle } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const [input, setInput] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [hasShownVehicleSelector, setHasShownVehicleSelector] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { vehicles } = useAppState();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  console.log('Available vehicles for diagnosis:', vehicles.length);

  // Get vehicle context for AI
  const getVehicleContext = () => {
    if (selectedVehicle) {
      return `Selected vehicle for diagnosis: ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}. Registration: ${selectedVehicle.registrationNumber}. Vehicle type: ${selectedVehicle.type}.`;
    }
    if (vehicles.length > 0) {
      return `User has ${vehicles.length} registered vehicles: ${vehicles.map(v => `${v.year} ${v.make} ${v.model}`).join(', ')}. No specific vehicle selected for diagnosis.`;
    }
    return 'No vehicle information available. User selected "Other" for diagnosis.';
  };

  // Show vehicle selector on first load if vehicles exist
  useEffect(() => {
    if (messages.length === 0 && vehicles.length > 0 && !hasShownVehicleSelector) {
      setShowVehicleSelector(true);
      setHasShownVehicleSelector(true);
    }
  }, [messages.length, vehicles.length, hasShownVehicleSelector]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToAI = async (userMessage: string): Promise<string> => {
    if (!userMessage?.trim()) {
      throw new Error('Message cannot be empty');
    }
    
    try {
      const vehicleContext = getVehicleContext();
      console.log('Vehicle context for AI:', vehicleContext);
      console.log('User message:', userMessage);
      
      // For now, return a mock response since the AI service is having issues
      // This can be replaced with actual AI service call when it's working
      const mockResponses = [
        "I understand you're experiencing issues with your vehicle. Can you provide more details about when this problem occurs? For example, does it happen when you start the car, while driving, or when you brake?",
        "Based on what you've described, there could be several potential causes. Let me ask a few follow-up questions to help narrow down the issue: How long has this been happening? Have you noticed any other symptoms?",
        "That's helpful information. To provide the most accurate diagnosis, I'd like to know: What's the mileage on your vehicle? When was the last time you had it serviced? Have you noticed any unusual sounds, smells, or warning lights?",
        "Thank you for those details. Based on the symptoms you've described, here are the most likely causes and some initial steps you can take. However, I strongly recommend having a qualified mechanic inspect your vehicle for safety reasons."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate API delay
      const delay = 1000 + Math.random() * 2000;
      await new Promise((resolve) => {
        if (typeof resolve === 'function') {
          setTimeout(resolve, delay);
        }
      });
      
      return randomResponse;
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    if (!userMessage || userMessage.length > 1000) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending message to AI:', userMessage);
      const aiResponse = await sendMessageToAI(userMessage);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    if (vehicle) {
      if (!vehicle.id?.trim() || !vehicle.make?.trim() || !vehicle.model?.trim()) {
        console.warn('Invalid vehicle data');
        return;
      }
      console.log('Vehicle selected:', `${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    } else {
      console.log('Vehicle selected: Other');
    }
    setSelectedVehicle(vehicle);
    setShowVehicleSelector(false);
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleItem}
      onPress={() => handleVehicleSelect(item)}
      testID={`vehicle-${item.id}`}
    >
      <View style={styles.vehicleIcon}>
        <Car size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.vehicleDetails}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.registrationNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message, index: number) => {
    if (!message?.content?.trim()) {
      return null;
    }
    
    const isUser = message.role === 'user';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage
      ]}>
        <View style={styles.messageHeader}>
          {isUser ? (
            <User size={16} color={theme.colors.primary} />
          ) : (
            <Bot size={16} color={theme.colors.success} />
          )}
          <Text style={styles.messageRole}>
            {isUser ? 'You' : 'AI Mechanic'}
          </Text>
        </View>
        
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {message.content}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: insets.top + theme.spacing.md,
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    messagesContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    messageContainer: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      maxWidth: '85%',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
    },
    assistantMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    messageRole: {
      fontSize: theme.fontSize.xs,
      fontWeight: '600' as const,
      color: theme.colors.textSecondary,
    },
    messageText: {
      fontSize: theme.fontSize.md,
      lineHeight: 20,
    },
    userMessageText: {
      color: '#FFFFFF',
    },
    assistantMessageText: {
      color: theme.colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 50,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    exampleContainer: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    exampleTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    exampleItem: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.danger + '10',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      margin: theme.spacing.md,
    },
    errorText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.danger,
      flex: 1,
      lineHeight: 16,
    },
    toolContainer: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.xs,
    },
    toolText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    toolErrorContainer: {
      backgroundColor: theme.colors.danger + '10',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.xs,
    },
    toolErrorText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.danger,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    loadingText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      maxHeight: '80%',
      width: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold' as const,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    modalSubtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    vehicleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    vehicleIcon: {
      marginRight: theme.spacing.md,
    },
    vehicleInfo: {
      flex: 1,
    },
    vehicleName: {
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: 2,
    },
    vehicleDetails: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    otherVehicleButton: {
      backgroundColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    otherVehicleText: {
      fontSize: theme.fontSize.md,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    selectedVehicleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    selectedVehicleText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      flex: 1,
    },
    changeVehicleButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
    },
    changeVehicleText: {
      fontSize: theme.fontSize.xs,
      color: '#FFFFFF',
      fontWeight: '600' as const,
    },
    vehicleList: {
      maxHeight: 300,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Vehicle Assistant</Text>
        <Text style={styles.headerSubtitle}>Describe your vehicle issues for instant diagnosis</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Bot size={64} color={theme.colors.primary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>AI Mechanic Ready to Help!</Text>
              <Text style={styles.emptyText}>
                I&apos;m your AI automotive expert! Describe any issues you&apos;re experiencing with your vehicle and I&apos;ll provide detailed diagnostics, ask follow-up questions, and guide you through potential solutions.
              </Text>
              
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Try asking about:</Text>
                <Text style={styles.exampleItem}>• &quot;My car makes a squeaking noise when I brake&quot;</Text>
                <Text style={styles.exampleItem}>• &quot;Engine won&apos;t start in the morning&quot;</Text>
                <Text style={styles.exampleItem}>• &quot;Strange vibration while driving&quot;</Text>
                <Text style={styles.exampleItem}>• &quot;Check engine light is on&quot;</Text>
                <Text style={styles.exampleItem}>• &quot;What could cause my car to overheat?&quot;</Text>
                <Text style={styles.exampleItem}>• &quot;My transmission is slipping&quot;</Text>
              </View>
            </View>
          ) : (
            messages.map((message, index) => {
              const renderedMessage = renderMessage(message, index);
              return renderedMessage;
            })
          )}
          
          {(isLoading || (messages.length > 0 && messages[messages.length - 1]?.role === 'user')) && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={styles.messageHeader}>
                <Bot size={16} color={theme.colors.success} />
                <Text style={styles.messageRole}>AI Mechanic</Text>
              </View>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Analyzing your vehicle issue...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View>
          {selectedVehicle && (
            <View style={styles.selectedVehicleContainer}>
              <Car size={16} color={theme.colors.primary} />
              <Text style={styles.selectedVehicleText}>
                Diagnosing: {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </Text>
              <TouchableOpacity
                style={styles.changeVehicleButton}
                onPress={() => setShowVehicleSelector(true)}
              >
                <Text style={styles.changeVehicleText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Describe your vehicle issue..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={1000}
              testID="ai-input"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
              testID="send-button"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={theme.colors.danger} />
          <Text style={styles.errorText}>
            {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
          </Text>
        </View>
      )}

      <Modal
        visible={showVehicleSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVehicleSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vehicle</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowVehicleSelector(false)}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Choose which vehicle you need help diagnosing:
            </Text>
            
            <FlatList
              data={vehicles}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.vehicleList}
            />
            
            <TouchableOpacity
              style={styles.otherVehicleButton}
              onPress={() => handleVehicleSelect(null)}
              testID="other-vehicle-button"
            >
              <Text style={styles.otherVehicleText}>Other Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}