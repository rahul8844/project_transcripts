import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  timestamp: Date;
  confidence: number;
}

const MenuListeningScreen: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentItem, setCurrentItem] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const voiceRef = useRef<any>(null);

  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
    setTranscript('Listening...');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    setTranscript('Processing speech...');
    processTranscript();
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const recognizedText = event.value[0];
      setTranscript(recognizedText);
      setCurrentItem(recognizedText);
    }
  };

  const onSpeechError = (error: any) => {
    setIsListening(false);
    setTranscript('Error: ' + error.message);
    Alert.alert('Speech Recognition Error', error.message);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setCurrentItem('');
      setTranscript('Start speaking...');
    } catch (error) {
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const processTranscript = () => {
    if (!currentItem.trim()) return;

    setIsProcessing(true);
    
    // Simple parsing logic for menu items
    const text = currentItem.toLowerCase();
    
    // Look for quantity indicators
    const quantityMatch = text.match(/(\d+)\s*(?:x|of|quantity|pieces?|items?|servings?)/i);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
    
    // Look for common food keywords
    const foodKeywords = [
      'pizza', 'burger', 'pasta', 'salad', 'soup', 'steak', 'chicken', 'fish',
      'rice', 'noodles', 'sandwich', 'wrap', 'taco', 'burrito', 'sushi',
      'dessert', 'cake', 'ice cream', 'coffee', 'tea', 'juice', 'water',
      'beer', 'wine', 'cocktail', 'appetizer', 'main course', 'side dish'
    ];
    
    let itemName = currentItem.trim();
    
    // Try to extract food item name
    for (const keyword of foodKeywords) {
      if (text.includes(keyword)) {
        itemName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        break;
      }
    }
    
    // If no food keyword found, use the first few words
    if (itemName === currentItem.trim()) {
      const words = currentItem.trim().split(' ');
      itemName = words.slice(0, 3).join(' ');
    }

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: quantity,
      timestamp: new Date(),
      confidence: 0.8, // Placeholder confidence score
    };

    setMenuItems(prev => [...prev, newMenuItem]);
    setCurrentItem('');
    setIsProcessing(false);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeMenuItem(id);
      return;
    }
    
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearAllItems = () => {
    Alert.alert(
      'Clear All Items',
      'Are you sure you want to clear all menu items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setMenuItems([]) },
      ]
    );
  };

  const getTotalItems = () => {
    return menuItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu Listener</Text>
          <Text style={styles.subtitle}>Speak menu items to add them to your order</Text>
        </View>

        {/* Listening Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.listenButton, isListening && styles.listeningButton]}
            onPress={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            {/* <Icon 
              name={isListening ? 'mic' : 'mic-none'} 
              size={32} 
              color={isListening ? '#fff' : '#2E7D32'} 
            /> */}
            <Text style={[styles.listenButtonText, isListening && styles.listeningButtonText]}>
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current Transcript */}
        {transcript && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Current Speech:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}

        {/* Menu Items List */}
        <View style={styles.menuItemsContainer}>
          <View style={styles.menuItemsHeader}>
            <Text style={styles.menuItemsTitle}>Menu Items ({getTotalItems()})</Text>
            {menuItems.length > 0 && (
              <TouchableOpacity onPress={clearAllItems} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              {/* <Icon name="restaurant-menu" size={48} color="#ccc" /> */}
              <Text style={styles.emptyStateText}>No menu items yet</Text>
              <Text style={styles.emptyStateSubtext}>Start listening to add items</Text>
            </View>
          ) : (
            menuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemTime}>
                    {item.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.menuItemActions}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    {/* <Icon name="remove" size={20} color="#d32f2f" /> */}
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    {/* <Icon name="add" size={20} color="#2E7D32" /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeMenuItem(item.id)}
                  >
                    {/* <Icon name="delete" size={20} color="#d32f2f" /> */}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuListeningScreen;
