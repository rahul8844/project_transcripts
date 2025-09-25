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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.VERY_LIGHT_GRAY,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default styles;
