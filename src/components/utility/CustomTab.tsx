import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../theme/colors';
import {IconBootstrap} from './IconBootstrap';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {FontSize} from '../../theme/fonts';

interface Props {
  label: string;
  route: string;
  focused: boolean;
  onPress: () => void;
  icon: string;
}

const CustomTab = ({label, route, icon, focused = false, onPress}: Props) => {
  const navigation = useNavigation();

  const tabStyle = {
    // Estilos personalizados
    backgroundColor: focused ? Colors.primaryLigth : 'transparent',
    borderRadius: 20,
    padding: 10,
    height: 40,
  };

  const textStyle = {
    // Estilos de texto personalizados
    color: focused ? '#FFFFFF' : '#000000',
    fontSize: FontSize.fontSizeText14,
    marginHorizontal: RFPercentage(1),
    // fontWeight: 'bold',
  };

  const onPressTouchable = () => {
    onPress();
    navigation.navigate(route as never);
  };

  return (
    <SafeAreaView style={{flex: 1,}}>
      <TouchableOpacity style={tabStyle} onPress={onPressTouchable}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              marginHorizontal: '4%',
              justifyContent: 'center',
              top: RFPercentage(0.18),
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              left: RFPercentage(0.1),
            }}>
            <IconBootstrap
              name={icon}
              size={RFPercentage(2)}
              color={focused ? '#FFFFFF' : '#000000'}
            />
          </View>
          {focused ? <Text style={textStyle}>{label}</Text> : <></>}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomTab;
