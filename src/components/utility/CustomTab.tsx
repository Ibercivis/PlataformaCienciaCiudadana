import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {
  label: string;
  route: string;
  focused: boolean;
  onPress: () => void;
}

const CustomTab = ({label,route, focused = false, onPress}: Props) => {
  const navigation = useNavigation();
  
  const tabStyle = {
    // Estilos personalizados
    backgroundColor: focused ? '#FF0000' : '#000000',
    borderRadius: 10,
    padding: 10,
    height: 40,
  };

  const textStyle = {
    // Estilos de texto personalizados
    color: focused ? '#FFFFFF' : '#FFFFFF',
    fontSize: 16,
    // fontWeight: 'bold',
  };

  const onPressTouchable = () => {
    onPress()
    navigation.navigate(route as never);
  }

  return (
    <TouchableOpacity style={tabStyle} onPress={onPressTouchable} >
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomTab;
