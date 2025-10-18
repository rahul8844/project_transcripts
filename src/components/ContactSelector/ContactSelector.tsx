import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Contact, ContactSelectorProps} from '../../types/Contact';
import {useLanguage} from '../../contexts/LanguageContext';
import ContactService from '../../services/ContactService';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import styles from './styles';
import {ButtonPrimary} from '../ButtonPrimary';

const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  onContactSelect,
  onSearchChange,
  placeholder,
  showSearchBar = true,
  showNewClientButton = false,
  maxHeight = 400,
  style,
  onContactsLoaded,
  onError,
  onNewClient,
}) => {
  const {t} = useLanguage();
  const [searchText, setSearchText] = useState('');
  const [allContacts, setAllContacts] = useState<Contact[]>(contacts || []);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(
    contacts || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contactService = ContactService.getInstance();

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  const handleContactPress = (contact: Contact) => {
    onContactSelect(contact);
  };

  const handleNewClient = () => {
    onNewClient?.();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const deviceContacts = await contactService.refreshContacts();
      setAllContacts(deviceContacts);
      setFilteredContacts(deviceContacts);
      onContactsLoaded?.(deviceContacts);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh contacts';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContactItem = ({item}: {item: Contact}) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}>
      <View style={styles.contactAvatar}>
        {item.avatar ? (
          <Image source={{uri: item.avatar}} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        {item.email && <Text style={styles.contactEmail}>{item.email}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <VoiceTextInput
        placeholder={placeholder || t('contactSelector.searchPlaceholder')}
        value={searchText}
        onChangeText={handleSearchChange}
        setPlaceHolderText={() => {}}
      />
      {showNewClientButton ? (
        <ButtonPrimary
          title="+"
          onPress={handleNewClient}
          style={styles.newClientButton}
          size="small"
        />
      ) : null}
    </View>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#D2691E" />
          <Text style={styles.emptyStateText}>
            {t('contactSelector.loadingContacts')}
          </Text>
          <Text style={styles.loadingSubtext}>
            This may take a few seconds...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>
              {t('contactSelector.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {searchText.trim() === ''
            ? t('contactSelector.noContacts')
            : t('contactSelector.noResults')}
        </Text>
        {allContacts.length === 0 && (
          <Text style={styles.fallbackText}>
            No device contacts found. Check permissions or try refreshing.
          </Text>
        )}
      </View>
    );
  };

  // Load contacts from device or use provided contacts
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const deviceContacts = await contactService.fetchContacts();
        setAllContacts(deviceContacts);
        setFilteredContacts(deviceContacts);
        onContactsLoaded?.(deviceContacts);
      } catch (err) {
        console.error('ContactSelector: Error loading contacts:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load contacts';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  useEffect(() => {
    // Filter contacts based on search text
    if (searchText.trim() === '') {
      setFilteredContacts(allContacts);
    } else {
      const filtered = allContacts.filter(
        contact =>
          contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
          contact.phoneNumber.includes(searchText) ||
          (contact.email &&
            contact.email.toLowerCase().includes(searchText.toLowerCase())),
      );
      setFilteredContacts(filtered);
    }
  }, [searchText, allContacts]);

  return (
    <View style={[styles.container, style]}>
      {showSearchBar && renderSearchBar()}
      <View style={[styles.contactsList, {maxHeight}]}>
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#D2691E']}
              tintColor="#D2691E"
            />
          }
        />
      </View>
    </View>
  );
};

export default ContactSelector;
