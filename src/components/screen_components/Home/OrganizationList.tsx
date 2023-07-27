import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
} from 'react-native';

import {Card} from '../../utility/Card';

import citmapApi from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Organization} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';

export const OrganizationList = () => {
  const [newProjectList, setNewProjectList] = useState<Organization[]>([]); // partir la lista en 2

  useEffect(() => {
    projectListApi();
  }, []);
  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Organization[]>('/organization/', {
        headers: {
          Authorization: token,
        },
      });
      console.log(JSON.stringify(resp.data));
      setNewProjectList(resp.data);
    } catch {}
  };

  return (
    <View>
      <ScrollView
        style={{
          alignSelf: 'center',
          // backgroundColor: 'red',
          width: '90%',
        }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}>
        {newProjectList.map((x, index) => {
          if (newProjectList.length - 1 === index) {
            return (
              <Card key={index} type="organizationFound" categoryImage={index} />
            );
          }
        })}
      </ScrollView>
    </View>
  );
};