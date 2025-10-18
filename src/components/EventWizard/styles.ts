import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  container: {},
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.CARD_BORDER,
  },
  stepDotActive: {
    backgroundColor: COLORS.ACCENT_APP,
  },
  stepBar: {
    height: 2,
    flex: 1,
    backgroundColor: COLORS.CARD_BORDER,
    marginHorizontal: 6,
  },
  stepBarActive: {
    backgroundColor: COLORS.ACCENT_APP,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  radioOption: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.ACCENT_APP,
  },
  radioText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  list: {
    maxHeight: 240,
  },
  listItem: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listItemSelected: {
    borderColor: COLORS.ACCENT_APP,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  clientPhone: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyText: {
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  footerHalf: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  contactSelector: {
    marginBottom: 12,
  },
  selectedClientInfo: {
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.ACCENT_APP,
  },
  selectedClientText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  selectedClientPhone: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default styles;
