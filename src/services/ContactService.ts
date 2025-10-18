import {PermissionsAndroid, Platform, Alert} from 'react-native';
import Contacts from 'react-native-contacts';
import {Contact} from '../types/Contact';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export interface ContactServiceError {
  code: string;
  message: string;
}

class ContactService {
  private static instance: ContactService;
  private contacts: Contact[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  /**
   * Request contact permissions for both Android and iOS
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contact Permission',
            message: 'This app needs access to your contacts to display them.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await request(PERMISSIONS.IOS.CONTACTS);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting contact permissions:', error);
      return false;
    }
  }

  /**
   * Check if contact permissions are granted
   */
  public async checkPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );
        return granted;
      } else {
        const result = await check(PERMISSIONS.IOS.CONTACTS);
        return result === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error checking contact permissions:', error);
      return false;
    }
  }

  /**
   * Fetch all contacts from the device
   */
  public async fetchContacts(): Promise<Contact[]> {
    try {
      const hasPermission = await this.checkPermissions();
      console.log('ContactService: Has permission:', hasPermission);
      if (!hasPermission) {
        console.log('ContactService: Requesting permissions...');
        const granted = await this.requestPermissions();
        console.log('ContactService: Permission granted:', granted);
        if (!granted) {
          throw new Error('Contact permission denied');
        }
      }

      const contacts = await Contacts.getAllWithoutPhotos();
      if (!contacts) {
        this.contacts = [];
        this.isInitialized = true;
      }

      const formattedContacts: Contact[] = contacts
        ?.filter(
          contact => contact.displayName && contact.phoneNumbers.length > 0,
        )
        .map(contact => this.formatContact(contact))
        .sort((a, b) => a.name.localeCompare(b.name));

      this.contacts = formattedContacts;
      this.isInitialized = true;
      return formattedContacts;
    } catch (error) {
      console.error('Error in fetchContacts:', error);
      throw error;
    }
  }

  /**
   * Get cached contacts or fetch if not initialized
   */
  public async getContacts(): Promise<Contact[]> {
    if (this.isInitialized) {
      return this.contacts;
    }
    return await this.fetchContacts();
  }

  /**
   * Refresh contacts from device
   */
  public async refreshContacts(): Promise<Contact[]> {
    this.isInitialized = false;
    return await this.fetchContacts();
  }

  /**
   * Search contacts by query
   */
  public async searchContacts(query: string): Promise<Contact[]> {
    const contacts = await this.getContacts();
    if (!query.trim()) {
      return contacts;
    }

    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.phoneNumber.includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(lowercaseQuery)),
    );
  }

  /**
   * Format native contact to our Contact interface
   */
  private formatContact(nativeContact: any): Contact {
    const phoneNumber = nativeContact.phoneNumbers[0]?.number || '';
    const email = nativeContact.emailAddresses[0]?.email || '';

    return {
      id:
        nativeContact.recordID ||
        nativeContact.rawContactId ||
        Math.random().toString(),
      name: nativeContact.displayName || 'Unknown',
      phoneNumber: this.formatPhoneNumber(phoneNumber),
      email: email || undefined,
      avatar: nativeContact.thumbnailPath || undefined,
    };
  }

  /**
   * Format phone number for display
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Basic formatting for common patterns
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
      )}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(
        4,
        7,
      )}-${cleaned.slice(7)}`;
    }

    return phoneNumber; // Return original if no pattern matches
  }

  /**
   * Get contact by ID
   */
  public async getContactById(id: string): Promise<Contact | null> {
    const contacts = await this.getContacts();
    return contacts.find(contact => contact.id === id) || null;
  }

  /**
   * Clear cached contacts
   */
  public clearCache(): void {
    this.contacts = [];
    this.isInitialized = false;
  }

  /**
   * Show permission denied alert
   */
  public showPermissionDeniedAlert(): void {
    Alert.alert(
      'Permission Required',
      'This app needs access to your contacts to display them. Please enable contact permissions in your device settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Settings',
          onPress: () => {
            // This would typically open app settings
            console.log('Open app settings');
          },
        },
      ],
    );
  }
}

export default ContactService;
