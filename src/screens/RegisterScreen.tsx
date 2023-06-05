import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import { RegisterTemplate } from '../components/screen_components/Authentication/RegisterTemplate';
import { RegisterComponent } from '../components/screen_components/RegisterComponent';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation, route}: Props) => {

  return (
      <>
        {/* <RegisterComponent navigation={navigation} route={route} /> */}
        <RegisterTemplate navigation={navigation} route={route} />
      </>
  );
};
