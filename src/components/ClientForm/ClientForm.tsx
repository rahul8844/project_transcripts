import React, {useEffect, useState} from 'react';
import {View, Text, Alert, Switch} from 'react-native';
import VoiceTextInput from '../VoiceTextInput/VoiceTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import {ButtonPrimary} from '../ButtonPrimary';
import {useLanguage} from '../../contexts/LanguageContext';
import styles from './styles';

interface AddClientFormProps {
  client?: IClient;
  onSaved?: (client: IClient) => void;
  onCancel?: () => void;
  hideActions?: boolean;
  hideTitle?: boolean;
  registerExternalSave?: (fn: () => Promise<IClient | null>) => void;
}

const ClientForm: React.FC<AddClientFormProps> = ({
  onSaved,
  onCancel,
  client = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    isVip: false,
  },
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
  const [name, setName] = useState(client.name || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [email, setEmail] = useState(client.email || '');
  const [address, setAddress] = useState(client.address || '');
  const [isVip, setIsVip] = useState(Boolean(client.isVip));
  const [placeholder, setPlaceholder] = useState(initialPlaceHolder);
  const [saving, setSaving] = useState(false);

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

  const performSave = async (): Promise<IClient | null> => {
    if (!validate()) {
      return null;
    }
    setSaving(true);
    try {
      let newClient: IClient = {
        id: '',
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        isVip,
      };
      const existing = await AsyncStorage.getItem('clients');
      const clients: (IClient & {isVip?: boolean})[] = existing
        ? JSON.parse(existing)
        : [];
      if (client.id) {
        newClient.id = client.id;
        const updated = clients.map(c => {
          if (c.id === client.id) {
            return {...c, ...newClient};
          }
          return c;
        });
        await AsyncStorage.setItem('clients', JSON.stringify(updated));
      } else {
        newClient.id = `${Date.now()}`;
        const updated = [newClient, ...clients];
        await AsyncStorage.setItem('clients', JSON.stringify(updated));
      }
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
        placeholder={t('forms.nameRequiredPlaceholder')}
        value={name}
        onChangeText={setName}
        setPlaceHolderText={stringText =>
          handlePlaceHolderText(stringText, 'name')
        }
      />
      <VoiceTextInput
        placeholder={t('forms.phoneRequiredPlaceholder')}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        setPlaceHolderText={stringText =>
          handlePlaceHolderText(stringText, 'phone')
        }
      />
      <VoiceTextInput
        placeholder={t('forms.email')}
        keyboardType="email-address"
        value={email}
        onChangeText={val =>
          setEmail(val.trim().replaceAll(/\s/g, '').toLocaleLowerCase())
        }
        setPlaceHolderText={stringText =>
          handlePlaceHolderText(stringText, 'email')
        }
      />
      <VoiceTextInput
        placeholder={placeholder.address}
        value={address}
        onChangeText={setAddress}
        setPlaceHolderText={stringText =>
          handlePlaceHolderText(stringText, 'address')
        }
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
              title={t('quickActions.cancel')}
              onPress={onCancel || (() => {})}
            />
          </View>
          <View style={styles.buttonHalf}>
            <ButtonPrimary
              title={saving ? t('forms.saving') : t('forms.saveClient')}
              onPress={onSaveClient}
              disabled={saving}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ClientForm;
