import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
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
import AddClientForm from '../AddClientForm';
import EventWizard from '../EventWizard';

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
    // {
    //   id: 'menu-planning',
    //   title: t('quickActions.menuPlanning'),
    //   description: t('quickActions.planMenus'),
    //   icon: '🍽️',
    //   color: COLORS.PRIMARY_PURPLE,
    //   action: () =>
    //     handleAction('menu-planning', t('quickActions.menuPlanning')),
    // },
    // {
    //   id: 'inventory',
    //   title: t('quickActions.inventory'),
    //   description: t('quickActions.checkIngredients'),
    //   icon: '📦',
    //   color: COLORS.INFO_BLUE,
    //   action: () => handleAction('inventory', t('quickActions.inventory')),
    // },
    // {
    //   id: 'staff-schedule',
    //   title: t('quickActions.staffSchedule'),
    //   description: t('quickActions.manageStaff'),
    //   icon: '👥',
    //   color: COLORS.SUCCESS_GREEN,
    //   action: () =>
    //     handleAction('staff-schedule', t('quickActions.staffSchedule')),
    // },
    // {
    //   id: 'venue-management',
    //   title: t('quickActions.venueManagement'),
    //   description: t('quickActions.manageVenues'),
    //   icon: '🏢',
    //   color: COLORS.WARNING_ORANGE,
    //   action: () =>
    //     handleAction('venue-management', t('quickActions.venueManagement')),
    // },
    // {
    //   id: 'quotes',
    //   title: t('quickActions.generateQuotes'),
    //   description: t('quickActions.createQuotes'),
    //   icon: '💰',
    //   color: COLORS.ERROR_RED,
    //   action: () => handleAction('quotes', t('quickActions.generateQuotes')),
    // },
    // {
    //   id: 'feedback',
    //   title: t('quickActions.clientFeedback'),
    //   description: t('quickActions.viewReviews'),
    //   icon: '⭐',
    //   color: COLORS.ACCENT_APP,
    //   action: () => handleAction('feedback', t('quickActions.clientFeedback')),
    // },
    // {
    //   id: 'expenses',
    //   title: t('quickActions.expenses'),
    //   description: t('quickActions.trackExpenses'),
    //   icon: '💸',
    //   color: COLORS.SUCCESS_GREEN,
    //   action: () => handleAction('expenses', t('quickActions.expenses')),
    // },
    // {
    //   id: 'supplier',
    //   title: t('quickActions.supplierOrders'),
    //   description: t('quickActions.orderFromSuppliers'),
    //   icon: '🚚',
    //   color: COLORS.PRIMARY_PURPLE,
    //   action: () => handleAction('supplier', t('quickActions.supplierOrders')),
    // },
    // {
    //   id: 'reports',
    //   title: t('quickActions.reports'),
    //   description: t('quickActions.viewAnalytics'),
    //   icon: '📊',
    //   color: COLORS.DARK_GRAY,
    //   action: () => handleAction('reports', t('quickActions.reports')),
    // },
  ];

  // const emergencyActions: QuickAction[] = [
  //   {
  //     id: 'emergency-stop',
  //     title: t('quickActions.emergencyStop'),
  //     description: t('quickActions.haltOperations'),
  //     icon: '🚨',
  //     color: COLORS.ERROR_RED,
  //     action: () => {
  //       Alert.alert(
  //         t('quickActions.emergencyStop'),
  //         t('quickActions.confirmEmergency'),
  //         [
  //           {text: t('quickActions.cancel'), style: 'cancel'},
  //           {
  //             text: t('quickActions.confirm'),
  //             style: 'destructive',
  //             onPress: () =>
  //               handleAction('emergency-stop', t('quickActions.emergencyStop')),
  //           },
  //         ],
  //       );
  //     },
  //   },
  //   {
  //     id: 'call-manager',
  //     title: t('quickActions.callManager'),
  //     description: t('quickActions.contactManager'),
  //     icon: '📞',
  //     color: COLORS.PRIMARY_BLUE,
  //     action: () => handleAction('call-manager', t('quickActions.callManager')),
  //   },
  //   {
  //     id: 'kitchen-alert',
  //     title: t('quickActions.kitchenAlert'),
  //     description: t('quickActions.sendAlert'),
  //     icon: '👨‍🍳',
  //     color: COLORS.WARNING_ORANGE,
  //     action: () =>
  //       handleAction('kitchen-alert', t('quickActions.kitchenAlert')),
  //   },
  // ];

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

  // const renderRecentAction = (action: string, index: number) => (
  //   <View key={index} style={styles.recentActionItem}>
  //     <Text style={styles.recentActionIcon}>⏰</Text>
  //     <Text style={styles.recentActionText}>{action}</Text>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* Recent Actions */}
        {/* {recentActions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('quickActions.recentActions')}
            </Text>
            <View style={styles.recentActionsContainer}>
              {recentActions.map(renderRecentAction)}
            </View>
          </View>
        )} */}

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('quickActions.quickActions')}
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderActionCard)}
          </View>
        </View>

        {/* Emergency Actions */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('quickActions.emergencyActions')}
          </Text>
          <View style={styles.emergencyActionsContainer}>
            {emergencyActions.map(renderActionCard)}
          </View>
        </View> */}

        {/* Catering Status */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('quickActions.cateringOperationsStatus')}
          </Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: COLORS.SUCCESS_GREEN},
                ]}
              />
              <Text style={styles.statusText}>
                {t('quickActions.kitchenOperational')}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: COLORS.SUCCESS_GREEN},
                ]}
              />
              <Text style={styles.statusText}>
                {t('quickActions.deliveryReady')}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: COLORS.WARNING_ORANGE},
                ]}
              />
              <Text style={styles.statusText}>
                {t('quickActions.eventsToday')}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: COLORS.SUCCESS_GREEN},
                ]}
              />
              <Text style={styles.statusText}>
                {t('quickActions.staffPresent')}
              </Text>
            </View>
          </View>
        </View> */}

        {/* Quick Stats */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('quickActions.todaysOverview')}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>{t('common.events')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>₹45,000</Text>
              <Text style={styles.statLabel}>{t('common.revenue')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>180</Text>
              <Text style={styles.statLabel}>{t('common.guests')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>{t('common.rating')}</Text>
            </View>
          </View>
        </View> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_APP,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 30,
    backgroundColor: COLORS.HEADER_BG,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_APP,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    marginTop: 16,
    marginBottom: 8,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.VERY_LIGHT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  recentActionsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recentActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.EXTRA_LIGHT_GRAY,
  },
  recentActionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentActionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },
  emergencyActionsContainer: {
    gap: 12,
  },
  statusContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    paddingTop: 12,
    paddingBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.ACCENT_APP,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default QuickActionScreen;
