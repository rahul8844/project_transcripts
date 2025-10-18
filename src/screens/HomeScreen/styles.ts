import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_APP,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  logo: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  header: {
    padding: 30,
    backgroundColor: COLORS.HEADER_BG,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT_APP,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_WHITE,
    marginTop: 16,
    marginBottom: 8,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.VERY_LIGHT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
  },
  menuContainer: {
    padding: 20,
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BG,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 3,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  tipsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.CARD_BORDER,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default styles;
