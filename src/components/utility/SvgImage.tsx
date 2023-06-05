import React from 'react';
import {View} from 'react-native';
import {Svg} from 'react-native-svg';
import {SvgXml} from 'react-native-svg';


const SvgImage = () => {
  return (
    <View>
      <SvgXml
        width={200}
        height={200}
        xml={'../../assets/backgrounds/Portada.svg'}></SvgXml>
    </View>
  );
};
export default SvgImage;
