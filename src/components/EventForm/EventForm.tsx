import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import DateTextInput from '../DateTextInput/DateTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLanguage} from '../../contexts/LanguageContext';
import {ButtonPrimary} from '../ButtonPrimary';
import styles from './styles';

interface EventFormProps {
  hideActions?: boolean;
  event: IEvent;
  onSaved: (ev: IEvent) => void;
  onCancel: () => void;
  registerExternalSave?: (fn: () => Promise<IEvent | null>) => void;
}

const EventForm: React.FC<EventFormProps> = props => {
  const {t} = useLanguage();
  const {
    hideActions = false,
    event,
    onSaved,
    onCancel,
    registerExternalSave,
  } = props;
  const [eventName, setEventName] = useState(event.eventName || '');
  const [date, setDate] = useState(event.date || '');
  const [guests, setGuests] = useState(
    event.guests ? String(event.guests) : '',
  );
  const [eventAddress, setEventAddress] = useState(event.eventAddress || '');
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
    const updated: IEvent = {
      ...event,
      eventName: eventName.trim(),
      date: date.trim() || undefined,
      guests: guests ? Number(guests) : undefined,
      eventAddress: eventAddress.trim() || undefined,
      eventType,
    };
    const existing = await AsyncStorage.getItem('events');
    const list: IEvent[] = existing ? JSON.parse(existing) : [];
    const next = list.map(ev =>
      ev.id === event.id ? {...ev, ...updated} : ev,
    );
    await AsyncStorage.setItem('events', JSON.stringify(next));
    onSaved(updated);
    return updated;
  };

  useEffect(() => {
    if (registerExternalSave) {
      registerExternalSave(onSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerExternalSave, eventName, eventAddress, guests, eventType, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forms.eventDetails')}</Text>
      <VoiceTextInput
        placeholder={t('forms.eventNameReq')}
        value={eventName}
        onChangeText={setEventName}
      />
      <DateTextInput
        placeholder={t('forms.datePlaceholder')}
        value={date}
        onChangeText={setDate}
      />
      <VoiceTextInput
        placeholder={t('forms.guestsPlaceholder')}
        keyboardType="numeric"
        inputMode="numeric"
        value={guests}
        onChangeText={setGuests}
      />
      <VoiceTextInput
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

      {!hideActions ? (
        <View style={styles.buttons}>
          <View style={{flex: 1}}>
            <ButtonPrimary title={t('forms.cancel')} onPress={onCancel} />
          </View>
          <View style={{flex: 1}}>
            <ButtonPrimary title={t('forms.saveEvent')} onPress={onSave} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default EventForm;
