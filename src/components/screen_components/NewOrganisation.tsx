import React, {useEffect, useRef, useState} from 'react'
import { View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { StackParams } from '../../navigation/ProjectNavigator'
import { Text } from 'react-native-paper'

interface Props extends StackScreenProps<StackParams, 'OrganisationScreen'> {}

export const NewOrganisation = ({navigation, route}: Props) => {
  return (
    <View><Text>NewOrganisation</Text></View>
  )
}
