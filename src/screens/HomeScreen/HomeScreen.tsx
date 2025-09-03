import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../../App';
import { COLORS, SIZES } from '../../constants/ui_constants';
import styles from './styles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const menuOptions = [
    {
      id: 'listen',
      title: 'Listen to Menu',
      subtitle: 'Use voice recognition to capture menu items',
      icon: 'mic',
      color: COLORS.PRIMARY_GREEN,
      route: 'MenuListening' as keyof RootStackParamList,
    },
    {
      id: 'notes',
      title: 'View Notes',
      subtitle: 'Review and manage your menu notes',
      icon: 'note',
      color: COLORS.PRIMARY_BLUE,
      route: 'Notes' as keyof RootStackParamList,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Configure app preferences and permissions',
      icon: 'settings',
      color: COLORS.PRIMARY_PURPLE,
      route: 'Settings' as keyof RootStackParamList,
    },
  ];

  const handleMenuPress = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="restaurant" size={SIZES.ICON_XXLARGE} color={COLORS.PRIMARY_GREEN} />
          <Text style={styles.title}>Menu Listener</Text>
          <Text style={styles.subtitle}>
            Capture menu items with voice recognition for your venue
          </Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.menuOption}
              onPress={() => handleMenuPress(option.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                <Icon name={option.icon} size={32} color="#fff" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipItem}>
            <Icon name="lightbulb" size={20} color="#FF9800" />
            <Text style={styles.tipText}>
              Speak clearly and mention quantities (e.g., "2 pizzas", "3 burgers")
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="lightbulb" size={20} color="#FF9800" />
            <Text style={styles.tipText}>
              Use the stop button when you're done speaking
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="lightbulb" size={20} color="#FF9800" />
            <Text style={styles.tipText}>
              Review and edit items in the Notes section
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Perfect for restaurants, cafes, and food venues
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default HomeScreen;
