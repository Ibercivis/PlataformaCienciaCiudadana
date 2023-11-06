import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {HasTag, Projects, Topic} from '../../../interfaces/appInterfaces';
import SplashScreen from 'react-native-splash-screen';
import {Card} from '../../utility/Card';
import {InputText} from '../../utility/InputText';
import {FontFamily, FontSize} from '../../../theme/fonts';
import {IconBootstrap} from '../../utility/IconBootstrap';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Checkbox} from 'react-native-paper';
import citmapApi from '../../../api/citmapApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Organization,
  Project,
  ShowProject,
} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';
import {LoadingScreen} from '../../../screens/LoadingScreen';

import PeopleFill from '../../../assets/icons/general/people-fill.svg';
import HeartFill from '../../../assets/icons/general/heart-fill.svg';
import Stars from '../../../assets/icons/general/stars.svg';
import Dots from '../../../assets/icons/general/three-dots-vertical.svg';
import Magic from '../../../assets/icons/general/magic.svg';
import Boockmark from '../../../assets/icons/general/bookmark-star-fill.svg';
import {Spinner} from '../../utility/Spinner';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {AuthContext} from '../../../context/AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<any, any> {}

export const Home = ({navigation}: Props) => {
  //#region Variables/const
  const NUM_SLICE_NEW_PROJECT_LIST = 10;
  const RETRY_DELAY_MS = 1000;
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<Topic[]>([]); //clonar para que la que se muestre solo tenga X registros siendo la ultima el +
  const [categoriesSelected, setCategoriesSelected] = useState<Topic[]>([]);
  const [newProjectList, setNewProjectList] = useState<ShowProject[]>([]); // partir la lista en 2
  const [newProjectListSliced, setNewProjectListSliced] = useState<
    ShowProject[]
  >([]); // partir la lista en 2

  const [importantProjectList, setImportantProjectList] = useState<
    ShowProject[]
  >([]);
  const [interestingProjectList, setInterestingProjectList] = useState<
    number[]
  >([1, 2, 3, 4, 5, 6, 7, 8]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  const [showCategoryList, setShowCategoryList] = useState(false);

  const [onSearch, setOnSearch] = useState(false);
  // const onSearchCategory = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAllCharged, setIsAllCharged] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [categorySelectedId, setCategorySelectedId] = useState<number[]>([]);

  const {onChange, form} = useForm({
    searchText: '',
  });

  const {signIn, signOut, signUp, errorMessage, removeError, recoveryPass} =
    useContext(AuthContext);

  //#endregion

  //#region UseEffects

  /**
   * cierra la pantalla de inicio
   */
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      categoryListApi();
    }, [loading]),
  );

  //TODO llamada a la api para coger cada elemento
  useEffect(() => {
    setLoading(true);
    categoryListApi();
    projectListApi();
    organizationListApi();
    setCategoriesSelected([]);
    //aquí estaba el setIsAllCharged(true);
  }, []);

  useEffect(() => {
    categoryListApi();
    projectListApi();
    setRefreshing(false);
    onSearchText('');
    organizationListApi();
    setCategoriesSelected([]);
  }, [refreshing]);

  //se usa para que cuando una categoría esté seleccionada, se filtren proyectos si coinciden con la categoría
  useEffect(() => {
    categorySelectedFilter();
    // console.log("Añadiendo el nuevo" + JSON.stringify(categorySelectedId))
    if (categorySelectedId.length <= 0) {
      setOnSearch(false);
    }
  }, [categorySelectedId]);

  useEffect(() => {
    if (errorMessage.length === 0) return;
    console.log('eh, ha saltado el error en home ' + errorMessage);
  }, [errorMessage]);

  //#endregion

  //#region Methods

  /**
   * Cuando está la categoria desplegada, si pulsas fuera se pliega de nuevo
   */
  const onClickExit = () => {
    if (showCategoryList) {
      setShowCategoryList(false);
    }
  };
  /**
   * controla que se vea o no las demás categorías desplegadas
   */
  const onCategoryPress = () => {
    setShowCategoryList(true);
  };

  /**
   * Metodo al que se le pasa la categoría seleccionada y se guarda en un array de categorías seleccionadas para que se pueda filtrar
   * @param category categoría que se selecciona
   */
  const categoryFilter = (id: number) => {
    // si ya estaba en la lista se eliminará
    // si no está en la lista, se añadirá
    if (categorySelectedId.includes(id)) {
      const ifCategory = categorySelectedId.filter(x => x !== id);  
      setCategorySelectedId([...ifCategory]);
    } else {
      setCategorySelectedId([...categorySelectedId, id]);
    }
  };

  const setCheckCategories = (item: Topic) => {
    // Verificar si el elemento ya está seleccionado
    if (categoriesSelected.includes(item)) {
      setCategoriesSelected(
        categoriesSelected.filter(selectedItem => selectedItem !== item),
      );
    } else {
      setCategoriesSelected([...categoriesSelected, item]);
    }

    categoryFilter(item.id);
  };

  const categorySelectedFilter = () => {
    //si no hay categorías y estaba mostrandolas, se pone el on search a false
    if (categorySelectedId.length <= 0 && onSearch) {
      setCategorySelectedId([]);
      setOnSearch(false);
    } else {
      const filtered = newProjectList.filter(project =>
        project.topic.some(id =>
          categorySelectedId.some(hasta => hasta === id),
        ),
      );
      setOnSearch(true);
      setImportantProjectList(filtered);
    }
  };

  /**
   * busca y cambia la view
   */
  const onSearchText = (value: string) => {
    if (value.length > 0) {
      onChange(value, 'searchText');
      setOnSearch(true);
      const filtered = newProjectList.filter(x =>
        x.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      );
      setImportantProjectList(filtered);
    } else {
      onChange('', 'searchText');
      setOnSearch(false);
    }
  };

  /**
   * hace una actualización de los proyectos
   */
  const onRefresh = () => {
    setRefreshing(true);
    setOnSearch(false);
    setCategorySelectedId([]);
    categoryListApi();
    projectListApi();
  };

  /**
   * Navega a la pagina del proyecto
   * @param id id del proyecto
   */
  const onProjectPress = (id: number) => {
    if (id > 0) {
      navigation.navigate('ProjectPage', {id});
    }
  };

  const splitDataIntoRows = (data: ShowProject[], columns: number) => {
    const rows = [];
    for (let i = 0; i < data.length; i += columns) {
      rows.push(data.slice(i, i + columns));
    }
    return rows;
  };

  const rows = splitDataIntoRows(newProjectList, 2);

  const chunkArray = (list: ShowProject[], chunkSize: number) => {
    setNewProjectListSliced(list.slice(0, chunkSize));
  };

  //#region ApiCalls
  const setErrorMessage = (errMsg: any) => {
    let textError = '';
    const dataError = JSON.stringify(errMsg.response.data, null);
    const dataErrorObj = JSON.parse(dataError);
    for (const x in dataErrorObj) {
      textError += dataErrorObj[x] + '\n';
    }
    setErrMessage(textError);
  };

  const categoryListApi = async () => {
    const MAX_RETRIES = 3;
    let token;

    while (!token) {
      token = await AsyncStorage.getItem('token');
    }

    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES && !success) {
      try {
        const resp = await citmapApi.get<Topic[]>('/project/topics/', {
          headers: {
            Authorization: token,
          },
        });
        setCategoryList(resp.data);

        success = true;
        // setLoading(false);
      } catch (err) {
        console.log(err.response.data);
        setErrorMessage(err);
        retries++;
        await new Promise<void>(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    if (!success) {
      // setLoading(false);
      // Si no se pudieron cargar los datos después de los intentos, muestra el Toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        // text2: 'No se han podido obtener los datos, por favor reinicie la app',
        text2: errMessage,
      });
    }
  };

  const projectListApi = async () => {
    let token;

    while (!token) {
      token = await AsyncStorage.getItem('token');
    }
    try {
      let resp;
      while (!resp) {
        resp = await citmapApi.get<ShowProject[]>('/project/', {
          headers: {
            Authorization: token,
          },
        });
      }

      setNewProjectList(resp.data);
      chunkArray(resp.data, NUM_SLICE_NEW_PROJECT_LIST);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
    } finally {
    }
  };

  const organizationListApi = async () => {
    let token;

    while (!token) {
      token = await AsyncStorage.getItem('token');
    }
    try {
      const resp = await citmapApi.get<Organization[]>('/organization/', {
        headers: {
          Authorization: token,
        },
      });
      setOrganizationList(resp.data);
      setLoading(false);
    } catch {
    } finally {
    }
  };

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
      onRefresh();
    } catch (err) {}
  };

  //lista de topics devuelta por cada proyecto
  const returnTopics = (list: number[]) => {
    const returnTopic : Topic[] = [];
    for (const num of list) {
      const matchingTopic = categoryList.find(topic => topic.id === num);
      if (matchingTopic) {
        returnTopic.push(matchingTopic);
      }
    }
    // console.log(JSON.stringify(returnTopic, null, 2))
    return returnTopic;
  }

  //#endregion

  //#endregion

  // if (!isAllCharged) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}} onTouchEnd={onClickExit}>
          {/* titulo */}
          <View style={{...HomeStyles.titleView}}>
            <Text style={HomeStyles.title}>GEONITY</Text>
            <TouchableOpacity
              onPress={() => signOut()}
              style={{
                position: 'absolute',
                justifyContent: 'center',
                right: widthPercentageToDP(10),
                top: heightPercentageToDP(7),
              }}>
              {/* <IconBootstrap name={'stars'} size={20} color={'blue'} /> */}
              <Dots
                width={RFPercentage(1.8)}
                height={RFPercentage(1.8)}
                fill={'#000000'}
              />
            </TouchableOpacity>
          </View>
          {/* barra de busqueda */}
          <View style={HomeStyles.searchView}>
            <InputText
              iconLeft="search"
              label={'search'}
              keyboardType="email-address"
              multiline={false}
              numOfLines={1}
              value={form.searchText}
              onChangeText={value => onSearchText(value)}
            />
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={HomeStyles.scrollParent}
            onTouchEnd={onClickExit}
            nestedScrollEnabled={true}
            // contentContainerStyle={{flexGrow: 1}}
            contentContainerStyle={{paddingBottom: '20%'}}
            keyboardShouldPersistTaps="handled"
            // scrollEnabled={!onSearch}
          >
            {/* view de categoría */}
            <LinearGradient
              colors={['rgba(255, 138, 0, 0.42)', '#CB9DA8']}
              style={HomeStyles.categoryView}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}>
              <Text
                style={{
                  height: heightPercentageToDP(5),
                  width: '100%',
                  textAlignVertical: 'center',
                  marginLeft: widthPercentageToDP(7),
                  marginTop: heightPercentageToDP(1.4),
                  fontFamily: FontFamily.NotoSansDisplaySemiBold,
                  fontSize: FontSize.fontSizeText18,
                }}>
                Categorías
              </Text>
              <ScrollView
                style={HomeStyles.categoryScrollView}
                horizontal={true}
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}>
                {categoryList.slice(0, 5).map((x, index) => {
                  const isChecked = categoriesSelected.includes(x);
                  if (categoryList.slice(0, 5).length - 1 === index) {
                    return (
                      <Card
                        key={index}
                        type="categoryPlus"
                        categoryImage={0}
                        onPress={() => {
                          onCategoryPress();
                        }}
                      />
                    );
                  } else {
                    return (
                      <Card
                        key={index}
                        type="category"
                        categoryImage={x.id}
                        title={x.topic}
                        onPress={() => {
                          // categoryFilter(x.id);
                          setCheckCategories(x);
                        }}
                        pressed={
                          isChecked //si tiene el id en la lista de seleccionados
                        }
                      />
                    );
                  }
                })}
              </ScrollView>
            </LinearGradient>
            {!onSearch && (
              <View>
                {/* view de nuevos proyectos */}
                <View style={HomeStyles.newProjectView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 54,
                      width: '100%',
                      marginLeft: 24,
                      marginBottom: RFPercentage(2),
                    }}>
                    <View
                      style={{
                        marginHorizontal: '1%',
                        justifyContent: 'center',
                        top: 1,
                      }}>
                      {/* <IconBootstrap name={'stars'} size={20} color={'blue'} /> */}
                      <Stars
                        width={RFPercentage(1.8)}
                        height={RFPercentage(1.8)}
                        fill={'#2b4ce0'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlignVertical: 'center',
                        fontFamily: FontFamily.NotoSansDisplaySemiBold,
                        fontSize: FontSize.fontSizeText18,
                        marginLeft: RFPercentage(2),
                        alignSelf: 'center',
                      }}>
                      Nuevos proyectos
                    </Text>
                  </View>
                  <ScrollView
                    style={HomeStyles.newProjectScrollView}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}>
                    <FlatList
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      numColumns={Math.ceil(10 / 2)}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      // scrollEnabled={false}
                      data={newProjectListSliced}
                      renderItem={({item, index}) => {
                        if (
                          newProjectListSliced.length - 1 === index &&
                          newProjectListSliced.length > 1
                        ) {
                          return (
                            <Card
                              key={index}
                              type="newProjectsPlus"
                              categoryImage={index}
                              onPress={() => {
                                navigation.navigate('ProjectList');
                              }}
                            />
                          ); //aquí poner el plus
                        } else {
                          return (
                            <Card
                              key={index}
                              type="newProjects"
                              cover={
                                item.cover && item.cover[0]
                                  ? item.cover[0].image
                                  : ''
                              }
                              categoryImage={index}
                              title={item.name}
                              onPress={() => onProjectPress(item.id)}
                            />
                          );
                        }
                      }}
                    />
                  </ScrollView>
                </View>

                {/* view de te proyectos destacados */}
                <View style={HomeStyles.importantProjectView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: RFPercentage(7),
                      width: '100%',
                      marginLeft: 24,
                      marginBottom: RFPercentage(2),
                    }}>
                    <View
                      style={{
                        marginHorizontal: '1%',
                        justifyContent: 'center',
                        top: 1,
                      }}>
                      {/* <IconBootstrap name={'stars'} size={20} color={'blue'} /> */}
                      <PeopleFill
                        width={RFPercentage(1.8)}
                        height={RFPercentage(1.8)}
                        fill={'#2b4ce0'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlignVertical: 'center',
                        fontFamily: FontFamily.NotoSansDisplaySemiBold,
                        fontSize: FontSize.fontSizeText18,
                        marginLeft: RFPercentage(2),
                        alignSelf: 'center',
                      }}>
                      Proyectos destacados
                    </Text>
                  </View>

                  <FlatList
                    style={HomeStyles.importantProjectScrollView}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={newProjectList.slice(0, 10)}
                    renderItem={({item, index}) => {
                      if (newProjectList.slice(0, 10).length - 1 === index) {
                        return (
                          <Card
                            key={index}
                            type="importantsPlus"
                            categoryImage={index}
                            cover={
                              item.cover && item.cover[0]
                                ? item.cover[0].image
                                : ''
                            }
                            onPress={() => {
                              navigation.navigate('ProjectList');
                            }}
                          />
                        );
                      } else {
                        return (
                          <Card
                            key={index}
                            type="importants"
                            categoryImage={index}
                            cover={
                              item.cover && item.cover[0]
                                ? item.cover[0].image
                                : ''
                            }
                            onPress={() => {
                              onProjectPress(item.id);
                            }}
                            title={item.name}
                            boolHelper={item.is_liked_by_user}
                            description={item.description}
                            totalLikes={item.total_likes ? item.total_likes : 0}
                            onLike={() => toggleLike(item.id)}
                          />
                        );
                      }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    nestedScrollEnabled
                  />
                </View>

                {/* view de te puede interesar */}
                <View style={HomeStyles.interestingView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 54,
                      width: '100%',
                      marginLeft: 24,
                      marginBottom: RFPercentage(2),
                    }}>
                    <View
                      style={{
                        marginHorizontal: '1%',
                        justifyContent: 'center',
                        top: 1,
                      }}>
                      <Magic
                        width={RFPercentage(1.8)}
                        height={RFPercentage(1.8)}
                        fill={'#2b4ce0'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlignVertical: 'center',
                        fontFamily: FontFamily.NotoSansDisplaySemiBold,
                        fontSize: FontSize.fontSizeText18,
                        marginLeft: RFPercentage(2),
                        alignSelf: 'center',
                      }}>
                      Te puede interesar...
                    </Text>
                  </View>
                  <ScrollView
                    style={HomeStyles.interestingScrollView}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}>
                    {newProjectList.slice(0, 10).map((x, index) => {
                      if (newProjectList.slice(0, 10).length - 1 === index) {
                        return (
                          <Card
                            key={index}
                            type="interestingPlus"
                            categoryImage={index}
                            onPress={() => {
                              navigation.navigate('ProjectList');
                            }}
                          />
                        );
                      } else {
                        return (
                          <Card
                            key={index}
                            type="interesting"
                            categoryImage={index}
                            onPress={() => {
                              onProjectPress(x.id);
                            }}
                            cover={
                              x.cover && x.cover[0] ? x.cover[0].image : ''
                            }
                            title={x.name}
                            description={x.description}
                          />
                        );
                      }
                    })}
                  </ScrollView>
                </View>

                {/* view de organizaciones destacadas */}
                <View style={HomeStyles.importantOrganizationView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 54,
                      width: '100%',
                      marginLeft: 24,
                      marginBottom: RFPercentage(2),
                    }}>
                    <View
                      style={{
                        marginHorizontal: '1%',
                        justifyContent: 'center',
                        top: 1,
                      }}>
                      <Boockmark
                        width={RFPercentage(1.8)}
                        height={RFPercentage(1.8)}
                        fill={'#2b4ce0'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlignVertical: 'center',
                        fontFamily: FontFamily.NotoSansDisplaySemiBold,
                        fontSize: FontSize.fontSizeText18,
                        marginLeft: RFPercentage(2),
                        alignSelf: 'center',
                      }}>
                      Organizaciones destacadas
                    </Text>
                  </View>
                  <ScrollView
                    style={HomeStyles.importantOrganizationScrollView}
                    horizontal={true}
                    nestedScrollEnabled={true}
                    showsHorizontalScrollIndicator={false}>
                    {organizationList.slice(0, 5).map((x, index) => {
                      if (organizationList.slice(0, 5).length - 1 === index) {
                        return (
                          <Card
                            key={index}
                            type="organizationPlus"
                            categoryImage={index}
                            onPress={() =>
                              navigation.navigate('OrganizationList')
                            }
                          />
                        );
                      } else {
                        return (
                          <Card
                            key={index}
                            type="organization"
                            categoryImage={index}
                            cover={x.cover ? x.cover : ''}
                            title={x.principalName}
                            description={x.description}
                            onPress={() =>
                              navigation.navigate('OrganizationPage', {
                                id: x.id,
                              })
                            }
                          />
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              </View>
            )}
            {onSearch && (
              <View
                style={{
                  position: 'relative',
                  top: RFPercentage(0),
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 54,
                    width: '100%',
                    marginLeft: RFPercentage(3),
                    marginBottom: RFPercentage(2),
                  }}>
                  <View
                    style={{
                      marginHorizontal: '1%',
                      justifyContent: 'center',
                      top: 1,
                    }}>
                    <IconBootstrap name={'search'} size={20} color={'black'} />
                  </View>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      fontFamily: FontFamily.NotoSansDisplaySemiBold,
                      fontSize: FontSize.fontSizeText18,
                      alignSelf: 'center',
                    }}>
                    Resultados de busqueda
                  </Text>
                </View>
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP(5.6),
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {categoriesSelected.map(value => {
                    return (
                      <Text
                        key={value.id}
                        style={{color: Colors.semanticInfoDark}}>
                        #{value.topic}{' '}
                      </Text>
                    );
                  })}
                </View>

                <ScrollView
                  style={{
                    alignSelf: 'center',
                    width: '100%',
                  }}
                  contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
                  nestedScrollEnabled={true}
                  automaticallyAdjustsScrollIndicatorInsets
                  scrollEnabled={true}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}>
                  {importantProjectList.map((x, index) => {
                    // if (importantProjectList.length - 1 === index) {
                      console.log(JSON.stringify(importantProjectList, null, 2))
                    return (
                      <Card
                        key={index}
                        type="projectFound"
                        cover={x.cover && x.cover[0] ? x.cover[0].image : ''}
                        categoryImage={index}
                        title={x.name}
                        totalLikes={x.total_likes ? x.total_likes : 0}
                        boolHelper={x.is_liked_by_user}
                        description={x.description}
                        list={returnTopics(x.topic)}
                        onPress={() => {
                          onProjectPress(x.id);
                        }}
                      />
                    );
                    // }
                  })}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
        {showCategoryList && (
          <View style={HomeStyles.showCategoryView}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 10,
                marginBottom: '2%',
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 50,
                  backgroundColor: 'grey',
                  height: 8,
                  width: '10%',
                }}></TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginVertical: '4%',
                marginHorizontal: RFPercentage(4),
              }}>
              <View>
                <Text>Categorías</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => setShowCategoryList(false)}>
                  <Text style={{color: Colors.lightblue}}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              contentContainerStyle={{
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                width: '90%',
              }}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={categoryList}
              renderItem={({item, index}) => {
                const isChecked = categoriesSelected.includes(item);
                return (
                  <View
                    style={{
                      width: RFPercentage(42),
                      flexDirection: 'row',
                      alignItems: 'center',
                      // justifyContent: 'space-between',
                    }}>
                    <Checkbox
                      status={isChecked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setCheckCategories(item);
                      }}
                    />
                    <Text>{item.topic}</Text>
                  </View>
                ); //aquí poner el plus
              }}
            />
          </View>
        )}
        <Spinner visible={loading} />
        <Toast />
      </SafeAreaView>
    </>
  );
};

