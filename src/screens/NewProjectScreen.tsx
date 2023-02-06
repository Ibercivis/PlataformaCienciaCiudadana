import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import { NewProject } from '../components/screen_components/NewProject';
import { StackParams } from '../navigation/ProjectNavigator';


interface Props extends StackScreenProps<StackParams, 'NewProjectScreen'> {}

export const NewProjectScreen = (props: Props) => {
  return (
    <NewProject navigation={props.navigation} route={props.route} />
  );
};

