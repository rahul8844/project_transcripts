import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import VoiceTextInput from '../../components/VoiceTextInput/VoiceTextInput';
import {SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  timestamp: Date;
  confidence: number;
}

const NotesScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  // Mock data for demonstration - in real app this would come from storage/context
  useEffect(() => {
    const mockItems: MenuItem[] = [
      {
        id: '1',
        name: 'Margherita Pizza',
        quantity: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        confidence: 0.9,
      },
      {
        id: '2',
        name: 'Chicken Burger',
        quantity: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        confidence: 0.8,
      },
      {
        id: '3',
        name: 'Caesar Salad',
        quantity: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        confidence: 0.7,
      },
    ];
    setMenuItems(mockItems);
  }, []);

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQuantity(item.quantity.toString());
    setIsEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!editingItem || !editName.trim() || !editQuantity.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const quantity = parseInt(editQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Error', 'Quantity must be a positive number');
      return;
    }

    setMenuItems(prev =>
      prev.map(item =>
        item.id === editingItem.id
          ? {...item, name: editName.trim(), quantity}
          : item,
      ),
    );

    setIsEditModalVisible(false);
    setEditingItem(null);
    setEditName('');
    setEditQuantity('');
  };

  const cancelEdit = () => {
    setIsEditModalVisible(false);
    setEditingItem(null);
    setEditName('');
    setEditQuantity('');
  };

  const removeItem = (id: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setMenuItems(prev => prev.filter(item => item.id !== id)),
      },
    ]);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, quantity: newQuantity} : item,
      ),
    );
  };

  const getTotalItems = () => {
    return menuItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalValue = () => {
    // Mock pricing - in real app this would come from a menu database
    const mockPrices: {[key: string]: number} = {
      pizza: 15,
      burger: 12,
      salad: 8,
      pasta: 14,
      steak: 25,
      chicken: 18,
    };

    return menuItems.reduce((total, item) => {
      const basePrice =
        Object.entries(mockPrices).find(([key]) =>
          item.name.toLowerCase().includes(key),
        )?.[1] || 10; // Default price $10
      return total + basePrice * item.quantity;
    }, 0);
  };

  const exportNotes = () => {
    const notesText = menuItems
      .map(item => `${item.name} x${item.quantity}`)
      .join('\n');

    const summary = `\n\nTotal Items: ${getTotalItems()}\nEstimated Total: $${getTotalValue()}`;

    Alert.alert('Notes Summary', notesText + summary, [
      {
        text: 'Copy to Clipboard',
        onPress: () => {
          // In real app, use Clipboard API
          Alert.alert('Copied!', 'Notes copied to clipboard');
        },
      },
      {text: 'OK'},
    ]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Menu Notes</Text>
          <Text style={styles.subtitle}>
            Review and manage your captured menu items
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{menuItems.length}</Text>
            <Text style={styles.summaryLabel}>Items</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{getTotalItems()}</Text>
            <Text style={styles.summaryLabel}>Total Qty</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>${getTotalValue()}</Text>
            <Text style={styles.summaryLabel}>Est. Total</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={exportNotes}
            disabled={menuItems.length === 0}>
            <Text style={styles.actionButtonText}>Export Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuItemsContainer}>
          <Text style={styles.sectionTitle}>Captured Items</Text>

          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              {/* <Icon name="note" size={48} color="#ccc" /> */}
              <Text style={styles.emptyStateText}>
                No menu items captured yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Use the Listen to Menu feature to start capturing items
              </Text>
            </View>
          ) : (
            menuItems.map(item => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemTime}>
                    {formatTime(item.timestamp)}
                  </Text>
                  <Text style={styles.menuItemConfidence}>
                    Confidence: {Math.round(item.confidence * 100)}%
                  </Text>
                </View>
                <View style={styles.menuItemActions}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  />
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditItem(item)}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Menu Item</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Item Name:</Text>
              <VoiceTextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter item name"
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Quantity:</Text>
              <VoiceTextInput
                style={styles.textInput}
                value={editQuantity}
                onChangeText={setEditQuantity}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotesScreen;
