import React, {useContext} from 'react';
import {PermissionsContext} from '../context/PermissionsContext';
import {AuthContext} from '../context/AuthContext';
import {LoadingScreen} from '../screens/LoadingScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ProjectNavigator} from './ProjectNavigator';
import {SettingsScreen} from '../screens/SettingsScreen';
import {LoginScreen} from '../screens/LoginScreen';
import CustomTab from '../components/utility/CustomTab';

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
        tabBarShowLabel: false,
      }}>
        {/* esto sería cambiarlo a que lleve a homeScreem o a otro donde se incluya para ver los proyectos */}
      <Tab.Screen
        name="ProjectNavigator"
        component={ProjectNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <CustomTab
              label="Home"
              route="ProjectNavigator"
              focused={focused}
              onPress={() => {}}
            />
          ),
        }}
      />
      {/* aquí iría una navegación que contendría la creación de las cosas */}
      <Tab.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <CustomTab
              label="+"
              route="LoginScreen"
              focused={focused}
              onPress={() => {}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <CustomTab
              label="Ajustes"
              route="SettingsScreen"
              focused={focused}
              onPress={() => {}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
