import React from 'react';

import {Header} from '@rneui/base';
import {Text, TouchableOpacity, View} from 'react-native';
import {IconTemp} from './IconTemp';
import {Size} from '../theme/size';
import {FontSize} from '../theme/fonts';
import Back from '../assets/icons/general/chevron-left.svg';

interface Props {
  onPressLeft: () => void;
  onPressRight: () => void;
  title: string;
  backgroundColor?: string;
  rightIcon?: boolean;
}

export const HeaderComponent = ({
  title,
  onPressLeft,
  onPressRight,
  backgroundColor = 'white',
  rightIcon = true,
}: Props) => {
  const renderRightIcon = () => {
    if (rightIcon) {
      return (
        <View>
          <TouchableOpacity activeOpacity={0.5} onPress={onPressRight}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconTemp name="information-variant" size={Size.iconSizeMedium} />
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Header
      barStyle={'default'}
      containerStyle={{backgroundColor: backgroundColor, marginVertical: '2%'}}
      statusBarProps={{backgroundColor: backgroundColor}}
      leftComponent={
        <View>
          <TouchableOpacity activeOpacity={0.5} onPress={onPressLeft}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <IconTemp name="arrow-left" size={Size.iconSizeMedium} /> */}
              <Back
                width={Size.iconSizeMedium}
                height={Size.iconSizeMedium}
                color={'#000000'}
              />
            </View>
          </TouchableOpacity>
        </View>
      }
      centerComponent={
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            color: '#2F3061',
            fontSize: FontSize.fontSizeTextSubTitle,
          }}>
          {title}
        </Text>
      }
      rightComponent={renderRightIcon()}
    />
  );
};
