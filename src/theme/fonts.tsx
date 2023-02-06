import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const window = Dimensions.get('window');

export const FontSize = {
  fontSize: window.width > 500 ? 50 : 30,
  fontSizeText: RFPercentage(2),
  fontSizeTextMin: RFPercentage(1.5),
  fontSizeTextTitle: RFPercentage(3.5),
};

export const fonts = StyleSheet.create({
  title: {
    // fontSize: RFPercentage(10),
    alignSelf: 'center',
    fontSize: FontSize.fontSizeTextTitle,
    fontWeight: 'bold',
    color: '#2F3061',
    marginTop: '6%',
    marginBottom: '10%',
  },
  boddy: {
    fontSize: RFPercentage(5),
  },

  typographyHeadlines: {
    fontFamily: 'Roboto',
    fontSize: 96,
  },
  typographyHeadlines2: {
    fontFamily: 'Roboto',
    fontSize: 60,
  },
  typographyHeadlines3: {
    fontFamily: 'Roboto',
    fontSize: 48,
  },
  typographyHeadlines4: {
    fontFamily: 'Roboto',
    fontSize: 34,
  },
  typographyHeadlines5: {
    fontFamily: 'Roboto',
    fontSize: 24,
  },
  typographyHeadlines6: {
    fontFamily: 'Roboto',
    fontSize: 20,
  },
  typographyBody1: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  typographyBody2: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  typographySubtitle1: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  typographySubtitle2: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  typographyButton: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  typographyOverline: {
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  typographyCaption: {
    fontFamily: 'Roboto',
    fontSize: 12,
  },
});