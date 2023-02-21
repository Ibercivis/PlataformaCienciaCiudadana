import {createStackNavigator} from '@react-navigation/stack';
import {Marcador} from '../components/screen_components/Marcador';
import {MarcadorExample} from '../components/screen_components/MarcadorExample';
import { Mark, HasTag, Topic } from '../interfaces/appInterfaces';
import {HomeScreen} from '../screens/HomeScreen';
import {NewProjectScreen} from '../screens/NewProjectScreen';

export type StackParams = {
  HomeScreen: {
    dashboard?: boolean;
  };
  NewProjectScreen: {
    marks?: Mark[];
  };
  Marcador: {
    projectName: string;
    description: string;
    photo?: string;
    marks?: Mark[];
    hastag: number[],
    topic: number[],
    onBack?: boolean;
  };
  MarcadorExample: {
    projectName: string;
    description: string;
    photo?: string;
    marks: Mark[];
    hastag: number[],
    topic: number[],
  };
};

const Stack = createStackNavigator<StackParams>();

export function ProjectNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} initialParams={{dashboard: true}} />
      <Stack.Screen name="NewProjectScreen" component={NewProjectScreen} />
      <Stack.Screen name="Marcador" component={Marcador} />
      <Stack.Screen name="MarcadorExample" component={MarcadorExample} />
    </Stack.Navigator>
  );
}
