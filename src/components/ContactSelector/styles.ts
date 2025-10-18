import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    overflow: 'hidden',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: COLORS.EXTRA_LIGHT_GRAY,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BORDER,
  },
  searchInput: {
    height: 40,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  contactsList: {
    backgroundColor: COLORS.WHITE,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.VERY_LIGHT_GRAY,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.ACCENT_APP,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR_RED,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.ACCENT_APP,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
  },
  fallbackText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default styles;
