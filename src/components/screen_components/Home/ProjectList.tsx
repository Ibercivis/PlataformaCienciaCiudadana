import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import People from '../../../assets/icons/general/people.svg';
import Heart from '../../../assets/icons/general/heart.svg';
import HeartFill from '../../../assets/icons/general/heart-fill.svg';

import citmapApi, { imageUrl } from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project, ShowProject} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {HeaderComponent} from '../../HeaderComponent';
import {StackParams} from '../../../navigation/HomeNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {HasTag} from '../../../interfaces/appInterfaces';
import {FontSize} from '../../../theme/fonts';

interface Props extends StackScreenProps<StackParams, 'ProjectList'> {}

export const ProjectList = (props: Props) => {
  const [projectList, setProjectList] = useState<ShowProject[]>([]); // partir la lista en 2

  const [hastags, setHastags] = useState<HasTag[]>([]);

  useEffect(() => {
    getHastagApi();
  }, []);

  useEffect(() => {
    projectListApi();
  }, [hastags]);

  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<ShowProject[]>('/project/', {
        headers: {
          Authorization: token,
        },
      });
      setProjectList(resp.data);
    } catch {}
  };

  const getHastagApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<HasTag[]>('/project/hastag/', {
        headers: {
          Authorization: token,
        },
      });
      setHastags(resp.data);
    } catch {}
  };

  return (
    <View style={{flex: 1, padding: RFPercentage(2)}}>
      <HeaderComponent
        title={'Listado'}
        onPressLeft={() => props.navigation.goBack()}
        onPressRight={() => console.log('jaja')}
        rightIcon={false}
      />
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={projectList}
        renderItem={({item, index}) => {
          // if(item.cover && item.cover[0]) console.log(imageUrl +item.cover[0].image)
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              style={style.projectFound}
              onPress={() =>
                props.navigation.navigate('ProjectPage', {id: item.id})
              }>
              <View
                style={{
                  paddingHorizontal: RFPercentage(3),
                  // width:'100%',
                  // backgroundColor:'green'
                }}>
                <View
                  style={{
                    // marginHorizontal: RFPercentage(2),
                    width: '100%',
                    marginTop: RFPercentage(2),
                    marginBottom: 6,
                  }}>
                  <Text
                    style={{
                      // backgroundColor: 'blue',
                      color: 'black',
                      fontWeight: 'bold',
                      marginBottom: '1%',
                      alignSelf: 'flex-start',
                    }}>
                    {item.name}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {item.hasTag.map((x, index) => {
                      const matchingHastag = hastags.find(
                        hastag => hastag.id === x,
                      );
                      if (matchingHastag) {
                        return (
                          <Text
                            key={index}
                            style={{
                              // backgroundColor: 'white',
                              alignSelf: 'flex-start',
                              color: 'blue',
                              marginBottom: '2%',
                            }}>
                            #{matchingHastag.hasTag}
                            {'  '}
                          </Text>
                        );
                      }
                    })}
                  </View>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginBottom: '2%',
                    }}>
                    {item.description}
                  </Text>
                </View>
                <ImageBackground
                  source={item.cover && item.cover[0] ? {uri: imageUrl + item.cover[0].image}: require('../../../assets/backgrounds/nuevoproyecto.jpg')}
                  style={{
                    ...style.imageBackground,
                    width: '100%',
                    height: RFPercentage(23),
                    backgroundColor:item.cover ? 'transparent' : 'grey'
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      bottom: 2,
                      left: 0,
                      right: 0,
                      justifyContent: 'space-between',
                      // marginHorizontal: RFPercentage(1),
                      width: '100%',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderRadius: 15,
                        margin: '2%',
                        paddingHorizontal: '3%',
                        paddingVertical: '2%',
                      }}>
                      <People width={16} height={16} color={'#000000'} />
                      <Text
                        style={{
                          fontSize: FontSize.fontSizeText13,
                          marginHorizontal: RFPercentage(1),
                        }}>
                        1500
                      </Text>
                      {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                      {true ? (
                        <HeartFill width={16} height={16} color={'#ff0000'} />
                      ) : (
                        <Heart width={16} height={16} color={'#000000'} />
                      )}
                      <Text
                        style={{
                          fontSize: FontSize.fontSizeText13,
                          marginHorizontal: RFPercentage(1),
                        }}>
                        120
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderRadius: 15,
                        margin: '2%',
                        paddingHorizontal: '3%',
                        paddingVertical: '2%',
                      }}>
                      <Text
                        style={{
                          fontSize: FontSize.fontSizeText13,
                          marginHorizontal: RFPercentage(1),
                        }}>
                        120
                      </Text>
                      <Heart width={16} height={16} color={'#000000'} />
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  projectFound: {
    width: RFPercentage(50),
    marginVertical: RFPercentage(3),
    borderRadius: 10,
  },
  imageBackground: {
    height: '100%',
    borderRadius: 10,
  },
});
