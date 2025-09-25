import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Switch} from 'react-native';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import {ButtonPrimary} from '../ButtonPrimary';
import {useLanguage} from '../../contexts/LanguageContext';
import styles from './styles';

export type SavedClient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

interface AddClientFormProps {
  onSaved?: (client: SavedClient) => void;
  onCancel?: () => void;
  hideActions?: boolean;
  hideTitle?: boolean;
  registerExternalSave?: (fn: () => Promise<SavedClient | null>) => void;
}


const AddClientForm: React.FC<AddClientFormProps> = ({
  onSaved,
  onCancel,
  hideActions = false,
  hideTitle = false,
  registerExternalSave,
}) => {
  const {t} = useLanguage();
  const initialPlaceHolder = {
    name: t('forms.nameRequiredPlaceholder'),
    phone: t('forms.phoneRequiredPlaceholder'),
    email: t('forms.email'),
    address: t('forms.address'),
  };
  const [placeholder, setPlaceholder] = useState(initialPlaceHolder);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [isVip, setIsVip] = useState(false);

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) {
      Alert.alert(t('forms.validation'), t('forms.nameRequired'));
      return false;
    }
    if (!trimmedPhone) {
      Alert.alert(t('forms.validation'), t('forms.phoneRequired'));
      return false;
    }
    const phoneRegex = /^[+\-()\s\d]{7,15}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert(t('forms.validation'), t('forms.validPhone'));
      return false;
    }
    return true;
  };

  const performSave = async (): Promise<SavedClient | null> => {
    if (!validate()) {
      return null;
    }
    setSaving(true);
    try {
      const existing = await AsyncStorage.getItem('clients');
      const clients: (SavedClient & {isVip?: boolean})[] = existing
        ? JSON.parse(existing)
        : [];
      const newClient: SavedClient = {
        id: `${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      };
      const withVip = {...newClient, isVip};
      const updated = [withVip, ...clients];
      await AsyncStorage.setItem('clients', JSON.stringify(updated));
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setIsVip(false);
      Alert.alert(t('forms.success'), t('forms.clientSaved'));
      if (onSaved) {
        onSaved(newClient);
      }
      return newClient;
    } catch (e) {
      Alert.alert(t('forms.error'), t('forms.clientSaveFailed'));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const onSaveClient = async () => {
    await performSave();
  };

  const handlePlaceHolderText = (stringText: string, key: string) => {
    setPlaceholder({...initialPlaceHolder, [key]: stringText});
  };

  useEffect(() => {
    if (registerExternalSave) {
      registerExternalSave(performSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerExternalSave, name, phone, email, address, isVip]);



  return (
    <View>
      {!hideTitle && (
        <Text style={styles.formTitle}>{t('forms.addClient')}</Text>
      )}
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.nameRequiredPlaceholder')}
        value={name}
        onChangeText={setName}
        setPlaceHolderText={(stringText)=>handlePlaceHolderText(stringText, 'name')}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={t('forms.phoneRequiredPlaceholder')}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        setPlaceHolderText={(stringText)=>handlePlaceHolderText(stringText, 'phone')}
      />
      <VoiceTextInput
        placeholder={t('forms.email')}
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={(val)=> setEmail(val.trim().replaceAll(/\s/g, '').toLocaleLowerCase())}
        setPlaceHolderText={(stringText)=>handlePlaceHolderText(stringText, 'email')}
      />
      <VoiceTextInput
        style={styles.input}
        placeholder={placeholder.address}
        value={address}
        onChangeText={setAddress}
        setPlaceHolderText={(stringText)=>handlePlaceHolderText(stringText, 'address')}
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
      {!hideActions && (
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <ButtonPrimary
              title={saving ? t('forms.saving') : t('forms.saveClient')}
              onPress={onSaveClient}
              disabled={saving}
            />
          </View>
          <View style={styles.buttonHalf}>
            <ButtonPrimary
              title={t('quickActions.cancel')}
              onPress={onCancel || (() => {})}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default AddClientForm;
