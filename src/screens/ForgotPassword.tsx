import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import { ForgotPasswordComponent } from '../components/screen_components/ForgotPasswordComponent';
import { ForgotPasswordTemplate } from '../components/screen_components/Authentication/ForgotPasswordTemplate';


interface Props extends StackScreenProps<any, any> {}

export const ForgotPassword = ({navigation, route}: Props) => {
  
  return (
    <>
      {/* <ForgotPasswordComponent navigation={navigation} route={route} /> */}
      <ForgotPasswordTemplate navigation={navigation} route={route} />
    </>
  );
};
