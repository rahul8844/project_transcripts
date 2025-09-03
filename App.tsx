import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import MenuListeningScreen from './src/screens/MenuListeningScreen/MenuListeningScreen';
import NotesScreen from './src/screens/NotesScreen';
import SettingsScreen from './src/screens/SettingsScreen/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  MenuListening: undefined;
  Notes: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2E7D32',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Menu Listener' }}
            />
            <Stack.Screen 
              name="MenuListening" 
              component={MenuListeningScreen} 
              options={{ title: 'Listen to Menu' }}
            />
            <Stack.Screen 
              name="Notes" 
              component={NotesScreen} 
              options={{ title: 'Menu Notes' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ title: 'Settings' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
