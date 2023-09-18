import React from 'react';

import {Header} from '@rneui/base';
import {Text, TouchableOpacity, View} from 'react-native';
import {IconTemp} from './IconTemp';
import {Size} from '../theme/size';
import {FontSize} from '../theme/fonts';
import Back from '../assets/icons/general/chevron-left.svg';
import {RFPercentage} from 'react-native-responsive-fontsize';

interface Props {
  onPressLeft: () => void;
  onPressRight?: () => void;
  title: string;
  backgroundColor?: string;
  rightIcon?: boolean;
  renderRight?: () => React.ReactNode;
}

export const HeaderComponent = ({
  title,
  onPressLeft,
  onPressRight,
  backgroundColor = 'white',
  rightIcon = true,
  renderRight,
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
                marginLeft: RFPercentage(1),
              }}>
              {/* <IconTemp name="arrow-left" size={Size.iconSizeMedium} /> */}
              <Back
                width={Size.iconSizeMin}
                height={Size.iconSizeMedium}
                color={'#000000'}
              />
            </View>
          </TouchableOpacity>
        </View>
      }
      centerComponent={
        
          <Text
            numberOfLines={1}
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: '#000000',
              top: RFPercentage(0.2),
              fontSize: FontSize.fontSizeText20,
              flexWrap: 'wrap',
            }}>
            {title}
          </Text>
      }
      rightComponent={renderRight ? <>{renderRight()}</> : <></>}
    />
  );
};
