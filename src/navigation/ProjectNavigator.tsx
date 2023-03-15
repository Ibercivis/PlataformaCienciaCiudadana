import {createStackNavigator} from '@react-navigation/stack';
import {Marcador} from '../components/screen_components/Marcador';
import {MarcadorExample} from '../components/screen_components/MarcadorExample';
import { Mark, HasTag, Topic } from '../interfaces/appInterfaces';
import {HomeScreen} from '../screens/HomeScreen';
import {NewProjectScreen} from '../screens/NewProjectScreen';
import { OrganisationScreen } from '../screens/OrganisationScreen';

export type StackParams = {
  HomeScreen: {
    dashboard?: boolean;
  };
  NewProjectScreen: {
    projectName?: string;
    description?: string;
    photo?: string;
    marks?: Mark[];
    hastag?: number[],
    topic?: number[],
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
  OrganisationScreen: {
    name: string;
    url: string;
    description: string;
    type: string;
    publicContact: string;
    emailContact: string;
    organisationLogo: string;
    creditLogo: string;
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
      <Stack.Screen name="OrganisationScreen" component={OrganisationScreen} />
    </Stack.Navigator>
  );
}
