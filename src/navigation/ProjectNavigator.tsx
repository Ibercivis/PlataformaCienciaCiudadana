import {createStackNavigator} from '@react-navigation/stack';
import {Marcador} from '../components/Marcador';
import {MarcadorExample} from '../components/MarcadorExample';
import {Mark} from '../interfaces/appInterfaces';
import {HomeScreen} from '../screens/HomeScreen';
import {NewProjectScreen} from '../screens/NewProjectScreen';

export type StackParams = {
  HomeScreen: undefined;
  NewProjectScreen: {
    marks?: Mark[];
  };
  Marcador: {
    projectName: string;
    description: string;
    photo?: string;
    marks?: Mark[];
    onBack?: boolean;
  };
  MarcadorExample: {
    projectName: string;
    description: string;
    photo?: string;
    marks: Mark[];
  };
};

const Stack = createStackNavigator<StackParams>();

export function ProjectNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NewProjectScreen" component={NewProjectScreen} />
      <Stack.Screen name="Marcador" component={Marcador} />
      <Stack.Screen name="MarcadorExample" component={MarcadorExample} />
    </Stack.Navigator>
  );
}
