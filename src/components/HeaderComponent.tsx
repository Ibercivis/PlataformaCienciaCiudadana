import React from 'react';

import {Header} from '@rneui/base';
import { Text, TouchableOpacity, View } from 'react-native';
import { IconTemp } from './IconTemp';
import { Size } from '../theme/size';
import { FontSize } from '../theme/fonts';

interface Props {
  onPressLeft: () => void;
  onPressRight: () => void;
  title: string;
  backgroundColor?: string;
}

export const HeaderComponent = ({title, onPressLeft, onPressRight, backgroundColor = 'white'}: Props) => {
  return (
    <Header
      barStyle={'default'}
      containerStyle={{backgroundColor: backgroundColor, marginVertical: '2%'}}
      statusBarProps={{backgroundColor: backgroundColor}}
      leftComponent={
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPressLeft}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconTemp name="arrow-left" size={Size.iconSizeMedium} />
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
      rightComponent={
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
      }
    />
  );
};
