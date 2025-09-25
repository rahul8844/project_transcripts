import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import {ButtonPrimary} from '../ButtonPrimary';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import DateTextInput from '../DateTextInput/DateTextInput';
import AddClientForm, {SavedClient} from '../AddClientForm';
import {useMenu} from '../../hooks/useMenu';

export type WizardEvent = {
  id: string;
  clientId: string;
  eventName: string;
  date?: string;
  guests?: number;
  menuItems: string[];
  createdAt: string;
};

export type WizardClient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

interface EventWizardProps {
  onSaved?: (event: WizardEvent) => void;
  onCancel?: () => void;
}

type ClientMode = 'new' | 'existing';

const EventWizard: React.FC<EventWizardProps> = ({onSaved, onCancel}) => {
  const {t} = useLanguage();
  const {Menu: MenuCategory} = useMenu();
  const [step, setStep] = useState<number>(0);
  const [clientMode, setClientMode] = useState<ClientMode>('new');
  const [clients, setClients] = useState<WizardClient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  // Event fields
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventType, setEventType] = useState<string>('other');
  // Menu selection
  const [menuQuery, setMenuQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<Set<string>>(new Set());
  const externalClientSaveRef = React.useRef<
    null | (() => Promise<SavedClient | null>)
  >(null);

  const DEFAULT_MENU = useMemo(() => Array.from(new Set(MenuCategory.flatMap(category =>
      category.items.map(item => item.name),
    ))),
    [MenuCategory],
  );
  useEffect(() => {
    const loadClients = async () => {
      try {
        const existing = await AsyncStorage.getItem('clients');
        setClients(existing ? JSON.parse(existing) : []);
      } catch (e) {
        // ignore
      }
    };
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return clients;
    }
    return clients.filter(
      c =>
        c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
    );
  }, [clients, search]);

  const filteredMenu = useMemo(() => {
    const q = menuQuery.trim().toLowerCase();
    if (!q) {
      return DEFAULT_MENU;
    }
    return DEFAULT_MENU.filter(m => m.toLowerCase().includes(q));
  }, [DEFAULT_MENU, menuQuery]);

  const toggleMenu = useCallback((item: string) => {
    setSelectedMenu(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const validateClientStep = async (): Promise<string | null> => {
    if (!selectedClientId) {
      return clientMode === 'new'
        ? t('forms.saveClientFirst')
        : t('forms.selectExistingClient');
    }
    return null;
  };

  const validateEventStep = (): string | null => {
    if (!eventName.trim()) {
      return 'Event name is required';
    }
    if (guests && isNaN(Number(guests))) {
      return 'Guests must be a number';
    }
    return null;
  };

  const handleNext = async () => {
    if (step === 0) {
      // If creating new client and not yet selected, auto-save the client
      if (
        clientMode === 'new' &&
        !selectedClientId &&
        externalClientSaveRef.current
      ) {
        const saved = await externalClientSaveRef.current();
        if (saved) {
          setSelectedClientId(saved.id);
          await reloadClients();
          setClientMode('existing');
          setSearch(saved.name);
        } else {
          return;
        }
      }
      const err = await validateClientStep();
      if (err) {
        Alert.alert(t('forms.validation'), err);
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      const err = validateEventStep();
      if (err) {
        Alert.alert(t('forms.validation'), err);
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      await handleSave();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSave = async () => {
    const err = validateEventStep();
    if (err) {
      Alert.alert(t('forms.validation'), err);
      return;
    }
    try {
      const existingEventsString = await AsyncStorage.getItem('events');
      const existingEvents: WizardEvent[] = existingEventsString
        ? JSON.parse(existingEventsString)
        : [];
      const newEvent: WizardEvent = {
        id: `${Date.now()}`,
        clientId: selectedClientId,
        eventName: eventName.trim(),
        date: date.trim() || undefined,
        guests: guests ? Number(guests) : undefined,
        menuItems: Array.from(selectedMenu),
        createdAt: new Date().toISOString(),
      };
      (newEvent as any).address = eventAddress.trim() || undefined;
      (newEvent as any).eventType = eventType;
      await AsyncStorage.setItem(
        'events',
        JSON.stringify([newEvent, ...existingEvents]),
      );
      Alert.alert(t('forms.success'), t('forms.eventSaved'));
      if (onSaved) {
        onSaved(newEvent);
      }
    } catch (e) {
      Alert.alert(t('forms.error'), t('forms.eventSaveFailed'));
    }
  };

  const renderStepHeader = () => (
    <View style={styles.stepHeader}>
      <View style={[styles.stepDot, step >= 0 && styles.stepDotActive]} />
      <View style={[styles.stepBar, step >= 1 && styles.stepBarActive]} />
      <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
      <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
      <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
    </View>
  );

  const reloadClients = async () => {
    try {
      const existing = await AsyncStorage.getItem('clients');
      setClients(existing ? JSON.parse(existing) : []);
    } catch {}
  };

  const renderClientStep = () => (
    <View>
      <Text style={styles.sectionTitle}>{t('forms.client')}</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={[
            styles.radioOption,
            clientMode === 'new' && styles.radioSelected,
          ]}
          onPress={() => setClientMode('new')}>
          <Text style={styles.radioText}>{t('forms.newClient')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radioOption,
            clientMode === 'existing' && styles.radioSelected,
          ]}
          onPress={() => setClientMode('existing')}>
          <Text style={styles.radioText}>{t('forms.existingClient')}</Text>
        </TouchableOpacity>
      </View>

      {clientMode === 'new' ? (
        <AddClientForm
          hideActions
          hideTitle
          registerExternalSave={fn => {
            externalClientSaveRef.current = fn;
          }}
          onSaved={client => {
            setSelectedClientId(client.id);
            reloadClients();
            setClientMode('existing');
            setSearch(client.name);
          }}
          onCancel={() => setClientMode('existing')}
        />
      ) : (
        <View>
          <VoiceTextInput
            style={styles.input}
            placeholder={t('forms.searchClients')}
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredClients}
            keyExtractor={item => item.id}
            style={styles.list}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  selectedClientId === item.id && styles.listItemSelected,
                ]}
                onPress={() => setSelectedClientId(item.id)}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.clientPhone}>{item.phone}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('forms.noItems')}</Text>
            }
          />
        </View>
      )}
    </View>
  );

  const renderEventStep = () => (
    <View>
      <Text style={styles.sectionTitle}>{t('forms.eventDetails')}</Text>
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.eventNameReq')}
        value={eventName}
        onChangeText={setEventName}
        setPlaceHolderText={() => {}}
      />
      <DateTextInput
        style={styles.input}
        placeholder={t('forms.datePlaceholder')}
        value={date}
        onChangeText={setDate}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.guestsPlaceholder')}
        keyboardType="numeric"
        value={guests}
        onChangeText={setGuests}
        setPlaceHolderText={() => {}}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.eventAddress')}
        value={eventAddress}
        onChangeText={setEventAddress}
        setPlaceHolderText={() => {}}
        multiline
      />
      <Text style={styles.sectionTitle}>{t('forms.eventType')}</Text>
      <View style={styles.typeRow}>
        {[
          {key: 'wedding'},
          {key: 'engagement'},
          {key: 'birthday'},
          {key: 'corporate'},
          {key: 'grievance'},
          {key: 'other'},
        ].map(ti => (
          <TouchableOpacity
            key={ti.key}
            style={[
              styles.typePill,
              eventType === ti.key && styles.typePillSelected,
            ]}
            onPress={() => setEventType(ti.key)}>
            <Text
              style={[
                styles.typePillText,
                eventType === ti.key && styles.typePillTextSelected,
              ]}>
              {t(`forms.eventTypes.${ti.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMenuStep = () => (
    <View>
      <Text style={styles.sectionTitle}>{t('forms.menuSelection')}</Text>
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.searchMenu')}
        value={menuQuery}
        onChangeText={setMenuQuery}
      />
      <FlatList
        data={filteredMenu}
        keyExtractor={item => item}
        style={styles.list}
        renderItem={({item}) => {
          const isSelected = selectedMenu.has(item);
          return (
            <TouchableOpacity
              style={[styles.listItem, isSelected && styles.listItemSelected]}
              onPress={() => toggleMenu(item)}>
              <Text style={styles.clientName}>{item}</Text>
              <Text style={styles.clientPhone}>
                {isSelected ? t('forms.selected') : t('forms.tapToSelect')}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('forms.noItems')}</Text>
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStepHeader()}
      {step === 0 && renderClientStep()}
      {step === 1 && renderEventStep()}
      {step === 2 && renderMenuStep()}

      <View style={styles.footer}>
        <View style={styles.footerHalf}>
          <ButtonPrimary
            title={step === 0 ? t('quickActions.cancel') : t('forms.back')}
            onPress={handleBack}
          />
        </View>
        <View style={styles.footerHalf}>
          {step < 2 ? (
            <ButtonPrimary title={t('forms.next')} onPress={handleNext} />
          ) : (
            <ButtonPrimary title={t('forms.saveEvent')} onPress={handleSave} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.CARD_BORDER,
  },
  stepDotActive: {
    backgroundColor: COLORS.ACCENT_APP,
  },
  stepBar: {
    height: 2,
    flex: 1,
    backgroundColor: COLORS.CARD_BORDER,
    marginHorizontal: 6,
  },
  stepBarActive: {
    backgroundColor: COLORS.ACCENT_APP,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  radioOption: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.ACCENT_APP,
  },
  radioText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  list: {
    maxHeight: 240,
  },
  listItem: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemSelected: {
    borderColor: COLORS.ACCENT_APP,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  clientPhone: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyText: {
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerHalf: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
  },
  typePillSelected: {
    borderColor: COLORS.ACCENT_APP,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
  },
  typePillText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
  typePillTextSelected: {
    color: COLORS.ACCENT_APP,
  },
});

export default EventWizard;
