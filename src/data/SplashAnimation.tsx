import React from 'react';
import LottieView from 'lottie-react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {View} from 'react-native';

interface Props extends StackScreenProps<any, any> {}

export const SplashAnimation = ({navigation}: Props) => {
  return (
      <LottieView
        source={require('../assets/geonity.json')}
        style={{width: '100%', height: '100%', backgroundColor:'black'}}
        resizeMode='cover'
        autoPlay
        loop={false}
        speed={0.9}
        onAnimationFinish={() => {
          console.log('animation finished');
          // navigation.replace('Navigator');
        }}
        onAnimationFailure={(error)=>{
          console.log(JSON.stringify(error, null, 2))
        }}
      />
  );
};
