import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2E7D32',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    section: {
      margin: 20,
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      padding: 16,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      marginLeft: 16,
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: '#666',
    },
    permissionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 80,
      alignItems: 'center',
    },
    grantedButton: {
      backgroundColor: '#4CAF50',
    },
    deniedButton: {
      backgroundColor: '#f44336',
    },
    permissionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2E7D32',
      paddingVertical: 12,
      paddingHorizontal: 24,
      margin: 16,
      borderRadius: 8,
    },
    dangerButton: {
      backgroundColor: '#d32f2f',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    aboutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    aboutButtonText: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      marginLeft: 16,
    },
    footer: {
      padding: 20,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: '#999',
    },
  });

  export default styles;