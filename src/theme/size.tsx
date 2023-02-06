import {Dimensions} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

const window = Dimensions.get('window');

export const Size = {
  globalWidth: window.width,
  globalHeight: window.height,
  navigationButtonWith: '30%',
  navigationButtonHeigh:
    window.width > 720
      ? 50
      : window.width < 500 && window.width > 450
      ? 40
      : 40,
  iconSizeMin: RFPercentage(2),
  iconSizeMedium: RFPercentage(3.5),
  iconSizeLarge: RFPercentage(6),
  iconSizeExtraLarge: RFPercentage(8),
};
