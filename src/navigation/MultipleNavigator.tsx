import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {BottomTabNavigation} from './BottomTabNavigation';
import {CreateProject} from '../components/screen_components/Project/CreateProject';
import {NavigationContainer} from '@react-navigation/native';
import {ModalScreen} from '../screens/ModalScreen';
import {CreateOrganization} from '../components/screen_components/Organization/CreateOrganization';
import {ParticipateMap} from '../components/screen_components/Project/ParticipateMap';
import {LoadingScreen} from '../screens/LoadingScreen';
import {PermissionsContext} from '../context/PermissionsContext';
import {PermissionsScreen} from '../screens/PermissionsScreen';

export type StackParams = {
  BottomTabNavigation: undefined;
  ModalScreen: undefined;
  CreateProject: {
    id?: number;
  };
  CreateOrganization: {
    id?: number;
  };
  // ParticipateMap: {
  //     id: number;
  //   };
  
};
const Stack = createStackNavigator<StackParams>();

export function MultipleNavigator() {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          zIndex: -999,
        },
      }}>
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
      />
      <Stack.Screen name="CreateProject" component={CreateProject} />
      <Stack.Screen name="CreateOrganization" component={CreateOrganization} />
      {/* <Stack.Screen name="ParticipateMap" component={ParticipateMap} /> */}

      
    </Stack.Navigator>
  );
}
