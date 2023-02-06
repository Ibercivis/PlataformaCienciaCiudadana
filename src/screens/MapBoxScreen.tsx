import React from 'react';
import {Text, View} from 'react-native';
import { MapBox } from '../components/screen_components/MapBox';

export const MapBoxScreen = () => {

  return (
    <View style={{flex: 1}}>
      <MapBox />
    </View>
  );
};
