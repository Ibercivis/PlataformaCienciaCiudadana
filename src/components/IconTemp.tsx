import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props{
  name: string;
  size: number;
  color?: string
}

export const IconTemp = ({name, size, color = 'black'}: Props) => {
  return (
    <Icon name={name} size={size} color={color} />
  )
}
