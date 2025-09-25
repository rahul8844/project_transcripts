import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import DateTextInput from '../DateTextInput/DateTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import {ButtonPrimary} from '../ButtonPrimary';

export type EditableEvent = {
  id: string;
  clientId: string;
  eventName: string;
  date?: string;
  guests?: number;
  createdAt: string;
  menuItems?: string[];
  address?: string;
  eventType?: string;
};

interface EventEditFormProps {
  event: EditableEvent;
  onSaved: (ev: EditableEvent) => void;
  onCancel: () => void;
}

const EventEditForm: React.FC<EventEditFormProps> = ({
  event,
  onSaved,
  onCancel,
}) => {
  const {t} = useLanguage();
  const [eventName, setEventName] = useState(event.eventName || '');
  const [date, setDate] = useState(event.date || '');
  const [guests, setGuests] = useState(
    event.guests ? String(event.guests) : '',
  );
  const [eventAddress, setEventAddress] = useState(event.address || '');
  const [eventType, setEventType] = useState(event.eventType || 'other');

  const EVENT_TYPES = [
    {key: 'wedding'},
    {key: 'engagement'},
    {key: 'birthday'},
    {key: 'corporate'},
    {key: 'grievance'},
    {key: 'other'},
  ];

  const onSave = async () => {
    const updated: EditableEvent = {
      ...event,
      eventName: eventName.trim(),
      date: date.trim() || undefined,
      guests: guests ? Number(guests) : undefined,
      address: eventAddress.trim() || undefined,
      eventType,
    };
    const existing = await AsyncStorage.getItem('events');
    const list: EditableEvent[] = existing ? JSON.parse(existing) : [];
    const next = list.map(ev =>
      ev.id === event.id ? {...ev, ...updated} : ev,
    );
    await AsyncStorage.setItem('events', JSON.stringify(next));
    onSaved(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forms.eventDetails')}</Text>
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.eventNameReq')}
        value={eventName}
        onChangeText={setEventName}
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
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.eventAddress')}
        value={eventAddress}
        onChangeText={setEventAddress}
        multiline
      />

      <Text style={styles.title}>{t('forms.eventType')}</Text>
      <View style={styles.typeRow}>
        {EVENT_TYPES.map(ti => (
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

      <View style={styles.buttons}>
        <View style={{flex: 1}}>
          <ButtonPrimary title={t('forms.saveEvent')} onPress={onSave} />
        </View>
        <View style={{flex: 1}}>
          <ButtonPrimary title={t('quickActions.cancel')} onPress={onCancel} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
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
  typeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8},
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
  typePillText: {color: COLORS.TEXT_PRIMARY, fontSize: 12, fontWeight: '600'},
  typePillTextSelected: {color: COLORS.ACCENT_APP},
  buttons: {flexDirection: 'row', gap: 12, marginTop: 8},
});

export default EventEditForm;
