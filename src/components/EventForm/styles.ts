import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  container: {padding: 16},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
  },
  typePillSelected: {
    borderColor: COLORS.ACCENT_APP,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
  },
  typePillText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
  typePillTextSelected: {
    color: COLORS.ACCENT_APP,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});

export default styles;
