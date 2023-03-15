import React, { useState } from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '../navigation/ProjectNavigator';
import { NewOrganisation } from '../components/screen_components/NewOrganisation';

interface Props extends StackScreenProps<StackParams, 'OrganisationScreen'> {}

export const OrganisationScreen = (props: Props) => {
  return (
    <NewOrganisation navigation={props.navigation} route={props.route} />
  );
};