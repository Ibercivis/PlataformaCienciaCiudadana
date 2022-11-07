import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {IconTemp} from '../components/IconTemp';
import { globalStyles } from '../thyme/theme';

export const LoadingScreen = () => {
  return (
    <View style={{...globalStyles.globalMargin, ...styles.container}}>
      <Text>Maps</Text>
      <IconTemp name="star-outline" size={25} color="red" />
      <ActivityIndicator size={50} color='black' />
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
})