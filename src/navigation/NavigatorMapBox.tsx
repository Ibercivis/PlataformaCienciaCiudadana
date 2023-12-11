import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PermissionsScreen} from '../screens/PermissionsScreen';
import {PermissionsContext} from '../context/PermissionsContext';
import {LoadingScreen} from '../screens/LoadingScreen';
import { MapBoxScreen } from '../screens/MapBoxScreen';

const Stack = createStackNavigator();

export const NavigatorMapBox = () => {
  //permite conocer por medio del contexto si se han garantizado los permisos que elijamos
  const {permissions} = useContext(PermissionsContext);

  if (permissions.locationStatus === 'unavailable') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {permissions.locationStatus === 'granted' ? (
        <Stack.Screen name="ParticipateMap" component={MapBoxScreen} />
      ) : (
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      )}
    </Stack.Navigator>
  );
};