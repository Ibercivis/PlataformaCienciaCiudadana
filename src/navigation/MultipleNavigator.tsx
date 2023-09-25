import {createStackNavigator} from '@react-navigation/stack';

import {BottomTabNavigation} from './BottomTabNavigation';
import {CreateProject} from '../components/screen_components/Project/CreateProject';
import {NavigationContainer} from '@react-navigation/native';
import { ModalScreen } from '../screens/ModalScreen';
import { CreateOrganization } from '../components/screen_components/Organization/CreateOrganization';
import { ParticipateMap } from '../components/screen_components/Project/ParticipateMap';

export type StackParams = {
  BottomTabNavigation: undefined;
  ModalScreen: undefined;
  CreateProject: {
    id?: number;
  };
  CreateOrganization: {
    id?: number;
  };
  ParticipateMap:{
    id: number;
  }
};
const Stack = createStackNavigator<StackParams>();

export function MultipleNavigator() {
  return (
    // <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            // backgroundColor: 'transparent',
            zIndex: -999,
          },
        }}>
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
        />
        <Stack.Screen name="CreateProject" component={CreateProject} />
        <Stack.Screen name="CreateOrganization" component={CreateOrganization} />
        <Stack.Screen name="ParticipateMap" component={ParticipateMap} /> 
      </Stack.Navigator>
    // </NavigationContainer>
  );
}
