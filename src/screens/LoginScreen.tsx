import {StackScreenProps} from '@react-navigation/stack';
import {LoginComponent} from '../components/screen_components/LoginComponent';
import { LoginTemplate } from '../components/screen_components/Authentication/LoginTemplate';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation, route}: Props) => {
  return (
    <>
      {/* <LoginComponent navigation={navigation} route={route} /> */}
      <LoginTemplate navigation={navigation} route={route} />
    </>
  );
};
