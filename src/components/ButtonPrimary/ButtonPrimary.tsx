import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../constants/constants';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  size = 'medium',
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${size}`],
    disabled || loading ? styles.buttonDisabled : null,
    style,
  ];

  const textStyleArray = [
    styles.buttonText,
    styles[`buttonText_${size}`],
    disabled || loading ? styles.buttonTextDisabled : null,
    textStyle,
  ];

  const handlePress = () => {
    onPress();
  };

  return (
    <Pressable
      style={({pressed}) => [
        buttonStyle,
        pressed && !disabled && !loading && {opacity: 0.8},
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      {loading ? (
        <ActivityIndicator color={COLORS.WHITE} size="small" />
      ) : (
        <Text style={textStyleArray}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.HEADER_BG,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.ACCENT_APP,
  },
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: COLORS.LIGHT_GRAY,
    elevation: 0,
    shadowOpacity: 0,
    borderColor: COLORS.LIGHT_GRAY,
  },
  buttonText: {
    color: COLORS.TEXT_WHITE,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: COLORS.TEXT_MUTED,
  },
});

export default ButtonPrimary;
