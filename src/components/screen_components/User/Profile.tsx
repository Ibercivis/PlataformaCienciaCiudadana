import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
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
import {
  Organization,
  UserProfile,
  ShowProject,
  User,
  UserInfo,
  CountryData,
} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi, {imageUrl} from '../../../api/citmapApi';
import {HeaderComponent} from '../../HeaderComponent';
import {useForm} from '../../../hooks/useForm';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Geo from '../../../assets/icons/general/geo-alt-fill.svg';
import Bookmark from '../../../assets/icons/general/bookmark-fill.svg';
import People from '../../../assets/icons/general/people.svg';
import Heart from '../../../assets/icons/general/heart.svg';
import HeartFill from '../../../assets/icons/general/heart-fill.svg';
import PencilSquare from '../../../assets/icons/general/pencil-square-1.svg';
import {HasTag} from '../../../interfaces/appInterfaces';
import {LoadingScreen} from '../../../screens/LoadingScreen';
import {FontFamily, FontSize, fonts} from '../../../theme/fonts';
import {Switch} from 'react-native-paper';
import {InputText} from '../../utility/InputText';
import {Picker} from '@react-native-picker/picker';
import {globalStyles} from '../../../theme/theme';
import {IconBootstrap} from '../../utility/IconBootstrap';
import {Size} from '../../../theme/size';
import {Colors} from '../../../theme/colors';
import PlusImg from '../../../assets/icons/general/Plus-img.svg';
import Person from '../../../assets/icons/general/person.svg';
import ImagePicker from 'react-native-image-crop-picker';
import {
  GenderSelectorModal,
  InfoModal,
  SaveProyectModal,
  VisibilityBirthday,
  VisibilityOrganizationModal,
} from '../../utility/Modals';
import Lock from '../../../assets/icons/general/lock-fill.svg';
import Card from '../../../assets/icons/general/card-fill.svg';
import World from '../../../assets/icons/general/world-fill.svg';
import NotContribution from '../../../assets/icons/profile/No hay contribuciones.svg';
import NotCreated from '../../../assets/icons/profile/No hay creados.svg';
import NotLiked from '../../../assets/icons/profile/No hay me gusta.svg';
import {CommonActions, useNavigation} from '@react-navigation/native';

interface Props extends StackScreenProps<any, any> {}

