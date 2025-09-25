import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './style';

interface IProps {
  isListening: boolean;
  onMicPress: () => void;
}

const ListenerMic: React.FC<IProps> = (props: IProps) => {
  const {onMicPress, isListening = false} = props;

  return (
    <TouchableOpacity
      style={[styles.micButton, isListening && styles.micButtonActive]}
      onPress={onMicPress}>
      <Text style={styles.micText}>{isListening ? '⏹' : '🎙️'}</Text>
    </TouchableOpacity>
  );
};

export default ListenerMic;
