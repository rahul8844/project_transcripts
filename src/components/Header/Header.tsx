import React from 'react';
import {Text, View} from 'react-native';
import CateringLogo from '../CateringLogo';
import LanguageSwitcher from '../LanguageSwitcher';
import styles from './style';

const Header = props => {
  const {title = '', subtitle = ''} = props;
  return (
    <View style={styles.header}>
      <CateringLogo size="large" />
      <LanguageSwitcher size="small" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default Header;
