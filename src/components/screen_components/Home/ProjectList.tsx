import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {Size} from '../../../theme/size';
import {Colors} from '../../../theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import translate from '../../../theme/es.json';
import {HasTag, Projects} from '../../../interfaces/appInterfaces';
import SplashScreen from 'react-native-splash-screen';
import {Card} from '../../utility/Card';
import {InputText} from '../../utility/InputText';
import {FontFamily, FontSize} from '../../../theme/fonts';
import {IconBootstrap} from '../../utility/IconBootstrap';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Checkbox} from 'react-native-paper';
import citmapApi from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';

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
              <Card key={index} type="projectFound" categoryImage={index} />
            );
          }
        })}
      </ScrollView>
    </View>
  );
};
