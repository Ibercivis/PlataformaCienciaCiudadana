import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, View} from 'react-native';

import {Card} from '../../utility/Card';

import citmapApi from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ProjectList = () => {
  const [newProjectList, setNewProjectList] = useState<Project[]>([]); // partir la lista en 2

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
      console.log(JSON.stringify(resp.data));
      setNewProjectList(resp.data);
    } catch {}
  };

  return (
    <View style={{flex: 1,  padding: RFPercentage(2)}}>
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={newProjectList}
        renderItem={({item, index}) => {
          return <Card key={index} type="projectFound" categoryImage={index} />;
        }}
      />
    </View>
  );
};
