import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Organization, Project, User} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {HeaderComponent} from '../../HeaderComponent';
import {useForm} from '../../../hooks/useForm';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Stars from 'react-native-bootstrap-icons/icons/stars';
import People from '../../../assets/icons/general/people.svg';
import Heart from '../../../assets/icons/general/heart.svg';
import HeartFill from '../../../assets/icons/general/heart-fill.svg';
import PencilSquare from '../../../assets/icons/general/pencil-square-1.svg';
import {HasTag} from '../../../interfaces/appInterfaces';
import {LoadingScreen} from '../../../screens/LoadingScreen';
import {FontFamily, FontSize} from '../../../theme/fonts';
import {Switch} from 'react-native-paper';
import {InputText} from '../../utility/InputText';
import {TextInput} from 'react-native-paper';
import {globalStyles} from '../../../theme/theme';
import {IconBootstrap} from '../../utility/IconBootstrap';
import {Size} from '../../../theme/size';
import {Colors} from '../../../theme/colors';
import {GenderSelectorModal, VisibilityOrganizationModal} from '../../utility/Modals';

interface Props extends StackScreenProps<any, any> {}

export const Profile = ({navigation}: Props) => {
  //#region Variables
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'one', title: 'Contribution'},
    {key: 'two', title: 'Created'},
    {key: 'three', title: 'Liked'},
  ]);

  const [isAllCharged, setIsAllCharged] = useState(false);
  const [userEdit, setUserEdit] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  const [projectList, setProjectList] = useState<Project[]>([]);
  const [createdProjects, setCreatedProject] = useState<Project[]>([]);
  const [contributionProject, setContributionProject] = useState<Project[]>([]);
  const [organization, setOrganization] = useState<Organization>();
  const [hastags, setHastags] = useState<HasTag[]>([]);

  const [user, setUser] = useState<User>({
    pk: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const {form, onChange, setObject} = useForm<User>(user);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const [modalVisibleGenre, setModalVisibleGenre] = useState(false);
  const [modalVisibleOrganization, setModalVisibleOrganization] = useState(false);
  const [modalVisibleSave, setModalVisibleSave] = useState(false);
  const [genre, setGenre] = useState('');
  const [visibilityOrganization, setVisibilityOrganization] = useState('');
  const [saveAll, setSaveAll] = useState(false);

  //#endregion

  //#region tabs
  const Contribution = () => (
    <View style={{flex: 1, backgroundColor: 'transparent'}} />
  );

  const Created = () => (
    <FlatList
      style={{flex: 1}}
      contentContainerStyle={{alignItems: 'center'}}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={createdProjects}
      renderItem={({item, index}) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.5}
            style={styles.projectFound}
            onPress={() => navigation.navigate('ProjectPage', {id: item.id})}>
            <View
              style={{
                paddingHorizontal: RFPercentage(3),
              }}>
              <View
                style={{
                  width: '100%',
                  marginTop: RFPercentage(2),
                  marginBottom: 6,
                }}>
                <Text
                  style={{
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
                source={require('../../../assets/backgrounds/login-background.jpg')}
                style={{
                  ...styles.imageBackground,
                  width: '100%',
                  height: RFPercentage(23),
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
  );

  const Liked = () => (
    <View style={{flex: 1, backgroundColor: 'transparent'}} />
  );

  const renderScene = SceneMap({
    one: Contribution,
    two: Created,
    three: Liked,
  });

  const _renderTabBar = (props: {
    navigationState: {routes: any[]};
    position: {interpolate: (arg0: {inputRange: any; outputRange: any}) => any};
  }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0.5,
            ),
          });
          const fontWeight = i ? 'bold' : '500';

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <Animated.Text style={{opacity, fontWeight, color: 'black'}}>
                {route.title}
              </Animated.Text>
              <View
                style={[
                  styles.tabBarIndicator,
                  {backgroundColor: i === index ? '#304be2' : 'transparent'},
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  //#endregion

  //#region useEffects
  useEffect(() => {
    setUserEdit(false);
    userDataApi();
    // projectListApi(); //este habrá que moverlo a dentro del userDataApi para que cargue en el futuro los proyectos que el tiene favs y demás
  }, []);

  useEffect(() => {
    setObject(user);
  }, [user]);

  useEffect(() => {
    getHastagApi();
  }, []);

  useEffect(() => {
    projectListApi();
  }, [hastags]);

  useEffect(() => {
    createdProjectFilter();
  }, [projectList]);

  useEffect(() => {
    setIsAllCharged(true);
  }, [createdProjects]);

  //#endregion

  //#region api
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

  const userDataApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<User>('/users/authentication/user/', {
        headers: {
          Authorization: token,
        },
      });
      setUser(resp.data);
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

  const getOrganizationApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Organization>('/project/hastag/', {
        headers: {
          Authorization: token,
        },
      });
    } catch {}
  };
  //#endregion

  //#region Methods

  const createdProjectFilter = () => {
    const filtered = projectList.filter(x => x.creator === user.pk);
    setCreatedProject(filtered);
  };

  const writeForm = () => {
    setObject(user);
  };

  const rightRenderIconHeader = () => {
    if (userEdit) {
      return (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: RFPercentage(0.5),
          }}>
          <TouchableOpacity onPress={() => setUserEdit(!userEdit)}>
            <Text style={{color: 'blue'}}>Guardar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: RFPercentage(0.3),
          }}>
          <TouchableOpacity
            style={styles.buttonEdit}
            onPress={() => setUserEdit(!userEdit)}>
            <PencilSquare
              width={RFPercentage(2.5)}
              height={RFPercentage(2.5)}
              fill={'#000000'}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const showModalGenre = () => setModalVisibleGenre(true);
  const showModalOrganization = () => setModalVisibleOrganization(true);
  const showModalSave = () => setModalVisibleSave(true);
  const hideModalGenre = () => setModalVisibleGenre(false);
  const hideModalOrganization = () => setModalVisibleOrganization(false);
  const hideModalSave = () => setModalVisibleSave(false);

  const setSelectedGenreMethod = (gender: string) => {
    setGenre(gender); // Guarda el género seleccionado en el estado
    // hideModalGenre(); // Cierra el modal
  };

  const setSelectedOrganizationVisibilityMethod = (state: string) => {
    setVisibilityOrganization(state); // Guarda el género seleccionado en el estado
    // hideModalOrganization(); // Cierra el modal
  };

  const setSelectedSaveMethod = (state: string) => {
    setVisibilityOrganization(state); 
  };

  //#endregion

  if (!isAllCharged) {
    return <LoadingScreen />;
  }

  return (
    <>
      <HeaderComponent
        title={!userEdit ? form.email : 'Editar perfil'}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => setUserEdit(!userEdit)}
        rightIcon={canEdit ? true : false}
        renderRight={() => rightRenderIconHeader()}
      />
      {userEdit ? (
        <>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView
              style={styles.scrollParent}
              nestedScrollEnabled={true}
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled">
              {/* imagen de perfil */}
              <View
                style={{
                  width: '100%',
                  height: RFPercentage(15), // Aquí establece la altura al 25% del ancho de la pantalla
                  justifyContent: 'center', // Centra verticalmente
                  alignItems: 'center', // Centra horizontalmente
                  marginVertical: RFPercentage(5),
                  // backgroundColor: 'red',
                }}>
                <View
                  style={{
                    width: '30%',
                    height: '100%', // Mantén la altura igual a la del contenedor
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'green',
                  }}>
                  <ImageBackground
                    borderRadius={10}
                    // source={require(urii)}
                    source={require('../../../assets/backgrounds/login-background.jpg')}
                    style={{
                      width: '100%', // Aquí también establece el ancho al 100% para que sea un cuadrado
                      height: '100%',
                      borderRadius: 10,
                      // backgroundColor: 'yellow',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}></ImageBackground>
                </View>
              </View>

              {/* formulario */}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                {/* visibilidad */}
                <View
                  style={{
                    width: '80%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Visibilidad del perfil</Text>
                  <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                </View>

                {/* descripción de visibilidad  */}
                <View
                  style={{
                    // backgroundColor: 'yellow',
                    width: '80%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text>
                    Si lo activas tu perfil pasará a estar oculto para los demás
                    usuarios de Geonity, pero podrás seguir creando proyectos y
                    participando en ellos
                  </Text>
                </View>

                {/* nombre de usuario */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Nombre de usuario</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Nombre de usuario'}
                    keyboardType="default"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                </View>

                {/* biografia */}
                <View
                  style={{
                    width: '80%',
                    // height: 200,
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Biografía</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Biografía'}
                    keyboardType="default"
                    multiline={true}
                    maxLength={300}
                    numOfLines={5}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                </View>

                {/* email */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Correo electrónico</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Email'}
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                </View>

                {/* cambiar contraseña */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Cambiar contraseña</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Escriba la contraseña'}
                    inputType={true}
                    multiline={false}
                    numOfLines={1}
                    isSecureText={true}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                </View>

                {/* cambiar nueva contraseña */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>
                    Confirmar nueva contraseña
                  </Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Escriba la contraseña'}
                    inputType={true}
                    multiline={false}
                    numOfLines={1}
                    isSecureText={true}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                </View>

                {/* organizacion */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Organización</Text>

                  <TouchableOpacity>
                    <View
                      style={{
                        ...globalStyles.inputContainer,
                        backgroundColor: organization
                          ? Colors.semanticSuccessLight
                          : Colors.primaryLigth,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: '5%',
                          justifyContent: 'center',
                          top: 1,
                        }}>
                        {organization ? (
                          <IconBootstrap
                            name={'BookMark'}
                            size={RFPercentage(2)}
                            color={'white'}
                          />
                        ) : (
                          <IconBootstrap
                            name={'Info'}
                            size={RFPercentage(2)}
                            color={'white'}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          width: '80%',
                          fontSize: FontSize.fontSizeText13,
                          fontFamily: FontFamily.NotoSansDisplayLight,
                          fontWeight: '300',
                          color: 'white',
                          alignSelf: 'center',
                          textAlignVertical: 'center',
                          backgroundColor: 'transparent',
                          height: Size.window.height * 0.04,
                        }}>
                        ¿Perteneces a una organización?
                      </Text>
                      {organization && (
                        <View
                          style={{
                            marginRight: '7%',
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            top: '1%',
                          }}>
                          <IconBootstrap
                            name={'CheckCircle'}
                            size={20}
                            color={'white'}
                          />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => showModalOrganization()}
                      style={{
                        flexDirection: 'row',
                        marginVertical: RFPercentage(1),
                      }}>
                      <Text
                        style={{
                          color: Colors.contentQuaternaryDark,
                          fontSize: FontSize.fontSizeText10,
                        }}>
                        ¿Quién puede ver esto?
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>

                {/* ubicacion */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Ubicacion</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Di tu ubicación'}
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                  <TouchableOpacity
                    onPress={() => console.log('abrir modal visibilidad')}
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <Text
                      style={{
                        color: Colors.contentQuaternaryDark,
                        fontSize: FontSize.fontSizeText10,
                      }}>
                      ¿Quién puede ver esto?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* fecha nacimiento */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Fecha de nacimiento</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'00 / 00 / 0000'}
                    keyboardType="number-pad"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => onChange(value, 'first_name')}
                  />
                  <TouchableOpacity
                    onPress={() => console.log('abrir modal visibilidad')}
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <Text
                      style={{
                        color: Colors.contentQuaternaryDark,
                        fontSize: FontSize.fontSizeText10,
                      }}>
                      ¿Quién puede ver esto?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* sexo genero */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                    marginBottom: RFPercentage(5),
                  }}>
                  <Text style={{color: 'black'}}>Sexo/Género</Text>
                  <View
                    style={{
                      ...globalStyles.inputContainer,
                      backgroundColor: 'transparent',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: '5%',
                        justifyContent: 'center',
                        top: 1,
                      }}>
                      <IconBootstrap name={'info'} size={20} color={'white'} />
                    </View>
                    <Text
                      style={{
                        width: '80%',
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayLight,
                        fontWeight: '300',
                        color: 'black',
                        alignSelf: 'center',
                        textAlignVertical: 'center',
                        backgroundColor: 'transparent',
                        height: Size.window.height * 0.04,
                      }}>
                      {genre}
                    </Text>
                    <TouchableOpacity
                      onPress={() => showModalGenre()}
                      style={{
                        marginRight: '1%',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: '1%',
                      }}>
                      <IconBootstrap
                        name={'CaretDown'}
                        size={20}
                        color={'black'}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => console.log('abrir modal visibilidad')}
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <Text
                      style={{
                        color: Colors.contentQuaternaryDark,
                        fontSize: FontSize.fontSizeText10,
                      }}>
                      ¿Quién puede ver esto?
                    </Text>
                  </TouchableOpacity>

                  {/* <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={genre}
                    keyboardType="default"
                    fieldButtonFunction={() => showModalGenre()}
                    iconRight='CaretDown'
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => onChange(value, 'first_name')}
                    inputType={false}
                  /> */}
                </View>
              </View>

              {/* modal genero */}
              <GenderSelectorModal
                visible={modalVisibleGenre}
                hideModal={hideModalGenre}
                onPress={hideModalGenre}
                setSelected={setSelectedGenreMethod}
                selected={genre}
              />

              {/* modal visibilidad organizacion */}
              <VisibilityOrganizationModal
                visible={modalVisibleOrganization}
                hideModal={hideModalOrganization}
                onPress={hideModalOrganization}
                setSelected={setSelectedOrganizationVisibilityMethod}
                selected={visibilityOrganization}
                label='¿Quién puede ver tu organizacion?'
              />
            </ScrollView>
          </SafeAreaView>
        </>
      ) : (
        <SafeAreaView
          style={styles.scrollParent}
          // nestedScrollEnabled={true}
          // contentContainerStyle={{flexGrow: 1}}
          // keyboardShouldPersistTaps="handled"
        >
          {/* contenedor profile */}
          <View style={styles.profileContainer}>
            {/* info de arriba */}
            <View
              style={{
                height: RFPercentage(14),
                flexDirection: 'row',
                marginTop: RFPercentage(3),
              }}>
              {/* foto de perfil */}
              <View
                style={{
                  width: '30%',
                  height: '100%',
                  marginRight: RFPercentage(1),
                }}>
                <ImageBackground
                  borderRadius={10}
                  // source={require(urii)}
                  source={require('../../../assets/backgrounds/login-background.jpg')}
                  style={{height: '100%', borderRadius: 10}}></ImageBackground>
              </View>
              {/* datos derecha */}
              <View
                style={{
                  width: '70%',
                  height: '80%',
                  flexDirection: 'column',
                }}>
                {/* contribuciones creados */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'column',
                    marginVertical: RFPercentage(1),
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={styles.viewDataProfile}>
                      <Text style={{fontWeight: 'bold', color: 'black'}}>
                        180
                      </Text>
                    </View>
                    <View style={styles.viewDataProfile}>
                      <Text style={{fontWeight: 'bold', color: 'black'}}>
                        10
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <View style={styles.viewDataProfile}>
                      <Text>contribuciones</Text>
                    </View>
                    <View style={styles.viewDataProfile}>
                      <Text>creados</Text>
                    </View>
                  </View>
                </View>
                {/* organizacion country name */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'column',
                    marginVertical: RFPercentage(1.5),
                  }}>
                  <View
                    style={{
                      width: '100%',
                      marginHorizontal: RFPercentage(3),
                      marginVertical: RFPercentage(1),
                      flexDirection: 'row',
                    }}>
                    <Stars
                      width={RFPercentage(1.8)}
                      height={RFPercentage(1.8)}
                      fill={'#3a53e2'}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        alignSelf: 'center',
                        marginLeft: RFPercentage(0.5),
                        bottom: RFPercentage(0.1),
                      }}>
                      Organization.name
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginHorizontal: RFPercentage(3),
                      flexDirection: 'row',
                    }}>
                    <Stars
                      width={RFPercentage(1.8)}
                      height={RFPercentage(1.8)}
                      fill={'#3a53e2'}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        alignSelf: 'center',
                        marginLeft: RFPercentage(0.5),
                        bottom: RFPercentage(0.1),
                      }}>
                      Country.city
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* info de abajo */}
            <View
              style={{
                //   height: '60%',
                // flex: 1,
                marginHorizontal: RFPercentage(3),
                marginVertical: RFPercentage(2),
              }}>
              <Text
                style={{
                  fontWeight: 'normal',
                  color: 'black',
                  fontSize: FontSize.fontSizeText13,
                  lineHeight: RFPercentage(2),
                }}>
                Alguna descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion Alguna
                descriocionAlguna descriocionAlguna descriocion
              </Text>
            </View>
          </View>
          <TabView
            key={index}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={_renderTabBar}
            style={{flex: 1}}

            //   initialLayout={{width: RFPercentage(20)}}
          />
        </SafeAreaView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  scrollParent: {
    flexGrow: 1,
  },
  profileContainer: {
    // height: RFPercentage(34),
    marginHorizontal: RFPercentage(3),
    // backgroundColor:'yellow'
  },
  viewDataProfile: {
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: StatusBar.currentHeight,
    // marginTop: RFPercentage(2),
    marginHorizontal: RFPercentage(2),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: RFPercentage(2),
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  buttonEdit: {
    // position: 'absolute',
    // top: RFPercentage(4),
    // right: RFPercentage(2),
    zIndex: 999,
  },
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
