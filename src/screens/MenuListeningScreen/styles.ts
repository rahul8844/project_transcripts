
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
    controlsContainer: {
      padding: 20,
      alignItems: 'center',
    },
    listenButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: '#2E7D32',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    listeningButton: {
      backgroundColor: '#d32f2f',
      borderColor: '#d32f2f',
    },
    listenButtonText: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: '600',
      color: '#2E7D32',
    },
    listeningButtonText: {
      color: '#fff',
    },
    transcriptContainer: {
      margin: 20,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderLeftWidth: 4,
      borderLeftColor: '#2196F3',
    },
    transcriptLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginBottom: 5,
    },
    transcriptText: {
      fontSize: 16,
      color: '#333',
      fontStyle: 'italic',
    },
    menuItemsContainer: {
      margin: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
    },
    menuItemsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    menuItemsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    clearButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor: '#d32f2f',
      borderRadius: 20,
    },
    clearButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 18,
      color: '#666',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: '#999',
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    menuItemInfo: {
      flex: 1,
    },
    menuItemName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 4,
    },
    menuItemTime: {
      fontSize: 12,
      color: '#999',
    },
    menuItemActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      marginHorizontal: 4,
    },
    quantityText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginHorizontal: 12,
      minWidth: 30,
      textAlign: 'center',
    },
    deleteButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#ffebee',
      marginLeft: 8,
    },
  });

  export default styles;