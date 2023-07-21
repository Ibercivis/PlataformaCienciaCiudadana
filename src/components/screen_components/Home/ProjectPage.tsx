import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Size} from '../../../theme/size';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../../navigation/ProjectNavigator';
// import Carousel from 'react-native-reanimated-carousel';


interface CarouselItem {
  image: number;
}
const data = [
  require('../../../assets/icons/category/Group-1.png'),
  require('../../../assets/icons/category/Group-2.png'),
  require('../../../assets/icons/category/Group-3.png'),
  require('../../../assets/icons/category/Group-4.png'),
  require('../../../assets/icons/category/Group-5.png'),
  require('../../../assets/icons/category/Group-6.png'),
  require('../../../assets/icons/category/Group-7.png'),
  require('../../../assets/icons/category/Group-8.png'),
  require('../../../assets/icons/category/Group.png'),
  require('../../../assets/icons/category/Group-1.png'),
  require('../../../assets/icons/category/Group-1.png'),
  // Agrega más imágenes y títulos según necesites
];

interface Props extends StackScreenProps<StackParams, 'ProjectPage'> {}

export const ProjectPage = (props : Props) => {

    //#region USEEFECT
    //meter el funcionamiento para coger un project
    //#endregion

  const renderItem = (
    {item}: {item: CarouselItem},
  ) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{'mismo titulo'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      {/* <Carousel
        data={data}
        renderItem={data => {
          return renderItem(data);
        }}
        width={Size.window.width}
        height={Size.window.height/2}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: Size.window.width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
