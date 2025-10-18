import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  formContainer: {
    // padding: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleLabel: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
});

export default styles;
