import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_APP,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.HEADER_BG,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_APP,
  },
  title: {
    color: COLORS.TEXT_WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  eventDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    width: 70,
    color: COLORS.TEXT_SECONDARY,
  },
  value: {
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  menuContainer: {
    marginTop: 8,
  },
  menuTitle: {
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  linkText: {
    color: COLORS.ACCENT_APP,
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.TEXT_MUTED,
  },
  flexFill: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
  },
});

export default styles;
