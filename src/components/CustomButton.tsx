import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';

interface Props {
  label: string;
  onPress: () => void;
}

export const CustomButton = ({label, onPress}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        backgroundColor: Colors.secondary,
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        borderRadius: 15,
        marginBottom: '4%',
        marginHorizontal: '5%',
        marginVertical: '1%',
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: FontSize.fontSizeText,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
