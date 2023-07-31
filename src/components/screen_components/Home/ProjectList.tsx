import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, View} from 'react-native';

import {Card} from '../../utility/Card';

import citmapApi from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {HeaderComponent} from '../../HeaderComponent';
import {useNavigation} from '@react-navigation/native';
import { StackParams } from '../../../navigation/ProjectNavigator';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<StackParams, 'ProjectList'> {}

export const ProjectList = (props: Props) => {
  const [projectList, setProjectList] = useState<Project[]>([]); // partir la lista en 2

  useEffect(() => {
    projectListApi();
  }, []);
  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Project[]>('/project/', {
        headers: {
          Authorization: token,
        },
      });
      setProjectList(resp.data);
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
          return (
            <Card
              key={index}
              type="projectFound"
              categoryImage={index}
              title={item.name}
              description={item.description}
              onPress={() => props.navigation.navigate('ProjectPage', {id: item.id})}
            />
          );
        }}
      />
    </View>
  );
};
