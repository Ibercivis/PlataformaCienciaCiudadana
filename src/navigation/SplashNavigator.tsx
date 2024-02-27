import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { Navigator } from './Navigator';
import { SplashAnimation } from '../data/SplashAnimation';

const Stack = createStackNavigator();

export const SplashNavigator = () => {


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'transparent',
          flex:1
        },
      }}>
        <Stack.Screen name="Navigator" component={Navigator} />
        <Stack.Screen name="SplashAnimation" component={SplashAnimation} />
     
    </Stack.Navigator>
  );
};