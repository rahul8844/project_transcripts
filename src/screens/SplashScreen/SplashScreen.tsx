import React, {useEffect, useRef} from 'react';
import {View, Image, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../App';
import Images from '../../assets';
import styles from './style';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;


const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    startAnimation();

    // Navigate to MainTabs after animation completes
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 3000); // 3 seconds total

    return () => clearTimeout(timer);
  }, [navigation]);

  const startAnimation = () => {
    // Fade in animation
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation - starts small and grows to normal size
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Subtle rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Bouncing animation with multiple bounces
    Animated.sequence([
      // First bounce - large
      Animated.timing(bounceAnim, {
        toValue: -120,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Second bounce - medium
      Animated.timing(bounceAnim, {
        toValue: -80,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      // Third bounce - small
      Animated.timing(bounceAnim, {
        toValue: -40,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      // Fourth bounce - very small
      Animated.timing(bounceAnim, {
        toValue: -20,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Final settle
      Animated.timing(bounceAnim, {
        toValue: -5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [
                {translateY: bounceAnim},
                {scale: scaleAnim},
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: opacityAnim,
            },
          ]}>
          <Image source={Images.logo} style={styles.logo} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
