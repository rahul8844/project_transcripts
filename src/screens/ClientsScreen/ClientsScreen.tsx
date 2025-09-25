import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
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
  const {t, isRTL} = useLanguage();

  // Sample catering client data (fallback/demo)
  // const sampleClients: Client[] = [
  //   {
  //     id: '1',
  //     name: 'Rajesh Kumar',
  //     phone: '+91 98765 43210',
  //     email: 'rajesh.kumar@email.com',
  //     address: '123 MG Road, Bangalore',
  //     eventType: t('clientManagement.corporateEvents'),
  //     totalEvents: 12,
  //     totalSpent: 125000,
  //     lastEvent: '2024-01-15',
  //     favoriteMenuItems: [
  //       t('menuItemNames.butterChicken'),
  //       t('menuItemNames.garlicNaan'),
  //       t('menuItemNames.gulabJamun'),
  //     ],
  //     isVip: true,
  //     joinDate: '2023-06-15',
  //     upcomingEvents: 2,
  //   },
  // ];

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
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>✉️</Text>
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍</Text>
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
      </View>

      <View style={styles.eventTypeContainer}>
        <Text style={styles.eventTypeLabel}>{`${t('common.events')}: `}</Text>
        <Text style={styles.eventTypeText}>{formatDate(item.lastEvent)}</Text>
      </View>

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
            style={[styles.searchInput, isRTL && styles.rtlInput]}
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
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.CARD_BORDER,
            }}>
            {editingClient && (
              <ClientEditForm
                client={editingClient}
                onSaved={updated => {
                  setShowEditModal(false);
                  setClients(prev =>
                    prev.map(c =>
                      c.id === updated.id ? ({...c, ...updated} as any) : c,
                    ),
                  );
                }}
                onCancel={() => setShowEditModal(false)}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_APP,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'relative',
    padding: 30,
    backgroundColor: COLORS.HEADER_BG,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_APP,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    marginTop: 16,
    marginBottom: 8,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.VERY_LIGHT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  filterButton: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedFilterButton: {
    backgroundColor: COLORS.ACCENT_APP,
    borderColor: COLORS.ACCENT_APP,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  selectedFilterButtonText: {
    color: COLORS.WHITE,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statCardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.ACCENT_APP,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  clientListContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  clientCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 3,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: COLORS.ACCENT_APP,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
  },
  clientDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    borderRadius: 8,
  },
  eventTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginRight: 8,
  },
  eventTypeText: {
    fontSize: 14,
    color: COLORS.ACCENT_APP,
    fontWeight: 'bold',
  },
  clientStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  favoriteItems: {
    marginBottom: 12,
  },
  favoriteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  favoriteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  favoriteTag: {
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteTagText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  clientActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.ACCENT_APP,
    borderColor: COLORS.ACCENT_APP,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  primaryButtonText: {
    color: COLORS.WHITE,
  },
  rtlInput: {
    textAlign: 'right',
  },
});

export default ClientsScreen;
