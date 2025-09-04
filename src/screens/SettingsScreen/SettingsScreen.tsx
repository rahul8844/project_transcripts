import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const SettingsScreen: React.FC = () => {
  const [micPermission, setMicPermission] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handlePermissionRequest = () => {
    Alert.alert(
      'Microphone Permission',
      'This app needs microphone access to listen to menu items. Please grant permission in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => {
          // In real app, use Linking API to open device settings
          Alert.alert('Settings', 'Please navigate to Settings > Privacy > Microphone and enable access for this app.');
        }},
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all captured menu items and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been cleared successfully.');
        }},
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your menu data will be exported as a text file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Export Complete', 'Data exported successfully!');
        }},
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Menu Listener',
      'Version 1.0.0\n\nA React Native app for capturing menu items using voice recognition. Perfect for restaurants, cafes, and food venues.\n\nBuilt with React Native and speech recognition technology.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Configure app preferences and permissions
          </Text>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {/* <Icon name="mic" size={24} color="#2E7D32" /> */}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Microphone Access</Text>
                <Text style={styles.settingDescription}>
                  Required for voice recognition
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.permissionButton, micPermission ? styles.grantedButton : styles.deniedButton]}
              onPress={handlePermissionRequest}
            >
              <Text style={styles.permissionButtonText}>
                {micPermission ? 'Granted' : 'Grant'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {/* <Icon name="save" size={24} color="#1976D2" /> */}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto-save</Text>
                <Text style={styles.settingDescription}>
                  Automatically save captured items
                </Text>
              </View>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#e0e0e0', true: '#2E7D32' }}
              thumbColor={autoSave ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {/* <Icon name="notifications" size={24} color="#FF9800" /> */}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive app notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#e0e0e0', true: '#2E7D32' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {/* <Icon name="dark-mode" size={24} color="#7B1FA2" /> */}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme (coming soon)
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e0e0e0', true: '#2E7D32' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              disabled={true}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            {/* <Icon name="file-download" size={20} color="#fff" /> */}
            <Text style={styles.actionButtonText}>Export All Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleClearData}>
            {/* <Icon name="delete-forever" size={20} color="#fff" /> */}
            <Text style={styles.actionButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.aboutButton} onPress={handleAbout}>
            {/* <Icon name="info" size={24} color="#666" /> */}
            <Text style={styles.aboutButtonText}>App Information</Text>
            {/* <Icon name="chevron-right" size={24} color="#ccc" /> */}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Menu Listener v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default SettingsScreen;