export const Profile = ({navigation}: Props) => {
  //#region Variables
  // const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'one', title: 'Contribuciones'},
    {key: 'two', title: 'Me gustan'},
    {key: 'three', title: 'Creados'},
  ]);

  const [isAllCharged, setIsAllCharged] = useState(false);
  const [userEdit, setUserEdit] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  const [projectList, setProjectList] = useState<ShowProject[]>([]);
  const [createdProjects, setCreatedProject] = useState<ShowProject[]>([]);
  const [contributionProject, setContributionProject] = useState<ShowProject[]>(
    [],
  );
  const [likedProject, setLikedProject] = useState<ShowProject[]>([]);
  const [organization, setOrganization] = useState<Organization[]>([]);
  const [countries, setCountries] = useState<[]>([]);
  const [hastags, setHastags] = useState<HasTag[]>([]);

  const [profileImage, setProfileImage] = useState<any>();
  const [profileImageBlob, setProfileImageBlob] = useState<any>();

  const [user, setUser] = useState<User>({
    pk: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    biography: '',
    visibility: false,
    country: '',
    participated_projects: [],
    created_projects: [],
    liked_projects: [],
  });
  const {form, onChange, setObject} = useForm<UserProfile>(userProfile);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    // form.visibility = !form.visibility
  };

  const [modalVisibleGenre, setModalVisibleGenre] = useState(false);
  const [modalVisibleOrganization, setModalVisibleOrganization] =
    useState(false);
  const [modalVisibleUbicacion, setModalVisibleUbicacion] = useState(false);
  const [modalVisibleBirth, setModalVisibleBirth] = useState(false);
  const [modalVisibleSave, setModalVisibleSave] = useState(false);
  const [genre, setGenre] = useState('');
  const [visibilityOrganization, setVisibilityOrganization] = useState('');
  const [visibilityUbicacion, setVisibilityUbicacion] = useState('');
  const [visibilityBirth, setVisibilityBirth] = useState('');
  const [saveAll, setSaveAll] = useState(false);

  const [infoModal, setInfoModal] = useState(false);
  const showModalInfo = () => setInfoModal(true);
  const hideModalInfo = () => setInfoModal(false);

  const [selectedCountry, setSelectedCountry] = useState([]);

  //#endregion

  //#region tabs
  const Contribution = () => (
    <>
      {contributionProject.length <= 0 ? (
        <>
          <View style={{alignItems: 'center', marginTop: '7%'}}>
            <Text
              style={{
                color: 'black',
                fontSize: FontSize.fontSizeText20,
                fontFamily: FontFamily.NotoSansDisplayRegular,
                fontWeight: '700',
              }}>
              No has participado...
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
              ¡Participa! Y todos los proyectos en los que contribuyas
              aparecerán aquí.
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
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={contributionProject}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.5}
                style={styles.projectFound}
                onPress={() => navigateTo(item.id)}>
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
                      {item.hasTag.map((x, i) => {
                        const matchingHastag = hastags.find(
                          hastag => hastag.id === x,
                        );
                        if (matchingHastag) {
                          return (
                            <Text
                              key={i}
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
                    // source={require('../../../assets/backgrounds/login-background.jpg')}
                    source={
                      item.cover && item.cover[0]
                        ? {uri: imageUrl + item.cover[0].image}
                        : require('../../../assets/backgrounds/nuevoproyecto.jpg')
                    }
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
                        {/* {true ? (
                            <HeartFill
                              width={16}
                              height={16}
                              color={'#ff0000'}
                            />
                          ) : (
                            <Heart width={16} height={16} color={'#000000'} />
                          )} */}
                        <Heart width={16} height={16} color={'#000000'} />
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
                        {item.is_liked_by_user ? (
                          <HeartFill width={16} height={16} color={'#ff0000'} />
                        ) : (
                          <Heart width={16} height={16} color={'#000000'} />
                        )}
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );
  const Liked = () => (
    <>
      {likedProject.length <= 0 ? (
        <>
          <View style={{alignItems: 'center', marginTop: '7%'}}>
            <Text
              style={{
                width: '65%',
                textAlign: 'center',
                color: 'black',
                fontSize: FontSize.fontSizeText20,
                fontFamily: FontFamily.NotoSansDisplayRegular,
                fontWeight: '700',
              }}>
              No tienes proyectos favoritos
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
              Dale "me gusta" a los proyectos que te interesan y se guardarán
              aquí
            </Text>
            <View style={{alignItems: 'center'}}>
              <NotLiked width={RFPercentage(28)} height={RFPercentage(28)} />
            </View>
          </View>
        </>
      ) : (
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={likedProject}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.5}
                style={styles.projectFound}
                onPress={() => navigateTo(item.id)}>
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
                      {item.hasTag.map((x, i) => {
                        const matchingHastag = hastags.find(
                          hastag => hastag.id === x,
                        );
                        if (matchingHastag) {
                          return (
                            <Text
                              key={i}
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
                    // source={require('../../../assets/backgrounds/login-background.jpg')}
                    source={
                      item.cover && item.cover[0]
                        ? {uri: imageUrl + item.cover[0].image}
                        : require('../../../assets/backgrounds/nuevoproyecto.jpg')
                    }
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
                        {false ? (
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
                          {item.total_likes}
                        </Text>
                        {/* <Heart width={16} height={16} color={'#000000'} /> */}
                        {item.is_liked_by_user ? (
                          <HeartFill width={16} height={16} color={'#ff0000'} />
                        ) : (
                          <Heart width={16} height={16} color={'#000000'} />
                        )}
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );
  const Created = () => (
    <>
      {createdProjects.length <= 0 ? (
        <>
          <View style={{alignItems: 'center', marginTop: '7%'}}>
            <Text
              style={{
                width: '65%',
                textAlign: 'center',
                color: 'black',
                fontSize: FontSize.fontSizeText20,
                fontFamily: FontFamily.NotoSansDisplayRegular,
                fontWeight: '700',
              }}>
              Aún no se han creado proyectos...
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
              Crea tus propios proyectos y aparecerán aquí
            </Text>
            <View style={{alignItems: 'center'}}>
              <NotCreated width={RFPercentage(28)} height={RFPercentage(28)} />
            </View>
          </View>
        </>
      ) : (
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={createdProjects}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.5}
                style={styles.projectFound}
                onPress={() => navigateTo(item.id)}>
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
                      {item.hasTag.map((x, i) => {
                        const matchingHastag = hastags.find(
                          hastag => hastag.id === x,
                        );
                        if (matchingHastag) {
                          return (
                            <Text
                              key={i}
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
                    // source={require('../../../assets/backgrounds/login-background.jpg')}
                    source={
                      item.cover && item.cover[0]
                        ? {uri: imageUrl + item.cover[0].image}
                        : require('../../../assets/backgrounds/nuevoproyecto.jpg')
                    }
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
                          {item.total_likes}
                        </Text>
                        {/* <Heart width={16} height={16} color={'#000000'} /> */}
                        {item.is_liked_by_user ? (
                          <HeartFill width={16} height={16} color={'#ff0000'} />
                        ) : (
                          <Heart width={16} height={16} color={'#000000'} />
                        )}
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );

  const renderScene = SceneMap({
    one: Contribution,
    two: Liked,
    three: Created,
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
              inputIndex === i ? 1 : 0.25,
            ),
          });
          const fontWeight = '500';

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <Animated.Text
                style={{
                  opacity,
                  fontWeight,
                  color: 'black',
                  fontSize: FontSize.fontSizeText14,
                  fontFamily: FontFamily.NotoSansDisplayMedium,
                }}>
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

  // useEffect(() => {
  //   setObject(profile);
  // }, [userProfile]);

  useEffect(() => {
    getHastagApi();
  }, []);

  useEffect(() => {
    projectListApi();
    getOrganizationApi();
  }, [userProfile]);

  useEffect(() => {
    setIsAllCharged(true);
  }, [createdProjects]);

  //#endregion

  //#region api
  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<ShowProject[]>('/project/', {
        headers: {
          Authorization: token,
        },
      });
      setProjectList(resp.data);
      setLikedProject(resp.data.filter(x => x.is_liked_by_user === true));
      setContributionProject(resp.data);
      setCreatedProject(resp.data.filter(x => x.creator === user.pk));
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
      const profile = await citmapApi.get<UserInfo>(`/users/${resp.data.pk}/`, {
        headers: {
          Authorization: token,
        },
      });
      setUserProfile(profile.data.profile);
      setIsSwitchOn(profile.data.profile.visibility);
      getCountriesApi();
      // console.log(JSON.stringify(profile.data.profile, null, 2))
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
      const resp = await citmapApi.get<Organization[]>('/organization/', {
        headers: {
          Authorization: token,
        },
      });
      setOrganization(resp.data);
    } catch {}
  };

  const getCountriesApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<[]>('/users/countries/', {
        headers: {
          Authorization: token,
        },
      });
      setCountries(resp.data);
      if(userProfile.country){
        const country = resp.data.find(x => x[1] === userProfile.country)
        if(country){
          setSelectedCountry(country)
        }
      }
    } catch {}
  };

  //#endregion

  //#region Methods

  const writeForm = () => {
    setObject(userProfile);
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
  const showModalSave = () => setModalVisibleSave(true);
  const hideModalSave = () => setModalVisibleSave(false);
  const hideModalGenre = () => setModalVisibleGenre(false);
  const showModalOrganization = () => setModalVisibleOrganization(true);
  const hideModalOrganization = () => setModalVisibleOrganization(false);
  const showModalBirth = () => setModalVisibleBirth(true);
  const hideModalBirth = () => setModalVisibleBirth(false);
  const showModalLocation = () => setModalVisibleUbicacion(true);
  const hideModalLocation = () => setModalVisibleUbicacion(false);
  const [controlSizeImage, setControlSizeImage] = useState(false);
  const showModalControlSizeImage = () => setControlSizeImage(true);
  const hideModalControlSizeImage = () => setControlSizeImage(false);

  const setSelectedGenreMethod = (gender: string) => {
    setGenre(gender); // Guarda el género seleccionado en el estado
    // hideModalGenre(); // Cierra el modal
  };

  const setSelectedOrganizationVisibilityMethod = (state: string) => {
    setVisibilityOrganization(state);
    // hideModalOrganization(); // Cierra el modal
  };
  const setSelectedBirthVisibilityMethod = (state: string) => {
    setVisibilityBirth(state);
    // hideModalOrganization(); // Cierra el modal
  };

  const setSelectedLocationVisibilityMethod = (state: string) => {
    setVisibilityUbicacion(state);
    // hideModalOrganization(); // Cierra el modal
  };

  const setSelectedSaveMethod = (state: string) => {
    setVisibilityOrganization(state);
  };

  //metodo para poder navegar entre 
  const navigateTo = (projectId: number) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes:[
          {
            name: 'HomeNavigator',
            state:{
              routes:[
                {
                  name:'ProjectPage',
                  params:{
                    id: projectId, isNew: false, fromProfile:true,
                  }
                }
              ]
            }
          }
        ]
      })
    )

  };

  const openProfilePhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    }).then(response => {
      if (response && response.data) {
        if (response.size < 4 * 1024 * 1024) {
          const newImage = response;
          setProfileImage(response);
          setProfileImageBlob({
            uri: newImage.path, // Debes ajustar esto según la estructura de response
            type: newImage.mime, // Tipo MIME de la imagen
            name: 'cover.jpg', // Nombre de archivo de la imagen (puedes cambiarlo)
          });
        } else {
          showModalControlSizeImage();
        }
      }
    });
  };

  const iconVisibility = (text: String) => {
    switch (
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
    ) {
      case 'solo tu':
        return (
          <Lock
            width={RFPercentage(1.4)}
            height={RFPercentage(2)}
            fill={Colors.contentTertiaryLight}
          />
        );

      case 'solo tu y proyectos':
        return (
          <Card
            width={RFPercentage(1.4)}
            height={RFPercentage(2)}
            fill={Colors.contentTertiaryLight}
          />
        );
      case 'publico':
        return (
          <World
            width={RFPercentage(1.4)}
            height={RFPercentage(2)}
            fill={Colors.contentTertiaryLight}
          />
        );
    }
  };

  //se usará para dar o quitar likes en el perfil
  const toggleLike = async (idProject: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.post(
        `/projects/${idProject}/toggle-like/`,
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      // onRefresh();
    } catch (err) {}
  };

  const saveProfile = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  if (!isAllCharged) {
    return <LoadingScreen />;
  }

  return (
    <>
      <HeaderComponent
        title={!userEdit ? user.username : 'Editar perfil'}
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
                    backgroundColor: Colors.secondaryBackground,
                    borderRadius: 10,
                    // backgroundColor: 'green',
                  }}>
                  {profileImage ? (
                    <>
                      <Image
                        source={{
                          uri: 'data:image/jpeg;base64,' + profileImage.data,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          // borderRadius: 50,
                          resizeMode: 'cover',
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => openProfilePhoto()}>
                        <Person
                          fill={'black'}
                          height={RFPercentage(7)}
                          width={RFPercentage(7)}
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    onPress={() => openProfilePhoto()}
                    style={{
                      width: RFPercentage(4),
                      position: 'absolute',
                      bottom: RFPercentage(-1),
                      left: RFPercentage(12.4),
                      zIndex: 999,
                    }}>
                    <PlusImg
                      width={RFPercentage(4)}
                      height={RFPercentage(4)}
                      fill={'#0059ff'}
                    />
                  </TouchableOpacity>
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
                  <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    color={Colors.semanticSuccessLight}
                  />
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
                  <Text style={{}}>
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
                    onChangeText={value => console.log(value)}
                    value={user.username}
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
                    onChangeText={value => onChange(value, 'biography')}
                    value={form.biography}
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
                    onChangeText={value => console.log(value)}
                    value={user.email}
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
                    onChangeText={value => console.log()}
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
                    onChangeText={value => console.log()}
                  />
                </View>

                {/* organizacion */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Organización</Text>

                  <TouchableOpacity
                    style={{backgroundColor: 'transparent'}}
                    activeOpacity={0.8}
                    onPress={showModalInfo}>
                    <View
                      style={{
                        ...globalStyles.inputContainer,
                        backgroundColor: organization
                          ? Colors.semanticSuccessLight
                          : Colors.semanticInfoLight,
                        // height: '30%'
                        borderWidth: 0,
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
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              top: RFPercentage(0.4),
                            }}>
                            <IconBootstrap
                              name={'Info'}
                              size={RFPercentage(3)}
                              color={'white'}
                            />
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          width: '80%',
                          fontSize: FontSize.fontSizeText14,
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
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <TouchableOpacity onPress={() => showModalOrganization()}>
                      <Text
                        style={{
                          color: Colors.semanticInfoDark,
                          fontSize: FontSize.fontSizeText13,
                          marginRight: '2%',
                        }}>
                        ¿Quién puede ver esto?
                      </Text>
                    </TouchableOpacity>
                    {visibilityOrganization.length > 0 &&
                      iconVisibility(visibilityOrganization)}
                    <Text
                      style={{
                        color: Colors.contentTertiaryLight,
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayLight,
                        marginLeft: '2%',
                      }}>
                      {visibilityOrganization}
                    </Text>
                  </View>
                </View>

                {/* ubicacion */}
                <View
                  style={{
                    width: '80%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Ubicacion</Text>
                  {/* <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Di tu ubicación'}
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => console.log()}
                    value={form.country}
                  /> */}
                  <Picker
                    selectedValue={selectedCountry[0]}
                    onValueChange={(itemValue, itemIndex) => {
                      // Aquí puedes manejar el valor seleccionado, por ejemplo, actualizando form.country
                      // En este ejemplo, simplemente imprimimos el valor seleccionado.
                      setSelectedCountry(itemValue)
                      onChange(itemValue, 'country')
                    }}
                    style={{width: RFPercentage(41)}}>
                    {countries.map((pais, index) => (
                      <Picker.Item
                        key={index}
                        label={pais[1]}
                        value={pais[1]}
                      />
                    ))}
                  </Picker>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <TouchableOpacity onPress={() => showModalLocation()}>
                      <Text
                        style={{
                          color: Colors.semanticInfoDark,
                          fontSize: FontSize.fontSizeText13,
                        }}>
                        ¿Quién puede ver esto?
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: Colors.contentTertiaryLight,
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayLight,
                        marginLeft: '5%',
                      }}>
                      {visibilityUbicacion}
                    </Text>
                  </View>
                </View>

                {/* fecha nacimiento */}
                {/* <View
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
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: RFPercentage(1),
                    }}>
                    <TouchableOpacity onPress={() => showModalBirth()}>
                      <Text
                        style={{
                          color: Colors.semanticInfoDark,
                          fontSize: FontSize.fontSizeText13,
                        }}>
                        ¿Quién puede ver esto?
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: Colors.contentTertiaryLight,
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayLight,
                        marginLeft: '5%',
                      }}>
                      {visibilityBirth}
                    </Text>
                  </View>
                </View> */}

                {/* sexo genero */}
                {/* <View
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
                </View> */}
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
                label="¿Quién puede ver tu organizacion?"
              />
              {/* modal visibilidad ubicacion */}
              <VisibilityOrganizationModal
                visible={modalVisibleUbicacion}
                hideModal={hideModalLocation}
                onPress={hideModalLocation}
                setSelected={setSelectedLocationVisibilityMethod}
                selected={visibilityUbicacion}
                label="¿Quién puede ver tu ubicación?"
              />
              {/* modal visibilidad nacimiento */}
              <VisibilityBirthday
                visible={modalVisibleBirth}
                hideModal={hideModalBirth}
                onPress={hideModalBirth}
                setSelected={setSelectedBirthVisibilityMethod}
                selected={visibilityBirth}
                label="¿Quién puede ver tu fecha de nacimiento?"
              />
            </ScrollView>
            <InfoModal
              visible={infoModal}
              hideModal={hideModalInfo}
              onPress={hideModalInfo}
              size={RFPercentage(4)}
              color={Colors.primaryLigth}
              label="¿Perteneces a una organización?"
              subLabel="Si perteneces a una organización existente en Geonity, 
              ponte en contacto con el admin de la organización para que te invite o te añada como integrante.
              "
              subLabel2="Una vez hayas aceptado la solicitud, podrás añadir la organzación a tu biografía."
              helper={false}
            />
            <SaveProyectModal
              visible={controlSizeImage}
              hideModal={hideModalControlSizeImage}
              onPress={hideModalControlSizeImage}
              size={RFPercentage(8)}
              color={Colors.semanticWarningDark}
              label="La imagen no puede pesar mas de 4 Mb"
              helper={false}
            />
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
                height: RFPercentage(15),
                flexDirection: 'row',
                marginTop: RFPercentage(3),
              }}>
              {/* foto de perfil */}
              <View
                style={{
                  width: RFPercentage(15),
                  // height: '100%',
                  height: RFPercentage(14.4),
                  marginRight: RFPercentage(1),
                }}>
                {/* TODO aquí cambiar a la imagen que viene de base de datos */}
                {profileImage ? (
                  <>
                    <Image
                      source={{
                        uri: 'data:image/jpeg;base64,' + profileImage.data,
                      }}
                      style={{
                        height: '100%',
                        maxWidth: RFPercentage(14),
                        borderRadius: 10,
                        // borderRadius: 50,
                        resizeMode: 'cover',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Image
                      borderRadius={10}
                      // source={require(urii)}
                      source={require('../../../assets/backgrounds/login-background.jpg')}
                      style={{
                        height: '100%',
                        maxWidth: RFPercentage(14),
                        borderRadius: 10,
                      }}
                    />
                  </>
                )}
              </View>
              {/* datos derecha */}
              <View
                style={{
                  width: '70%',
                  height: '28%',
                  flexDirection: 'column',
                }}>
                {/* contribuciones creados */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'column',
                    // marginVertical: RFPercentage(1),
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={styles.viewDataProfile}>
                      <Text
                        style={{
                          fontFamily: FontFamily.NotoSansDisplayMedium,
                          color: 'black',
                          fontSize: FontSize.fontSizeText18,
                        }}>
                        {userProfile.participated_projects.length}
                      </Text>
                    </View>
                    <View style={styles.viewDataProfile}>
                      <Text
                        style={{
                          fontFamily: FontFamily.NotoSansDisplayMedium,
                          color: 'black',
                          fontSize: FontSize.fontSizeText18,
                        }}>
                        {userProfile.created_projects.length}
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
                      marginTop: '2%',
                    }}>
                    <View style={styles.viewDataProfile}>
                      <Text>Contribuciones</Text>
                    </View>
                    <View style={styles.viewDataProfile}>
                      <Text>Creados</Text>
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
                    <Bookmark
                      width={RFPercentage(1.8)}
                      height={RFPercentage(1.8)}
                      fill={'#3a53e2'}
                    />
                    <Text
                      style={{
                        // fontWeight: 'bold',
                        height: '100%',
                        color: 'black',
                        alignSelf: 'center',
                        marginLeft: RFPercentage(0.5),
                        bottom: RFPercentage(0.1),
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayRegular,
                        // backgroundColor:'red'
                      }}>
                      {}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginHorizontal: RFPercentage(3),
                      flexDirection: 'row',
                    }}>
                    <Geo
                      width={RFPercentage(1.8)}
                      height={RFPercentage(1.8)}
                      fill={'#3a53e2'}
                    />
                    <Text
                      style={{
                        // fontWeight: 'bold',
                        height: '100%',
                        color: 'black',
                        alignSelf: 'center',
                        marginLeft: RFPercentage(0.5),
                        bottom: RFPercentage(0.1),
                        fontSize: FontSize.fontSizeText13,
                        fontFamily: FontFamily.NotoSansDisplayRegular,
                      }}>
                      {userProfile.country}
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
                alignSelf: 'center',
                // backgroundColor:'red',
                marginHorizontal: RFPercentage(3),
                marginVertical: RFPercentage(4),
                width: '100%',
              }}>
              <Text
                style={{
                  fontWeight: 'normal',
                  color: 'black',
                  fontSize: FontSize.fontSizeText14,
                  lineHeight: RFPercentage(2),
                  fontFamily: FontFamily.NotoSansDisplayLight,
                  textAlign: 'left',
                }}>
                {userProfile.biography}
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
    fontSize: FontSize.fontSizeText13,
    fontFamily: FontFamily.NotoSansDisplayLight,
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
    height: 2.2,
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
