import React, {useEffect, useRef, useState} from 'react';
import {View, TextInput, Alert, TextInputProps} from 'react-native';
import styles from './style';
import ListenerMic from '../ListenerMic';
import {useLanguage} from '../../contexts/LanguageContext';

interface VoiceTextInputProps extends Partial<TextInputProps> {
  value: string;
  onChangeText: (text: string) => void;
  setPlaceHolderText?: (text: string) => void;
}

const VoiceTextInput: React.FC<VoiceTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  editable = true,
  ...rest
}) => {
  const {t, language} = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [placeHolderText, setPlaceHolderText] = useState(placeholder);
  const voiceRef = useRef<any>(null);

  useEffect(() => {
    // Lazy load voice module to keep it optional
    let mounted = true;
    (async () => {
      try {
        const Voice = await import('@react-native-voice/voice');
        if (!mounted) {
          return;
        }
        voiceRef.current = (Voice as any).default;
      } catch (e) {
        voiceRef.current = null;
      }
    })();

    return () => {
      mounted = false;
      try {
        voiceRef.current?.removeAllListeners?.();
        voiceRef.current?.destroy?.();
      } catch {}
    };
  }, []);

  const bindVoiceHandlers = (v: any) => {
    v.onSpeechStart = (_e: any) => {
      setPlaceHolderText(t('speaker.listeningStart'));
    };
    v.onSpeechEnd = (_e: any) => {
      setPlaceHolderText(t('speaker.listeningEnd'));
    };
    v.onSpeechResults = (e: any) => {
      setPlaceHolderText('');
      setIsListening(false);
      const results: string[] = e?.value || [];
      if (results.length > 0) {
        onChangeText(results[0]);
      }
    };
    v.onSpeechError = (_e: any) => {
      // Fail-safe: stop local listening state on errors
      setIsListening(false);
      setPlaceHolderText(placeholder);
    };
    v.onSpeechPartialResults = (_e: any) => {};
  };

  const startListening = async () => {
    if (!voiceRef.current) {
      Alert.alert('Info', 'Voice input not available on this device.');
      return;
    }
    try {
      // Ensure this input owns the listeners for this session
      bindVoiceHandlers(voiceRef.current);
      // Reset native listeners so they attach with our current handlers
      await voiceRef.current.destroy?.();
      setIsListening(true);
      setPlaceHolderText(t('speaker.startSpeaking'));
      const locale = language === 'hi' ? 'hi-IN' : 'en-US';
      await voiceRef.current.start(locale);
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (!voiceRef.current) {
      setIsListening(false);
      return;
    }
    try {
      setPlaceHolderText(t('speaker.listeningEnd'));
      await voiceRef.current.stop();
      await voiceRef.current.destroy?.();
      voiceRef.current?.removeAllListeners?.();
    } catch {}
    setIsListening(false);
  };

  const onMicPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  return (
    <View style={[styles.wrapper, multiline && styles.wrapperMultiline]}>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeHolderText}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        {...rest}
      />
      <ListenerMic onMicPress={onMicPress} isListening={isListening} />
    </View>
  );
};

export default VoiceTextInput;
