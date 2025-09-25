import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  wrapperMultiline: {
    minHeight: 44,
  },
  input: {
    color: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  micButton: {
    position: 'absolute',
    right: 4,
    top: 'auto',
    bottom: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    backgroundColor: COLORS.WHITE,
  },
  micButtonActive: {
    borderColor: COLORS.ACCENT_APP,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
  },
  micText: {
    fontSize: 16,
  },
});

export default styles;
