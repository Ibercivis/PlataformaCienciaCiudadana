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
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParams} from '../../../navigation/HomeNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Chevron from '../../../assets/icons/general/chevron-left-1.svg';
import {FontFamily, FontSize, FontWeight} from '../../../theme/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {Organization, Project, User} from '../../../interfaces/interfaces';
import {Card} from '../../utility/Card';
import {SaveProyectModal} from '../../utility/Modals';
import {Colors} from '../../../theme/colors';
import NotContribution from '../../../assets/icons/profile/No hay contribuciones.svg';
import PencilSquare from '../../../assets/icons/general/pencil-square-1.svg';
import { CommonActions, useFocusEffect } from '@react-navigation/native';

interface Props extends StackScreenProps<StackParams, 'OrganizationPage'> {}

export const OrganizationPage = (props: Props) => {
  //#region CONST
  const [organization, setOrganization] = useState<Organization>();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  /**
   * Elementos del modal
   */
  const [saveModal, setSaveModal] = useState(false);
  const showModalSave = () => setSaveModal(true);
  const hideModalSave = () => setSaveModal(false);
  //#endregion

  //#region USE EFFECTS
  useEffect(() => {
    if (props.route.params.isNew) {
      showModalSave();
    }
    getOrganizationApi();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Aquí puedes cargar de nuevo los datos, por ejemplo, realizando una llamada a la API
      // Puedes usar la variable "route.params.id" para obtener el ID necesario
      getOrganizationApi();
      console.log('llama en el useFocusEffect')
      // Código para cargar los datos de la organización

    }, [props.route.params.id])
  );

  //#endregion

  //#region METHODS

  /**
   * Metodo para volver atrás
   */
  const onBack = () => {
    props.navigation.goBack();
  };

   /**
   * metodo para ir a la edición del proyecto
   */
   const editProyect = () => {
    if (organization) {
      props.navigation.dispatch(
        CommonActions.navigate({
          name: 'CreateOrganization',
          params: {id: organization.id},
        }),
      );
    }
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

      const userInfo = await citmapApi.get<User>(
        '/users/authentication/user/',
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (userInfo.data.pk === resp.data.creator) {
        setCanEdit(true);
      }

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
      const filteredProjects = resp.data.filter(item =>
        item.organizations_write.find(x => x === props.route.params.id),
      );
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
          <View
            style={{
              ...style.curvedView,
              backgroundColor: organization?.cover ? 'transparent' : 'grey',
            }}>
            <Image
              source={{
                uri: organization?.cover,
              }}
              style={{
                width: '100%',
                height: '100%',
                // resizeMode: 'cover',
              }}
            />
          </View>
          {/* boton back */}
          <TouchableOpacity style={style.buttonBack} onPress={onBack}>
            <Chevron
              width={RFPercentage(3.5)}
              height={RFPercentage(3.5)}
              fill={'#000000'}
            />
          </TouchableOpacity>

          {/* boton edit */}
          {canEdit && (
            <TouchableOpacity
              style={style.buttonEdit}
              onPress={() => editProyect()}>
              <PencilSquare
                width={RFPercentage(2.5)}
                height={RFPercentage(2.5)}
                fill={'#000000'}
              />
            </TouchableOpacity>
          )}

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
          <View style={{...style.organizationAvatar}}>
            <ImageBackground
              borderRadius={100}
              // source={require(urii)}
              source={{
                uri: organization?.logo,
              }}
              style={{
                height: RFPercentage(17),
                width: RFPercentage(17),
                zIndex: 1,
                borderWidth: organization?.logo ? 0 : 1,
                borderRadius: organization?.logo ? 0 : 100,
                backgroundColor: organization?.logo
                  ? 'transparent'
                  : Colors.contentPrimaryDark,
              }}
            />
            {/* {!organization?.logo === null ? (
              <ImageBackground
                borderRadius={100}
                // source={require(urii)}
                source={{
                  uri: organization?.logo,
                }}
                style={{
                  height: RFPercentage(17),
                  width: RFPercentage(17),
                  zIndex: 1,
                }}
              />
            ) : (
              <ImageBackground
                borderRadius={100}
                // source={require(urii)}
                source={require('../../../assets/backgrounds/login-background.jpg')}
                style={{
                  height: RFPercentage(17),
                  width: RFPercentage(17),
                  zIndex: 1,
                }}
              />
            )} */}
          </View>
        </View>

        {/* contenedor proyectos */}
        <View style={style.projectView}>
          <Text
            style={{
              fontSize: FontSize.fontSizeText20,
              fontWeight: 'bold',
              color: 'black',
              marginHorizontal: RFPercentage(3),
            }}>
            Proyectos
          </Text>
          {projectList.length <= 0 ? (
            <>
              <View style={{alignItems: 'center', marginTop: '7%'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: FontSize.fontSizeText20,
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontWeight: '700',
                  }}>
                  No hay proyectos asociados...
                </Text>
                <Text
                  style={{
                    width: '65%',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: FontSize.fontSizeText13,
                    fontFamily: FontFamily.NotoSansDisplayMedium,
                    fontWeight: '600',
                    marginTop: '3%',
                  }}>
                  Conforme la organización se asocie con los diferentes
                  proyectos, se irán mostrando aquí.
                </Text>
                <View style={{alignItems: 'center'}}>
                  <NotContribution
                    width={RFPercentage(28)}
                    height={RFPercentage(28)}
                  />
                </View>
              </View>
            </>
          ) : (
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
                      props.navigation.navigate('ProjectPage', {id: item.id!})
                    }
                  />
                );
              })}
            </ScrollView>
          )}

          <SaveProyectModal
            visible={saveModal}
            hideModal={hideModalSave}
            onPress={hideModalSave}
            size={RFPercentage(6)}
            color={Colors.semanticSuccessLight}
            label="¡Organización creada!"
            subLabel="No olvides compartir tu proyecto para obtener una mayor
          participación"
          />
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
    // backgroundColor: 'red',
    height: RFPercentage(101),
    width: RFPercentage(107),
    alignSelf: 'center',
    borderRadius: 365,
    top: RFPercentage(-82),
    overflow: 'hidden',
    alignItems: 'center', // Centra horizontalmente la imagen
    justifyContent: 'center',
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
    top: RFPercentage(4),
    left: RFPercentage(2),
    zIndex: 999,
  },
  title: {
    position: 'absolute',
    top: RFPercentage(5),
    left: RFPercentage(5),
    right: RFPercentage(5),
    zIndex: 3,
    fontSize: FontSize.fontSizeText20,
    color: 'white',
    FontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  buttonEdit: {
    position: 'absolute',
    top: RFPercentage(4),
    right: RFPercentage(2),
    zIndex: 999,
  },
});
