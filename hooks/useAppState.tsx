import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { User, Vehicle, Document, Reminder } from '@/types';

interface AppState {
  user: User | null;
  vehicles: Vehicle[];
  documents: Document[];
  reminders: Reminder[];
  isLoading: boolean;
  
  // User actions
  setUser: (user: User | null) => void;
  
  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  renewDocument: (id: string, newExpiryDate: string, imageUri?: string) => void;
  
  // Reminder actions
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  
  // Utility actions
  clearAllData: () => Promise<void>;
  clearCorruptedData: () => Promise<void>;
}

export const [AppStateProvider, useAppState] = createContextHook<AppState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('=== App Initialization Started ===');
        
        // First, let's check for any obvious corruption patterns
        const allKeys = await AsyncStorage.getAllKeys();
        const appKeys = allKeys.filter(key => 
          ['user', 'vehicles', 'documents', 'reminders', 'theme_mode'].includes(key)
        );
        
        console.log('Found app keys in storage:', appKeys);
        
        // Enhanced corruption check before full load
        for (const key of appKeys) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value && value.trim()) {
              const trimmed = value.trim();
              
              // Check for various corruption patterns
              const corruptionPatterns = [
                /^o(?!bject|n|ff|r|ther|wner)/i,
                /\[object\s+Object\]/i,
                /^object\s+Object/i,
                /^\[object/i,
                /^function/i,
                /^undefined$/i,
                /^NaN$/i,
                /^Infinity$/i,
                /^\s*o\s*$/i,
              ];
              
              const isCorrupted = corruptionPatterns.some(pattern => pattern.test(trimmed));
              
              if (isCorrupted) {
                console.warn(`Detected corruption in key '${key}':`, trimmed.substring(0, 50));
                await AsyncStorage.removeItem(key);
                console.log(`Removed corrupted key: ${key}`);
              } else if (key !== 'theme_mode') {
                // For non-theme keys, try to parse as JSON to validate
                try {
                  JSON.parse(trimmed);
                } catch (parseError) {
                  console.warn(`Invalid JSON in key '${key}':`, parseError);
                  await AsyncStorage.removeItem(key);
                  console.log(`Removed invalid JSON key: ${key}`);
                }
              }
            }
          } catch (error) {
            console.error(`Error checking key '${key}':`, error);
            await AsyncStorage.removeItem(key);
          }
        }
        
        // Now proceed with normal data loading
        await loadData();
        console.log('=== App Initialization Completed ===');
      } catch (error) {
        console.error('=== App Initialization Failed ===', error);
        await loadData(); // Fallback to normal load
      }
    };
    
    initializeApp();
  }, []);

  const safeJsonParse = (str: string | null, fallback: any = null, key?: string) => {
    if (!str || str === 'undefined' || str === 'null' || str.trim() === '') {
      return fallback;
    }
    
    try {
      const trimmed = str.trim();
      
      // Additional validation for common corruption patterns
      if (trimmed.length === 0) return fallback;
      if (trimmed === 'undefined' || trimmed === 'null') return fallback;
      
      // Enhanced corruption detection - check BEFORE attempting to parse
      const corruptionPatterns = [
        /^o(?!bject|n|ff|r|ther|wner)/i,
        /\[object\s+Object\]/i,
        /^object\s+Object/i,
        /^\[object/i,
        /^function/i,
        /^undefined$/i,
        /^NaN$/i,
        /^Infinity$/i,
        /^\s*o\s*$/i,
      ];
      
      const isCorrupted = corruptionPatterns.some(pattern => pattern.test(trimmed));
      if (isCorrupted) {
        console.warn(`Corruption pattern detected for key '${key}':`, trimmed.substring(0, 50));
        if (key) {
          AsyncStorage.removeItem(key).catch(err => 
            console.error(`Failed to remove corrupted key '${key}':`, err)
          );
        }
        return fallback;
      }
      
      // Check for valid JSON start characters BEFORE parsing
      const firstChar = trimmed.charAt(0);
      const isValidJsonStart = 
        firstChar === '{' || 
        firstChar === '[' || 
        firstChar === '"' || 
        trimmed === 'true' || 
        trimmed === 'false' || 
        trimmed === 'null' || 
        (!isNaN(Number(trimmed)) && isFinite(Number(trimmed)));
      
      if (!isValidJsonStart) {
        console.warn(`Invalid JSON format detected for key '${key}':`, trimmed.substring(0, 50));
        if (key) {
          AsyncStorage.removeItem(key).catch(err => 
            console.error(`Failed to remove invalid key '${key}':`, err)
          );
        }
        return fallback;
      }
      
      const parsed = JSON.parse(trimmed);
      
      // Validate the parsed result makes sense for the key
      if (key === 'user' && parsed && typeof parsed !== 'object') {
        console.warn(`Invalid user data type for key '${key}':`, typeof parsed);
        return fallback;
      }
      
      if ((key === 'vehicles' || key === 'documents' || key === 'reminders') && parsed && !Array.isArray(parsed)) {
        console.warn(`Invalid array data type for key '${key}':`, typeof parsed);
        return fallback;
      }
      
      return parsed;
    } catch (error) {
      console.error(`JSON parse error for key '${key}':`, error);
      console.error(`Corrupted data sample:`, str?.substring(0, 100));
      
      if (key) {
        AsyncStorage.removeItem(key).catch(err => 
          console.error(`Failed to remove corrupted key '${key}':`, err)
        );
      }
      
      return fallback;
    }
  };

  const loadData = async () => {
    try {
      const [userStr, vehiclesStr, documentsStr, remindersStr] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('vehicles'),
        AsyncStorage.getItem('documents'),
        AsyncStorage.getItem('reminders'),
      ]);

      console.log('Loading data from AsyncStorage...');
      
      // First, let's check what keys exist in AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage keys:', allKeys);
      
      console.log('Raw data from AsyncStorage:');
      console.log('User data:', userStr ? `${userStr.substring(0, 100)}${userStr.length > 100 ? '...' : ''}` : 'null');
      console.log('Vehicles data:', vehiclesStr ? `${vehiclesStr.substring(0, 100)}${vehiclesStr.length > 100 ? '...' : ''}` : 'null');
      console.log('Documents data:', documentsStr ? `${documentsStr.substring(0, 100)}${documentsStr.length > 100 ? '...' : ''}` : 'null');
      console.log('Reminders data:', remindersStr ? `${remindersStr.substring(0, 100)}${remindersStr.length > 100 ? '...' : ''}` : 'null');

      const userData = safeJsonParse(userStr, null, 'user');
      const vehiclesData = safeJsonParse(vehiclesStr, [], 'vehicles');
      const documentsData = safeJsonParse(documentsStr, [], 'documents');
      const remindersData = safeJsonParse(remindersStr, [], 'reminders');

      // Clear corrupted data if parsing failed
      const keysToRemove: string[] = [];
      if (userStr && userData === null && userStr !== 'null') keysToRemove.push('user');
      if (vehiclesStr && Array.isArray(vehiclesData) && vehiclesData.length === 0 && vehiclesStr !== '[]') keysToRemove.push('vehicles');
      if (documentsStr && Array.isArray(documentsData) && documentsData.length === 0 && documentsStr !== '[]') keysToRemove.push('documents');
      if (remindersStr && Array.isArray(remindersData) && remindersData.length === 0 && remindersStr !== '[]') keysToRemove.push('reminders');
      
      if (keysToRemove.length > 0) {
        console.log('Clearing corrupted keys:', keysToRemove);
        await AsyncStorage.multiRemove(keysToRemove);
      }

      console.log('Parsed data results:');
      console.log('User parsed:', userData ? 'success' : 'failed/null');
      console.log('Vehicles parsed:', Array.isArray(vehiclesData) ? `${vehiclesData.length} items` : 'failed');
      console.log('Documents parsed:', Array.isArray(documentsData) ? `${documentsData.length} items` : 'failed');
      console.log('Reminders parsed:', Array.isArray(remindersData) ? `${remindersData.length} items` : 'failed');

      if (userData) setUser(userData);
      setVehicles(vehiclesData);
      setDocuments(documentsData);
      setReminders(remindersData);
      
      console.log('Data loading completed successfully');
    } catch (error) {
      console.error('Critical error loading data:', error);
      console.log('Clearing all potentially corrupted data due to critical error');
      
      try {
        await AsyncStorage.multiRemove(['user', 'vehicles', 'documents', 'reminders']);
        console.log('Successfully cleared all data');
      } catch (clearError) {
        console.error('Error clearing data:', clearError);
      }
      
      // Reset to defaults on error
      setUser(null);
      setVehicles([]);
      setDocuments([]);
      setReminders([]);
    } finally {
      setIsLoading(false);
      console.log('Data loading process finished');
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      // Validate data before saving
      if (data === undefined) {
        console.warn(`Attempting to save undefined data for key '${key}', skipping`);
        return;
      }
      
      const jsonString = JSON.stringify(data);
      
      // Additional validation - ensure the stringified data can be parsed back
      try {
        JSON.parse(jsonString);
      } catch (parseError) {
        console.error(`Data serialization validation failed for key '${key}':`, parseError);
        return;
      }
      
      await AsyncStorage.setItem(key, jsonString);
      console.log(`Successfully saved data for key '${key}', size: ${jsonString.length} chars`);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Vehicle actions
  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    saveData('vehicles', updated);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    const updated = vehicles.map(v => v.id === id ? { ...v, ...updates } : v);
    setVehicles(updated);
    saveData('vehicles', updated);
  };

  const deleteVehicle = (id: string) => {
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    saveData('vehicles', updated);
    
    // Also delete related documents and reminders
    const updatedDocs = documents.filter(d => d.vehicleId !== id);
    setDocuments(updatedDocs);
    saveData('documents', updatedDocs);
    
    const updatedReminders = reminders.filter(r => r.vehicleId !== id);
    setReminders(updatedReminders);
    saveData('reminders', updatedReminders);
  };

  // Document actions
  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'valid',
    };
    const updated = [...documents, newDocument];
    setDocuments(updated);
    saveData('documents', updated);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const updated = documents.map(d => 
      d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    );
    setDocuments(updated);
    saveData('documents', updated);
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    saveData('documents', updated);
  };

  const renewDocument = (id: string, newExpiryDate: string, imageUri?: string) => {
    const documentToRenew = documents.find(d => d.id === id);
    if (!documentToRenew) return;

    // Create history entry from current document
    const historyEntry = {
      id: Date.now().toString() + '_history',
      expiryDate: documentToRenew.expiryDate,
      imageUri: documentToRenew.imageUri,
      updatedAt: documentToRenew.updatedAt,
    };

    // Update document with new details and add to history
    const updatedDocument = {
      ...documentToRenew,
      expiryDate: newExpiryDate,
      imageUri: imageUri || documentToRenew.imageUri,
      status: 'valid' as const,
      updatedAt: new Date().toISOString(),
      history: [...(documentToRenew.history || []), historyEntry],
    };

    const updated = documents.map(d => d.id === id ? updatedDocument : d);
    setDocuments(updated);
    saveData('documents', updated);
  };

  // Reminder actions
  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveData('reminders', updated);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updated = reminders.map(r => r.id === id ? { ...r, ...updates } : r);
    setReminders(updated);
    saveData('reminders', updated);
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveData('reminders', updated);
  };

  const completeReminder = (id: string) => {
    const reminderToComplete = reminders.find(r => r.id === id);
    if (!reminderToComplete) return;

    // Create history entry from current reminder
    const historyEntry = {
      id: Date.now().toString() + '_history',
      title: reminderToComplete.title,
      type: reminderToComplete.type,
      date: reminderToComplete.date,
      time: reminderToComplete.time,
      description: reminderToComplete.description,
      completedAt: new Date().toISOString(),
    };

    // Update reminder as completed and add to history
    const updatedReminder = {
      ...reminderToComplete,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      history: [...(reminderToComplete.history || []), historyEntry],
    };

    const updated = reminders.map(r => r.id === id ? updatedReminder : r);
    setReminders(updated);
    saveData('reminders', updated);
  };

  const setUserWithPersist = (user: User | null) => {
    setUser(user);
    if (user) {
      saveData('user', user);
    } else {
      AsyncStorage.removeItem('user');
    }
  };

  const clearAllData = async () => {
    try {
      console.log('Clearing all app data...');
      await AsyncStorage.multiRemove(['user', 'vehicles', 'documents', 'reminders', 'theme_mode']);
      setUser(null);
      setVehicles([]);
      setDocuments([]);
      setReminders([]);
      console.log('All app data cleared successfully');
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  };

  const clearCorruptedData = async () => {
    try {
      console.log('=== Starting Corrupted Data Cleanup ===');
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => 
        ['user', 'vehicles', 'documents', 'reminders', 'theme_mode'].includes(key)
      );
      
      console.log('App keys found for cleanup:', appKeys);
      
      const keysToRemove: string[] = [];
      
      for (const key of appKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          console.log(`Checking key '${key}':`, value ? value.substring(0, 100) : 'null');
          
          if (value && value !== 'null' && value !== 'undefined') {
            // Try to parse each value to check if it's valid JSON
            if (key === 'theme_mode') {
              // Theme is just a string, not JSON
              if (!['light', 'dark', 'system'].includes(value.trim())) {
                console.log(`Invalid theme value detected: ${value}`);
                keysToRemove.push(key);
              }
            } else {
              // Other keys should be valid JSON
              const trimmed = value.trim();
              
              // Enhanced corruption pattern detection
              const corruptionPatterns = [
                /^o(?!bject|n|ff|r|ther|wner)/i,
                /\[object\s+Object\]/i,
                /^object\s+Object/i,
                /^\[object/i,
                /^function/i,
                /^undefined$/i,
                /^NaN$/i,
                /^Infinity$/i,
                /^\s*o\s*$/i,
              ];
              
              const isCorrupted = corruptionPatterns.some(pattern => pattern.test(trimmed));
              
              if (isCorrupted) {
                console.log(`Corruption pattern detected in '${key}':`, trimmed.substring(0, 50));
                keysToRemove.push(key);
              } else {
                // Try to parse
                JSON.parse(value);
                console.log(`Key '${key}' is valid JSON`);
              }
            }
          }
        } catch (parseError) {
          console.log(`Parse error for key '${key}':`, parseError);
          keysToRemove.push(key);
        }
      }
      
      if (keysToRemove.length > 0) {
        console.log('Removing corrupted keys:', keysToRemove);
        await AsyncStorage.multiRemove(keysToRemove);
        console.log('Successfully removed corrupted keys');
      } else {
        console.log('No corrupted keys found');
      }
      
      // Reload data after cleanup
      console.log('Reloading data after cleanup...');
      await loadData();
      console.log('=== Corrupted Data Cleanup Completed ===');
    } catch (error) {
      console.error('=== Error during corrupted data cleanup ===', error);
    }
  };

  return {
    user,
    vehicles,
    documents,
    reminders,
    isLoading,
    setUser: setUserWithPersist,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDocument,
    updateDocument,
    deleteDocument,
    renewDocument,
    addReminder,
    updateReminder,
    deleteReminder,
    completeReminder,
    clearAllData,
    clearCorruptedData,
  };
});