const HomeStyles = StyleSheet.create({
  scrollParent: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  title: {
    alignSelf: 'center',
    // height: Size.globalHeight / 12,
    marginTop: heightPercentageToDP(6),
    justifyContent: 'center',
    fontSize: FontSize.fontSizeTextTitle,
    fontWeight: 'bold',
    FontFamily: FontFamily.NotoSansDisplayRegular,
  },
  titleView: {
    // backgroundColor: 'red',
    height: heightPercentageToDP(13),
  },
  searchView: {
    // backgroundColor: 'green',
    height: heightPercentageToDP(4),
    marginBottom: 33,
    marginHorizontal: 24,
  },
  categoryView: {
    // backgroundColor: 'cyan',
    flexDirection: 'column',
    height: heightPercentageToDP(25),
    marginBottom: 38,
  },
  categoryScrollView: {
    // height: '20%',
    marginHorizontal: 24,
  },
  newProjectView: {
    // backgroundColor: 'yellow',
    marginBottom: '9%',
    // height: RFPercentage(35),
    // height: '20%',
  },
  newProjectScrollView: {
    marginHorizontal: 24,
    // height: Size.globalHeight / 4,
  },
  importantProjectView: {
    // backgroundColor: 'brown',
    marginBottom: RFPercentage(0),
    // height: RFPercentage(40),
    height: '27%',
  },
  importantProjectScrollView: {
    marginHorizontal: RFPercentage(3),
    // height: RFPercentage(50),
  },
  interestingView: {
    // backgroundColor: 'purple',
    marginBottom: RFPercentage(3),
    height: '20%',
  },
  interestingScrollView: {
    marginHorizontal: 24,
    // height: Size.globalHeight / 2,
  },
  importantOrganizationView: {
    // backgroundColor: 'grey',
    marginBottom: RFPercentage(1),
    height: '25%',
    // height: RFPercentage(30)
    // , backgroundColor: 'red',
  },
  importantOrganizationScrollView: {
    marginHorizontal: 24,
    height: '25%',
  },

  showCategoryView: {
    position: 'absolute',
    backgroundColor: 'white',
    height: RFPercentage(80),
    width: '100%',
    zIndex: 200,
    bottom: 0,
    alignSelf: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
    paddingVertical: '5%',
  },
});
