import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, useWindowDimensions} from 'react-native';
import {Colors} from '../../theme/colors';
import {FontFamily, FontSize} from '../../theme/fonts';
import {Size} from '../../theme/size';
import {IconTemp} from '../IconTemp';

interface Props {
  label?: string;
  onPress: () => void;
  backgroundColor?: string;
  fontColor?: string;
  iconLeft?: string;
  iconRight?: string;
  width?: number;
  fontFamily?: string;
  iconColor?: string;
}

export const CustomButton = ({
  label = '',
  onPress,
  backgroundColor = Colors.secondary,
  fontColor = '#fff',
  iconLeft = '',
  iconRight = '',
  width,
  iconColor = 'black',
  fontFamily= FontFamily.NotoSansDisplayMedium
}: Props) => {
  const {fontScale} = useWindowDimensions();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        ...styles.touchable,
        backgroundColor: backgroundColor,
       
      }}>
      <View
        style={{
          justifyContent: 'center',
          paddingTop: '0%',
          flexDirection: 'row',
          alignContent: 'center',
          backgroundColor: 'transparent',
        }}>
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
              fontWeight: '500',
              fontSize: FontSize.fontSizeText14 / fontScale,
              alignSelf: 'center',
              fontFamily: fontFamily,
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
            color={iconColor}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    // paddingHorizontal: '5%',
    // paddingVertical: '2%',
    width: '100%',
    justifyContent:'center',
    height:35,
    borderRadius: 12,
    // marginBottom: '4%',
    // marginHorizontal: '2%',
    marginTop: '2.5%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 5.65,
    // elevation: 1,
  },
});
