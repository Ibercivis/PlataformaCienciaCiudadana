import React from 'react';
import {StyleProp, View, ViewStyle, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IconTemp} from './IconTemp';

interface Props {
  iconName: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const Fab = ({iconName, onPress, style = {}}: Props) => {
  return (
    <View style={{...(style as any)}}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.blackButton}>
        <IconTemp name={iconName} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    zIndex: 9999,
    height: 50,
    width: 50,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor:'#000',
    shadowOffset:{
        width: 0,
        height: 3
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.60,
    elevation: 6
  },
});
