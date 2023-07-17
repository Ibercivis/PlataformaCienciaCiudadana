import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    label: string;
    focused: boolean;
    onPress: () => void;
}

const CustomTab = ({ label, focused = false, onPress }: Props) => {
  const tabStyle = {
    // Estilos personalizados
    backgroundColor: focused ? '#FF0000' : '#000000',
    borderRadius: 10,
    padding: 10,
  };

  const textStyle = {
    // Estilos de texto personalizados
    color: focused ? '#FFFFFF' : '#000000',
    fontSize: 16,
    // fontWeight: 'bold',
  };

  return (
    <TouchableOpacity style={tabStyle} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomTab;