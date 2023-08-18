import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParams} from '../../../navigation/ProjectNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Chevron from '../../../assets/icons/general/chevron-left-1.svg';
import {FontSize, FontWeight} from '../../../theme/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {Organization, Project} from '../../../interfaces/interfaces';
import {Card} from '../../utility/Card';

interface Props extends StackScreenProps<StackParams, 'OrganizationPage'> {}

export const OrganizationPage = (props: Props) => {
  //#region CONST
  const [organization, setOrganization] = useState<Organization>();
  const [projectList, setProjectList] = useState<Project[]>([]);
  //#endregion

  //#region USE EFFECTS
  useEffect(() => {
    getOrganizationApi();
  }, []);

  //#endregion

  //#region METHODS

  /**
   * Metodo para volver atrás
   */
  const onBack = () => {
    props.navigation.goBack();
  };

  //#endregion

  //#region API CALLS

  const getOrganizationApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Organization>(
        `/organization/${props.route.params.id}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setOrganization(resp.data);
      projectListApi();
    } catch {}
  };

  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Project[]>('/project/', {
        headers: {
          Authorization: token,
        },
      });

      // const filteredProjects = resp.data.filter(project => {
      //   const organizationIds = project.organizations.map(org => org.id);
      //   console.log(JSON.stringify(organizationIds))
      //   console.log(props.route.params.id)
      //   return organizationIds.includes(props.route.params.id);
      // });

      // const filteredProjects = resp.data
      //   .filter(item =>
      //     item.organizations.some(
      //       subItem => subItem.id === props.route.params.id,
      //     ),
      //   )
      //   .map(x => ({
      //     ...x,
      //     organizations: x.organizations.filter(
      //       y => y.id === props.route.params.id,
      //     ),
      //   }));

      console.log(props.route.params.id)
      const filteredProjects = resp.data.filter(item => item.organizations.find(x => x === props.route.params.id))
      // const filteredProjects = resp.data.filter(project => {
      //   const matchedOrganizations = project.organizations.filter(organization => organization.id === props.route.params.id);
      //   console.log(`Organization ID: ${project.organizations}, Matched Organizations: `, matchedOrganizations);
      //   return matchedOrganizations.length > 0;
      // });
      // console.log(JSON.stringify(resp.data, null, 2));
      console.log(JSON.stringify(filteredProjects, null, 2));
      setProjectList(filteredProjects);
    } catch {}
  };
  //#endregion

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <StatusBar hidden />
        {/* contenedor datos organizacion */}
        <View style={style.organizationContainer}>
          {/* vista que da efecto de curva */}
          <View style={style.curvedView}></View>
          {/* boton back */}
          <TouchableOpacity style={style.buttonBack} onPress={onBack}>
            <Chevron
              width={RFPercentage(2.5)}
              height={RFPercentage(2.5)}
              color={'#000000'}
            />
          </TouchableOpacity>
          {/* titulo de la organizacion */}
          <Text style={style.title}>{organization?.principalName}</Text>
          {/* contenedor de datos de organizacion */}
          <View style={style.organizationInfoContainer}>
            <View
              style={{
                height: '50%',
                width: '100%',
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '50%',
                  height: '100%',
                  // backgroundColor: 'green',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  {projectList.length}
                </Text>
                <Text
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  Proyectos
                </Text>
              </View>
              <View
                style={{
                  width: '50%',
                  height: '100%',
                  // backgroundColor: 'grey',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  {organization?.members.length}
                </Text>
                <Text
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}>
                  Integrantes
                </Text>
              </View>
            </View>
            <View
              style={{
                height: '50%',
                width: '100%',
                // backgroundColor: 'purple',
                alignItems: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                {organization?.description}
              </Text>
            </View>
          </View>
          {/* vista que contiene  el avatar */}
          <View style={style.organizationAvatar}>
            <ImageBackground
              borderRadius={100}
              // source={require(urii)}
              source={require('../../../assets/backgrounds/login-background.jpg')}
              style={{
                height: RFPercentage(17),
                width: RFPercentage(17),
                zIndex: 1,
              }}></ImageBackground>
          </View>
        </View>

        {/* contenedor proyectos */}
        <View style={style.projectView}>
          <Text style={{fontSize: FontSize.fontSizeText20, fontWeight: 'bold', color: 'black', marginHorizontal:RFPercentage(3)}} >Proyectos</Text>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{alignItems: 'center'}}>
            {projectList.map((item, index) => {
              return (
                <Card
                  key={index}
                  type="projectOrganization"
                  categoryImage={index}
                  title={item.name}
                  description={item.description}
                  onPress={() =>
                    props.navigation.navigate('ProjectPage', {id: item.id})
                  }
                />
              );
            })}
          </ScrollView>
          {/* <FlatList
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
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  curvedView: {
    backgroundColor: 'red',
    height: RFPercentage(100),
    width: RFPercentage(107),
    alignSelf: 'center',
    borderRadius: 500,
    top: RFPercentage(-82),
    // borderBottomRightRadius: 500,
    // borderBottomLeftRadius: 500
  },
  organizationAvatar: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: RFPercentage(5),
    left: RFPercentage(5),
    top: RFPercentage(15),
    backgroundColor: 'transparent',
  },
  organizationContainer: {
    backgroundColor: 'transparent',
    height: RFPercentage(65),
    // borderBottomWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  organizationInfoContainer: {
    // backgroundColor: 'yellow',
    top: RFPercentage(-67),
    alignItems: 'center',
    alignContent: 'center',
    width: RFPercentage(45),
    height: RFPercentage(25),
  },
  projectView: {backgroundColor: 'transparent'},
  buttonBack: {
    position: 'absolute',
    top: RFPercentage(5),
    left: RFPercentage(2),
  },
  title: {
    position: 'absolute',
    top: RFPercentage(5),
    left: RFPercentage(5),
    right: RFPercentage(5),
    zIndex: 999,
    fontSize: FontSize.fontSizeText18,
    color: 'white',
    FontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
});
