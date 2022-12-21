import React from 'react';
import {Text, View} from 'react-native';
import {Map} from '../components/Map';
import { MapBox } from '../components/MapBox';

export const MapBoxScreen = () => {

  return (
    <View style={{flex: 1}}>
      <MapBox />
    </View>
  );
};
