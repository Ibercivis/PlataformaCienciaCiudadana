import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PermissionsContext} from '../context/PermissionsContext';
import {LoginScreen} from '../screens/LoginScreen';
import {AuthContext} from '../context/AuthContext';
import {DrawerNavigation} from './DrawerNavigation';
import {RegisterScreen} from '../screens/RegisterScreen';
import { ForgotPassword } from '../screens/ForgotPassword';

const Stack = createStackNavigator();

export const Navigator = () => {
  //permite conocer por medio del contexto si se han garantizado los permisos que elijamos
  const {permissions} = useContext(PermissionsContext);

  //si no está logged, se le redirigirá hasta la pantalla de login
  const {authState} = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {authState.isLoggedIn || authState.token ? (
        // <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      ) : (
        // <Stack.Screen name="DrawerPaperNavigation" component={DrawerPaperNavigation} />
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}

      {/* {permissions.locationStatus === 'granted' ? (
        <Stack.Screen name="MapScreen" component={MapScreen} />
      ) : (
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      )} */}
    </Stack.Navigator>
  );
};
