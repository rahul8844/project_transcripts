import { RootStackParamList } from '../../App';
import HomeScreen from '../screens/HomeScreen';
import MenuListeningScreen from '../screens/MenuListeningScreen/MenuListeningScreen';
import NotesScreen from '../screens/NotesScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';

interface INAVIGATOR {
    name: keyof RootStackParamList;
    component: React.ComponentType<any>;
    title: string;
}

export const SCREEN_ROUTES: Record<string, keyof RootStackParamList> = {
    HOME: 'Home',
    MENU_LISTENING: 'MenuListening',
    NOTES: 'Notes',
};

const NAVIGATOR: INAVIGATOR[] = [
  {
    name: SCREEN_ROUTES.HOME,
    component: HomeScreen,
    title: 'HariOm Caterers',
  },
  {
    name: SCREEN_ROUTES.MENU_LISTENING,
    component: MenuListeningScreen,
    title: 'Listen to Menu',
  },
  {
    name: SCREEN_ROUTES.NOTES,
    component: NotesScreen,
    title: 'Menu Notes',
  },
];

export default NAVIGATOR;
