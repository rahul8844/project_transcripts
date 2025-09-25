import React, {useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import {ButtonPrimary} from '../ButtonPrimary';

export type EditableClient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  isVip?: boolean;
};

interface ClientEditFormProps {
  client: EditableClient;
  onSaved: (client: EditableClient) => void;
  onCancel: () => void;
}

const ClientEditForm: React.FC<ClientEditFormProps> = ({
  client,
  onSaved,
  onCancel,
}) => {
  const {t} = useLanguage();
  const [name, setName] = useState(client.name || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [email, setEmail] = useState(client.email || '');
  const [address, setAddress] = useState(client.address || '');
  const [isVip, setIsVip] = useState(Boolean(client.isVip));

  const onSave = async () => {
    const updated: EditableClient = {
      ...client,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      isVip,
    };
    const existing = await AsyncStorage.getItem('clients');
    const list: EditableClient[] = existing ? JSON.parse(existing) : [];
    const next = list.map(c => (c.id === client.id ? {...c, ...updated} : c));
    await AsyncStorage.setItem('clients', JSON.stringify(next));
    onSaved(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forms.addClient')}</Text>
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.nameRequiredPlaceholder')}
        value={name}
        onChangeText={setName}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.phoneRequiredPlaceholder')}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.email')}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.address')}
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{t('forms.markVip')}</Text>
        <Switch
          value={isVip}
          onValueChange={setIsVip}
          trackColor={{true: COLORS.ACCENT_APP}}
        />
      </View>
      <View style={styles.buttons}>
        <View style={{flex: 1}}>
          <ButtonPrimary title={t('common.edit')} onPress={onSave} />
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleLabel: {color: COLORS.TEXT_PRIMARY, fontWeight: '600'},
  buttons: {flexDirection: 'row', gap: 12, marginTop: 8},
});

export default ClientEditForm;
