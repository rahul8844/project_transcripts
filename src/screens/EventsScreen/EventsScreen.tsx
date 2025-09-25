import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/constants';
import EventEditForm, {
  EditableEvent,
} from '../../components/EventEditForm/EventEditForm';
import {useLanguage} from '../../contexts/LanguageContext';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Images from '../../assets';

type StoredEvent = {
  id: string;
  clientId: string;
  eventName: string;
  date?: string;
  guests?: number;
  menuItems: string[];
  createdAt: string;
};

type StoredClient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

const EventsScreen: React.FC = () => {
  const {t} = useLanguage();
  const route = useRoute<any>();
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [clientsById, setClientsById] = useState<Record<string, StoredClient>>(
    {},
  );
  const [editingEvent, setEditingEvent] = useState<EditableEvent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const e = await AsyncStorage.getItem('events');
      setEvents(e ? JSON.parse(e) : []);
    } catch {}
    try {
      const c = await AsyncStorage.getItem('clients');
      const parsed: StoredClient[] = c ? JSON.parse(c) : [];
      const map: Record<string, StoredClient> = {};
      parsed.forEach(cl => {
        map[cl.id] = cl;
      });
      setClientsById(map);
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const deleteEvent = async (id: string) => {
    try {
      const existing = await AsyncStorage.getItem('events');
      const list: StoredEvent[] = existing ? JSON.parse(existing) : [];
      const next = list.filter(ev => ev.id !== id);
      await AsyncStorage.setItem('events', JSON.stringify(next));
      setEvents(next);
    } catch {}
  };

  // Best-effort localization for stored menu item strings
  const localizeMenuItem = (name: string): string => {
    // Try exact key
    const direct = t(`menuItemNames.${name}`);
    if (direct !== `menuItemNames.${name}`) {
      return direct;
    }
    // Try slugified camelCase key
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join('');
    const viaSlug = t(`menuItemNames.${slug}`);
    if (viaSlug !== `menuItemNames.${slug}`) {
      return viaSlug;
    }
    return name;
  };

  const createEventPdf = async (
    event: StoredEvent,
    client: StoredClient | undefined,
  ): Promise<string | null> => {
    try {
      const logoUri = Image.resolveAssetSource(Images.logo)?.uri || '';
      const eventTypeKey = (event as any).eventType as string | undefined;
      const eventTypeLabel = eventTypeKey
        ? t(`forms.eventTypes.${eventTypeKey}`)
        : '';

      const labels = {
        summaryTitle: t('eventManagement.title'),
        clientInfo: t('forms.client'),
        name: t('forms.nameRequiredPlaceholder'),
        phone: t('forms.phoneRequiredPlaceholder'),
        email: t('forms.email'),
        address: t('forms.eventAddress'),
        eventInfo: t('forms.eventDetails'),
        eventName: t('eventManagement.eventName'),
        date: t('eventManagement.eventDate'),
        type: t('forms.eventType'),
        guests: t('common.guests'),
        menuItems: t('forms.menuSelection'),
        noItems: t('forms.noItems'),
      };
      const formatDate = (explicit?: string, created?: string) => {
        const fmt: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        };
        if (explicit) {
          const d = new Date(explicit);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-IN', fmt);
          }
          return explicit;
        }
        if (created) {
          return new Date(created).toLocaleDateString('en-IN', fmt);
        }
        return '';
      };

      const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 16px; }
            h1 { font-size: 20px; margin: 0 0 12px; }
            h2 { font-size: 16px; margin: 16px 0 8px; }
            .row { margin: 4px 0; }
            .label { color: #666; display: inline-block; width: 90px; }
            .value { color: #222; }
            ul { padding-left: 18px; }
            .logo { display: block; margin: 0 auto 12px; width: 100px; height: 100px; object-fit: contain; }
          </style>
        </head>
        <body>
          <img class="logo" src="${logoUri}" alt="Logo" />
          <h1>${labels.summaryTitle}</h1>
          <h2>${labels.clientInfo}</h2>
          <div class="row"><span class="label">${
            labels.name
          }:</span><span class="value">${client?.name || 'Unknown'}</span></div>
          ${
            client?.phone
              ? `<div class="row"><span class="label">${labels.phone}:</span><span class="value">${client.phone}</span></div>`
              : ''
          }
          ${
            client?.email
              ? `<div class="row"><span class="label">${labels.email}:</span><span class="value">${client.email}</span></div>`
              : ''
          }
          ${
            client?.address
              ? `<div class="row"><span class="label">${labels.address}:</span><span class="value">${client.address}</span></div>`
              : ''
          }

          <h2>${labels.eventInfo}</h2>
          <div class="row"><span class="label">${
            labels.eventName
          }:</span><span class="value">${event.eventName}</span></div>
          <div class="row"><span class="label">${
            labels.date
          }:</span><span class="value">${formatDate(
        event.date,
        event.createdAt,
      )}</span></div>
          ${
            eventTypeLabel
              ? `<div class="row"><span class="label">${labels.type}:</span><span class="value">${eventTypeLabel}</span></div>`
              : ''
          }
          ${
            event.guests
              ? `<div class="row"><span class="label">${labels.guests}:</span><span class="value">${event.guests}</span></div>`
              : ''
          }
          ${
            (event as any).address
              ? `<div class="row"><span class="label">${
                  labels.address
                }:</span><span class="value">${
                  (event as any).address
                }</span></div>`
              : ''
          }

          <h2>${labels.menuItems}</h2>
          ${
            event.menuItems && event.menuItems.length
              ? `<ul>${event.menuItems
                  .map(mi => `<li>${localizeMenuItem(mi)}</li>`)
                  .join('')}</ul>`
              : `<div class="row">${labels.noItems}</div>`
          }
        </body>
      </html>`;

      const fileName = `${client?.name}_${event.eventName.replace(/\s+/g, '_')}_${event.id}`;
      const {filePath} = await RNHTMLtoPDF.convert({
        html,
        fileName,
        base64: false,
        directory: Platform.OS === 'android' ? 'Download' : 'Documents',
      });

      // Ensure file exists and return path
      if (filePath && (await RNFS.exists(filePath))) {
        if (Platform.OS === 'android') {
          try {
            // Try to place into public ~/Download
            // Request legacy permission where applicable (SDK <= 28)
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
          } catch {}
          const downloadsRoot =
            // Prefer RNFS provided path, fallback to common external path
            (RNFS as any).DownloadDirectoryPath ||
            `${(RNFS as any).ExternalStorageDirectoryPath}/Download`;
          const publicDest = `${downloadsRoot}/${fileName}.pdf`;
          try {
            await RNFS.copyFile(filePath, publicDest);
            return publicDest;
          } catch (copyErr) {
            // Fall back to app-specific path
            return filePath;
          }
        }
        return filePath;
      }
      return filePath || null;
    } catch (e) {
      Alert.alert('Error', 'Failed to create PDF.');
      console.log(e);
      return null;
    }
  };

  const renderEvent = ({item}: {item: StoredEvent}) => {
    const client = clientsById[item.clientId];
    const formatDisplayDate = (
      explicitDate: string | undefined,
      created: string,
    ) => {
      const formatOpts: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      if (explicitDate && explicitDate.trim()) {
        const parsed = new Date(explicitDate);
        if (!isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString('en-IN', formatOpts);
        }
        return explicitDate;
      }
      const createdDate = new Date(created);
      return createdDate.toLocaleDateString('en-IN', formatOpts);
    };
    const displayDate = formatDisplayDate(item.date, item.createdAt);
    const eventTypeKey = (item as any).eventType as string | undefined;
    const eventTypeLabel = eventTypeKey
      ? t(`forms.eventTypes.${eventTypeKey}`)
      : undefined;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.eventTitle}>{item.eventName}</Text>
          <Text style={styles.eventDate}>{displayDate}</Text>
          <View style={{flexDirection: 'row', gap: 8}}>
            <TouchableOpacity
              onPress={() => {
                setEditingEvent(item as unknown as EditableEvent);
                setShowEditModal(true);
              }}>
              <Text style={styles.linkText}>{t('common.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const path = await createEventPdf(item, client);
                if (path) {
                  Alert.alert('Success', `Saved to: ${path}`);
                }
              }}>
              <Text style={styles.linkText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(t('forms.confirm'), t('forms.deleteConfirm'), [
                  {text: t('quickActions.cancel'), style: 'cancel'},
                  {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => deleteEvent(item.id),
                  },
                ])
              }>
              <Text style={[styles.linkText, {color: COLORS.ERROR_RED}]}>
                {t('common.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{client ? client.name : 'Unknown'}</Text>
        </View>
        {Boolean(eventTypeLabel) && (
          <View style={styles.row}>
            <Text style={styles.label}>{t('forms.eventType')}:</Text>
            <Text style={styles.value}>{eventTypeLabel}</Text>
          </View>
        )}
        {!!client?.phone && (
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{client.phone}</Text>
          </View>
        )}
        {Boolean((item as any).address) && (
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{(item as any).address}</Text>
          </View>
        )}
        {!!item.guests && (
          <View style={styles.row}>
            <Text style={styles.label}>Guests:</Text>
            <Text style={styles.value}>{item.guests}</Text>
          </View>
        )}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu Items:</Text>
          <View style={styles.tags}>
            {item.menuItems.slice(0, 6).map(mi => (
              <View key={mi} style={styles.tag}>
                <Text style={styles.tagText}>{mi}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const empty = useMemo(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No events saved yet</Text>
      </View>
    ),
    [],
  );

  // If a client filter was passed from Clients tab, filter events accordingly
  const filteredEvents = useMemo(() => {
    const clientId: string | undefined = route?.params?.filterClientId;
    if (!clientId) {
      return events;
    }
    return events.filter(ev => ev.clientId === clientId);
  }, [events, route?.params?.filterClientId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t('eventManagement.title')}
        subtitle={t('eventManagement.subtitle')}
      />
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderEvent}
        contentContainerStyle={
          filteredEvents.length === 0 ? styles.flexFill : undefined
        }
        ListEmptyComponent={empty}
      />
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {editingEvent && (
              <EventEditForm
                event={editingEvent}
                onSaved={updated => {
                  setShowEditModal(false);
                  setEvents(prev =>
                    prev.map(ev =>
                      ev.id === updated.id ? ({...ev, ...updated} as any) : ev,
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
  header: {
    padding: 20,
    backgroundColor: COLORS.HEADER_BG,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_APP,
  },
  title: {
    color: COLORS.TEXT_WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  eventDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    width: 70,
    color: COLORS.TEXT_SECONDARY,
  },
  value: {
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  menuContainer: {
    marginTop: 8,
  },
  menuTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  linkText: {
    color: COLORS.ACCENT_APP,
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.TEXT_MUTED,
  },
  flexFill: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
});

export default EventsScreen;
