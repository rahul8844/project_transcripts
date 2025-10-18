export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  isSelected?: boolean;
}

export interface ContactSelectorProps {
  contacts?: Contact[]; // Optional - if not provided, will fetch from device
  onContactSelect: (contact: Contact) => void;
  onSearchChange?: (searchText: string) => void;
  placeholder?: string;
  showSearchBar?: boolean;
  maxHeight?: number;
  style?: any;
  useDeviceContacts?: boolean; // Whether to use device contacts or provided contacts
  onContactsLoaded?: (contacts: Contact[]) => void;
  onError?: (error: string) => void;
  debugMode?: boolean; // Enable debug logging
}
