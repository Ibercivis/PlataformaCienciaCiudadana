import {StackScreenProps} from '@react-navigation/stack';
import React, { useState } from 'react';
import {NewProject} from '../components/screen_components/NewProject';
import {StackParams} from '../navigation/HomeNavigator';

interface Props extends StackScreenProps<StackParams, 'NewProjectScreen'> {}

export const NewProjectScreen = (props: Props) => {
  const [active, setActive] = useState(0);
  const content = [
    <NewProject navigation={props.navigation} route={props.route} />,
  ];
  return (
    // <View style={{marginVertical: 80, marginHorizontal: 20}}>
    //   <Stepper
    //     active={active}
    //     content={content}
    //     onBack={() => setActive(p => p - 1)}
    //     onFinish={() => alert('Finish')}
    //     onNext={() => setActive(p => p + 1)}
    //   />
    // </View>
    <NewProject navigation={props.navigation} route={props.route} />
  );
};