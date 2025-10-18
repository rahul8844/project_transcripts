import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../constants/constants';
import VoiceTextInput from '../../components/VoiceTextInput/VoiceTextInput';
// import CateringLogo from '../../components/CateringLogo';
// import LanguageSwitcher from '../../components/LanguageSwitcher';
import {useLanguage} from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Modal, Alert} from 'react-native';
import ClientEditForm, {
  EditableClient,
} from '../../components/ClientEditForm/ClientEditForm';
import Header from '../../components/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {TabParamList} from '../../navigation/TabNavigator';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import styles from './styles';
import AddClientForm from '../../components/ClientForm';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  eventType: string;
  totalEvents: number;
  totalSpent: number;
  lastEvent: string;
  favoriteMenuItems: string[];
  isVip: boolean;
  joinDate: string;
  upcomingEvents: number;
}

const ClientsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const {t} = useLanguage();

  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<EditableClient | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const loadSavedClients = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('clients');
      const parsed: any[] = saved ? JSON.parse(saved) : [];
      const mapped: Client[] = parsed.map((c: any) => ({
        id: c.id || `${Date.now()}`,
        name: c.name || 'Unnamed',
        phone: c.phone || '',
        email: c.email || '',
        address: c.address || '',
        eventType: t('clientManagement.corporateEvents'),
        totalEvents: 0,
        totalSpent: 0,
        lastEvent: new Date().toISOString(),
        favoriteMenuItems: [],
        isVip: Boolean(c.isVip),
        joinDate: new Date().toISOString().slice(0, 10),
        upcomingEvents: 0,
      }));
      setClients(mapped);
    } catch {
      setClients([]);
    }
  }, [t]);

  const handleSavedClient = (client: Client) => {
    setShowEditModal(false);
    setClients(prev =>
      prev.map(c => (c.id === client.id ? ({...c, ...client} as any) : c)),
    );
  };

  useEffect(() => {
    loadSavedClients();
  }, [loadSavedClients]);

  useFocusEffect(
    useCallback(() => {
      loadSavedClients();
    }, [loadSavedClients]),
  );

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'vip' && client.isVip) ||
      (selectedFilter === 'regular' && !client.isVip);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const deleteClient = async (id: string) => {
    try {
      const existing = await AsyncStorage.getItem('clients');
      const list: EditableClient[] = existing ? JSON.parse(existing) : [];
      const next = list.filter(c => c.id !== id);
      await AsyncStorage.setItem('clients', JSON.stringify(next));
      setClients(prev => prev.filter(c => c.id !== id));
    } catch {}
  };

  const renderClientCard = ({item}: {item: Client}) => (
    <View style={styles.clientCard}>
      <View style={styles.clientHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.name}</Text>
          {item.isVip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>{t('common.vip')}</Text>
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row', gap: 12}}>
          <TouchableOpacity
            onPress={() => {
              setEditingClient(item as unknown as EditableClient);
              setShowEditModal(true);
            }}>
            <Text style={styles.moreButtonText}>{t('common.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(t('forms.confirm'), t('forms.deleteConfirm'), [
                {text: t('quickActions.cancel'), style: 'cancel'},
                {
                  text: t('common.delete'),
                  style: 'destructive',
                  onPress: () => deleteClient(item.id),
                },
              ])
            }>
            <Text style={[styles.moreButtonText, {color: COLORS.ERROR_RED}]}>
              {t('common.delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.clientDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📞</Text>
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        {item.email ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>✉️</Text>
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
        ) : null}
        {item.address ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍</Text>
            <Text style={styles.detailText}>{item.address}</Text>
          </View>
        ) : null}
      </View>

      {/* <View style={styles.eventTypeContainer}>
        <Text style={styles.eventTypeLabel}>{`${t('common.events')}: `}</Text>
        <Text style={styles.eventTypeText}>{formatDate(item.lastEvent)}</Text>
      </View> */}

      <View style={styles.clientActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() =>
            navigation.navigate('Events', {filterClientId: item.id} as any)
          }>
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
            {t('common.viewEvents')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterButton = (filter: string, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.selectedFilterButton,
      ]}
      onPress={() => setSelectedFilter(filter)}>
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.selectedFilterButtonText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  console.log('clients', clients);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Header
          title={t('header.cateringClientManagement')}
          subtitle={t('header.manageClients')}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <VoiceTextInput
            placeholder={t('clientManagement.searchClients')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            setPlaceHolderText={() => {}}
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {renderFilterButton('all', t('clientManagement.allClients'))}
          {renderFilterButton('vip', t('clientManagement.vipClients'))}
          {renderFilterButton('regular', t('clientManagement.regularClients'))}
        </View>
        {/* Client List */}
        <View style={styles.clientListContainer}>
          <Text style={styles.sectionTitle}>
            {filteredClients.length} {t('common.clients')} {t('common.found')}
          </Text>
          <FlatList
            data={filteredClients}
            renderItem={renderClientCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AddClientForm
              onCancel={() => setShowEditModal(false)}
              onSaved={handleSavedClient}
              client={editingClient}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ClientsScreen;
