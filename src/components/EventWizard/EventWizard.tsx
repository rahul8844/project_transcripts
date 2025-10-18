import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLanguage} from '../../contexts/LanguageContext';
import {ButtonPrimary} from '../ButtonPrimary';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import ClientForm from '../ClientForm';
import ContactSelector, {Contact} from '../ContactSelector';
import {useMenu} from '../../hooks/useMenu';
import EventForm from '../EventForm/EventForm';
import styles from './styles';

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


// Helper functions to convert between Contact and WizardClient formats
const wizardClientToContact = (client: WizardClient): Contact => ({
  id: client.id,
  name: client.name,
  phoneNumber: client.phone,
  email: client.email,
});

const contactToWizardClient = (contact: Contact): WizardClient => ({
  // id: contact.id,
  id: '',
  name: contact.name,
  phone: contact.phoneNumber,
  email: contact.email,
});

const EventWizard: React.FC<EventWizardProps> = ({onSaved, onCancel}) => {
  const {t} = useLanguage();
  const {Menu: MenuCategory} = useMenu();
  const [step, setStep] = useState<number>(0);
  const [clients, setClients] = useState<WizardClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<IClient | null>(null);

  // Event fields
  const [event, setEvent] = useState<IEvent>({
    eventName: '',
    date: '',
    guests: 0,
    eventAddress: '',
    eventType: '',
  });

  // Menu selection
  const [menuQuery, setMenuQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<Set<string>>(new Set());
  const externalClientSaveRef = React.useRef<
    null | (() => Promise<IClient | null>)
  >(null);

  const externalEventSaveRef = React.useRef<
    null | (() => Promise<IEvent | null>)
  >(null);

  const DEFAULT_MENU = useMemo(
    () =>
      Array.from(
        new Set(
          MenuCategory.flatMap(category =>
            category.items.map(item => item.name),
          ),
        ),
      ),
    [MenuCategory],
  );

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

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contactToWizardClient(contact));
    setSelectedClientId(contact.id);
  };

  const handleContactsLoaded = (contacts: Contact[]) => {
    // Convert device contacts to wizard clients and merge with existing clients
    const deviceClients = contacts.map(contactToWizardClient);
    const mergedClients = [
      ...clients,
      ...deviceClients.filter(
        deviceClient =>
          !clients.some(
            existingClient => existingClient.id === deviceClient.id,
          ),
      ),
    ];
    setClients(mergedClients);
  };

  const handleContactError = (error: string) => {
    console.error('Contact loading error:', error);
    // Still allow using existing clients even if device contacts fail
  };

  const validateEventStep = (eventDetails: IEvent): string | null => {
    if (!eventDetails.eventName.trim()) {
      return 'Event name is required';
    }
    if (eventDetails.guests && isNaN(Number(eventDetails.guests))) {
      return 'Guests must be a number';
    }
    return null;
  };

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      // If creating new client and not yet selected, auto-save the client
      if (externalClientSaveRef.current) {
        const saved = await externalClientSaveRef.current();
        if (saved) {
          setSelectedContact(saved);
          setSelectedClientId(saved.id);
        } else {
          return;
        }
      } else {
        Alert.alert(t('forms.validation'), t('forms.saveClientFirst'));
        return;
      }
    }
    if (step === 2) {
      if (externalEventSaveRef.current) {
        const saved = await externalEventSaveRef.current();
        const err = validateEventStep(saved as IEvent);
        if (err) {
          Alert.alert(t('forms.validation'), err);
          return;
        }
        if (saved) {
          setEvent(saved);
        } else {
          return;
        }
      } else {
        return;
      }
    }
    if (step === 3) {
      await handleSave();
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSave = async () => {
    const err = validateEventStep(event as IEvent);
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
        eventName: event.eventName.trim(),
        date: event.date?.trim() || undefined,
        guests: event.guests ? Number(event.guests) : undefined,
        menuItems: Array.from(selectedMenu),
        createdAt: new Date().toISOString(),
      };
      (newEvent as any).eventAddress = event.eventAddress?.trim() || undefined;
      (newEvent as any).eventType = event.eventType;
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
      <View style={[styles.stepBar, step >= 3 && styles.stepBarActive]} />
      <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
    </View>
  );

  const renderContacts = () => (
    <View>
      <Text style={styles.subsectionTitle}>{t('forms.searchClients')}</Text>
      <ContactSelector
        contacts={clients.map(wizardClientToContact)}
        onContactSelect={handleContactSelect}
        onContactsLoaded={handleContactsLoaded}
        onError={handleContactError}
        placeholder={t('forms.searchClients')}
        showSearchBar={true}
        maxHeight={300}
        useDeviceContacts={true}
        debugMode={true}
        style={styles.contactSelector}
      />
      {selectedContact && (
        <View style={styles.selectedClientInfo}>
          <Text style={styles.selectedClientText}>
            {t('forms.selected')}: {selectedContact.name}
          </Text>
          <Text style={styles.selectedClientPhone}>
            {selectedContact.phone}
          </Text>
        </View>
      )}
    </View>
  );

  const renderClientStep = () => (
    <View>
      <Text style={styles.sectionTitle}>{t('forms.client')}</Text>
      <ClientForm
        client={selectedContact}
        onSaved={fn => {
          externalClientSaveRef.current = fn;
        }}
        hideTitle
        hideActions
        registerExternalSave={fn => {
          externalClientSaveRef.current = fn;
        }}
      />
    </View>
  );

  const renderMenuStep = () => (
    <View>
      <Text style={styles.sectionTitle}>{t('forms.menuSelection')}</Text>
      <VoiceTextInput
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
      {step === 0 && renderContacts()}
      {step === 1 && renderClientStep()}
      {step === 2 && (
        <EventForm
          event={event}
          hideActions={true}
          onCancel={handleBack}
          onSaved={() => {}}
          registerExternalSave={fn => {
            externalEventSaveRef.current = fn;
          }}
        />
      )}
      {step === 3 && renderMenuStep()}
      <View style={styles.footer}>
        <View style={styles.footerHalf}>
          <ButtonPrimary
            title={step > 0 ? t('forms.back') : t('forms.cancel')}
            onPress={handleBack}
          />
        </View>
        <View style={styles.footerHalf}>
          <ButtonPrimary
            title={step < 3 ? t('forms.next') : t('forms.saveEvent')}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
};

export default EventWizard;
