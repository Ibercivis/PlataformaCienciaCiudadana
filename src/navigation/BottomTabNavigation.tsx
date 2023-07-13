import React, {useContext} from 'react';
import {PermissionsContext} from '../context/PermissionsContext';
import {AuthContext} from '../context/AuthContext';
import {LoadingScreen} from '../screens/LoadingScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProjectNavigator } from './ProjectNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LoginScreen } from '../screens/LoginScreen';


const Tab = createBottomTabNavigator<StackParams>();

export type StackParams = {
  // NavigatorMap: undefined;
  // NavigatorMapBox: undefined;
  SettingsScreen: undefined;
  LoginScreen: undefined;
  ProjectNavigator: undefined;
};

export const BottomTabNavigation = () => {
  //permite conocer por medio del contexto si se han garantizado los permisos que elijamos
  const {permissions} = useContext(PermissionsContext);

  //si no está logged, se le redirigirá hasta la pantalla de login
  const {status} = useContext(AuthContext);

  if (status === 'checking') {
    return <LoadingScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="ProjectNavigator" component={ProjectNavigator} />
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
      <Tab.Screen name="LoginScreen" component={LoginScreen} />
    </Tab.Navigator>
  );
};

