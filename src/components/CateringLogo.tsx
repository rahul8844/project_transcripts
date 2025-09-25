import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLORS} from '../constants/constants';
import Images from '../assets';

interface CateringLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const CateringLogo: React.FC<CateringLogoProps> = ({
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          text: styles.smallText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          text: styles.largeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          text: styles.mediumText,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[sizeStyles.container]}>
      <View style={[sizeStyles.icon]}>
        <Image source={Images.logo} style={styles.logoImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  // Small size
  smallContainer: {
    marginBottom: 8,
  },
  smallIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  smallText: {
    fontSize: 14,
  },
  // Medium size
  mediumContainer: {
    marginBottom: 12,
  },
  mediumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mediumText: {
    fontSize: 18,
  },
  // Large size
  largeContainer: {
    marginBottom: 16,
  },
  largeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  largeText: {
    fontSize: 22,
  },
});

export default CateringLogo;
