import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import TabNavigator from './src/navigation/TabNavigator';
import NotesScreen from './src/screens/NotesScreen';
import {COLORS} from './src/constants/constants';
import {LanguageProvider} from './src/contexts/LanguageContext';
import EventsScreen from './src/screens/EventsScreen/EventsScreen';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  MenuListening: undefined;
  Notes: undefined;
  Settings: undefined;
  Events: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <LanguageProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerStyle: {
                  backgroundColor: COLORS.HEADER_BG,
                  elevation: 4,
                  shadowColor: COLORS.BLACK,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                },
                headerTintColor: COLORS.TEXT_WHITE,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                title: 'Welcome to HariOm Caterers',
              }}>
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Notes"
                component={NotesScreen}
                options={{title: 'Menu Notes'}}
              />
              <Stack.Screen
                name="Events"
                component={EventsScreen}
                options={{title: 'Events'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
