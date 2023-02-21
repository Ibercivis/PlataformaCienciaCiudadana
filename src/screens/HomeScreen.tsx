import React, {SetStateAction, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from 'react-native';

import {Home} from '../components/screen_components/Home';
import { StackParams } from '../navigation/ProjectNavigator';
import { MyProjects } from '../components/screen_components/MyProjects';

interface Props extends StackScreenProps<StackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation, route}: Props) => {
  return (
    <>
      <View style={{flex: 1}}>
        {route.params.dashboard ? ( <Home navigation={navigation} route={route} /> ) : (<MyProjects navigation={navigation} route={route} />)}
      </View>
    </>
  );
};
