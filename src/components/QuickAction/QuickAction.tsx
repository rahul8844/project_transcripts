import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../../navigation/TabNavigator';
import {COLORS} from '../../constants/constants';
import {useLanguage} from '../../contexts/LanguageContext';
import AddClientForm from '../ClientForm';
import EventWizard from '../EventWizard';
import styles from './styles';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

const QuickActionScreen: React.FC = () => {
  const [_recentActions, setRecentActions] = useState<string[]>([]);
  const {t} = useLanguage();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const tabNavigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const handleAction = (actionId: string, actionTitle: string) => {
    // Add to recent actions
    setRecentActions(prev => {
      const newActions = [
        actionTitle,
        ...prev.filter(action => action !== actionTitle),
      ];
      return newActions.slice(0, 5);
    });

    // Show action confirmation
    Alert.alert(
      t('quickActions.actionExecuted'),
      `${actionTitle} ${t('quickActions.actionCompleted')}`,
    );
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-event',
      title: t('quickActions.newEvent'),
      description: t('quickActions.createNewEvent'),
      icon: '🎉',
      color: COLORS.PRIMARY_BLUE,
      action: () => setShowNewEvent(true),
    },
    {
      id: 'add-client',
      title: t('quickActions.addClient'),
      description: t('quickActions.registerNewClient'),
      icon: '👤',
      color: COLORS.PRIMARY_GREEN,
      action: () => setShowAddClient(true),
    },
    {
      id: 'view-events',
      title: t('quickActions.viewEvents'),
      description: t('quickActions.checkEvents'),
      icon: '📅',
      color: COLORS.PRIMARY_ORANGE,
      action: () => navigation.navigate('Events'),
    },
    {
      id: 'existing-clients',
      title: t('quickActions.existingClients'),
      description: t('quickActions.checkExistingClients'),
      icon: '👥',
      color: COLORS.PRIMARY_PURPLE,
      action: () => tabNavigation.navigate('Clients'),
    },
  ];

  const renderActionCard = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionCard, {borderLeftColor: action.color}]}
      onPress={action.action}>
      <View style={styles.actionContent}>
        <Text style={styles.actionIcon}>{action.icon}</Text>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionDescription}>{action.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('quickActions.quickActions')}
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderActionCard)}
          </View>
        </View>
      </ScrollView>
      {/* Add Client Modal */}
      <Modal
        visible={showAddClient}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddClient(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AddClientForm
              onSaved={() => {
                setShowAddClient(false);
                handleAction('add-client', t('quickActions.addClient'));
              }}
              onCancel={() => setShowAddClient(false)}
            />
          </View>
        </View>
      </Modal>

      {/* New Event Modal (3-step wizard) */}
      <Modal
        visible={showNewEvent}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewEvent(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <EventWizard
              onSaved={() => {
                setShowNewEvent(false);
                handleAction('new-event', t('quickActions.newEvent'));
              }}
              onCancel={() => setShowNewEvent(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuickActionScreen;
