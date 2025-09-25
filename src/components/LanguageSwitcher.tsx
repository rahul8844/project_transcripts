import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useLanguage} from '../contexts/LanguageContext';
import {LANGUAGES, LANGUAGE_NAMES} from '../constants/languages';
import {COLORS} from '../constants/constants';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = 'medium',
  showLabel = false,
}) => {
  const {language, setLanguage, t} = useLanguage();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          button: styles.smallButton,
          text: styles.smallText,
          label: styles.smallLabel,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          button: styles.largeButton,
          text: styles.largeText,
          label: styles.largeLabel,
        };
      default:
        return {
          container: styles.mediumContainer,
          button: styles.mediumButton,
          text: styles.mediumText,
          label: styles.mediumLabel,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handleLanguageChange = () => {
    const newLanguage = language === LANGUAGES.ENGLISH ? LANGUAGES.HINDI : LANGUAGES.ENGLISH;
    setLanguage(newLanguage);
  };

  return (
    <View style={[styles.container, sizeStyles.container]}>
      {showLabel && (
        <Text style={[styles.label, sizeStyles.label]}>
          {t('common.language')}: 
        </Text>
      )}
      <TouchableOpacity
        style={[styles.button, sizeStyles.button]}
        onPress={handleLanguageChange}>
        <Text style={[styles.text, sizeStyles.text]}>
          {LANGUAGE_NAMES[language]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    marginRight: 8,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.HEADER_BG,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  text: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Small size
  smallContainer: {
    marginBottom: 4,
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallText: {
    fontSize: 12,
  },
  smallLabel: {
    fontSize: 12,
  },
  // Medium size
  mediumContainer: {
    marginBottom: 8,
  },
  mediumButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mediumText: {
    fontSize: 14,
  },
  mediumLabel: {
    fontSize: 14,
  },
  // Large size
  largeContainer: {
    marginBottom: 12,
  },
  largeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  largeText: {
    fontSize: 16,
  },
  largeLabel: {
    fontSize: 16,
  },
});

export default LanguageSwitcher;
