import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants/constants';
import {useLanguage} from '../contexts/LanguageContext';

// Import screens
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ClientsScreen from '../screens/ClientsScreen';
import MenuItemsScreen from '../screens/MenuItemsScreen';
import EventsScreen from '../screens/EventsScreen/EventsScreen';

export type TabParamList = {
  Home: undefined;
  Events: undefined;
  Clients: undefined;
  MenuItems: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Custom tab bar icon component
const TabIcon: React.FC<{focused: boolean; label: string}> = ({
  focused,
  label,
}) => {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
        {label.charAt(0)}
      </Text>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  const {t} = useLanguage();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.VERY_LIGHT_GRAY,
          borderTopWidth: 2,
          borderTopColor: COLORS.ACCENT_APP,
          elevation: 8,
          shadowColor: COLORS.BLACK,
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.HEADER_BG,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} label={t('nav.home')} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarLabel: t('nav.events'),
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} label={t('nav.events')} />
          ),
        }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          tabBarLabel: t('nav.clients'),
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} label={t('nav.clients')} />
          ),
        }}
      />
      <Tab.Screen
        name="MenuItems"
        component={MenuItemsScreen}
        options={{
          tabBarLabel: t('nav.menuItems'),
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} label={t('nav.menuItems')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIconFocused: {
    backgroundColor: COLORS.HEADER_BG,
  },
  tabIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
  },
  tabIconTextFocused: {
    color: COLORS.TEXT_WHITE,
  },
});

export default TabNavigator;
