import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Images from '../../assets';
import styles from './styles';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import {useLanguage} from '../../contexts/LanguageContext';
import QuickAction from '../../components/QuickAction';

const HomeScreen: React.FC = () => {
  const {t} = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={Images.logo} style={styles.logo} />
        <LanguageSwitcher size="small" />
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled">
        <QuickAction />
        {/* Quick Actions and Clients */}
        {/* <View style={styles.menuContainer}> */}
        {/* <ButtonPrimary
            title="Quick Actions"
            onPress={() => rootNavigation.navigate('QuickActions')}
          />
          <ButtonPrimary
            title="Existing Clients"
            onPress={() => tabNavigation.navigate('Clients')}
          /> */}
        {/* </View> */}

        {/* Add Client Form moved to modal from Quick Actions */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
