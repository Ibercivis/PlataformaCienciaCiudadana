import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import {Size} from '../theme/size';
import {IconTemp} from './IconTemp';

interface Props {
  label?: string;
  onPress: () => void;
  backgroundColor?: string;
  fontColor?: string;
  iconLeft?: string;
  iconRight?: string;
  width?: number;
}

export const CustomButton = ({
  label = '',
  onPress,
  backgroundColor = Colors.secondary,
  fontColor = '#fff',
  iconLeft = '',
  iconRight = '',
  width,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{...styles.touchable, backgroundColor: backgroundColor, width: width}}>
      <View style={{justifyContent: 'center',paddingTop: '0%', flexDirection: 'row',alignContent: 'center', backgroundColor: 'transparent'}}>
        {iconLeft && (
          <IconTemp
            name={iconLeft}
            size={Size.iconSizeMin}
            style={{alignSelf: 'center'}}
          />
        )}
        {label && (
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: FontSize.fontSizeText,
              alignSelf: 'center',
              color: fontColor,
            }}>
            {label}
          </Text>
        )}
        {iconRight && (
          <IconTemp
            name={iconRight}
            size={Size.iconSizeMin}
            style={{alignSelf: 'center'}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    borderRadius: 25,
    marginBottom: '4%',
    marginHorizontal: '2%',
    marginVertical: '1%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    elevation: 1,
  },
});
