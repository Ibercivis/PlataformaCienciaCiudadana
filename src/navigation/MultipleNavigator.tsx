import {createStackNavigator} from '@react-navigation/stack';

import { BottomTabNavigation } from './BottomTabNavigation';
import { CreateProject } from '../components/screen_components/Project/CreateProject';

export type StackParams = {
    BottomTabNavigation: undefined;
    CreateProject:{
        id?: string;
    };
    CreateOrganization:{
        id?: string;
    };

  };
const Stack = createStackNavigator<StackParams>();

export function MultipleNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle:{
          // backgroundColor: 'transparent',
          zIndex: -999
        }
      }}>
      <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      <Stack.Screen name="CreateProject" component={CreateProject} />
      {/* <Stack.Screen name="CreateProject" component={CreateProject} /> */}
    </Stack.Navigator>
  );
}
