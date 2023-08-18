import React, {useEffect, useRef, useState} from 'react';
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
import {Organization, Project} from '../../../interfaces/interfaces';
import {useForm} from '../../../hooks/useForm';
import {LoadingScreen} from '../../../screens/LoadingScreen';

import PeopleFill from '../../../assets/icons/general/people-fill.svg';
import HeartFill from '../../../assets/icons/general/heart-fill.svg';
import Stars from '../../../assets/icons/general/stars.svg';
import Magic from '../../../assets/icons/general/magic.svg';
import Boockmark from '../../../assets/icons/general/bookmark-star-fill.svg';

interface Props extends StackScreenProps<any, any> {}

export const Home = ({navigation}: Props) => {
  //#region Variables/const
  const [categoryList, setCategoryList] = useState<HasTag[]>([]); //clonar para que la que se muestre solo tenga X registros siendo la ultima el +
  const [categoriesSelected, setCategoriesSelected] = useState<HasTag[]>([]);
  const [newProjectList, setNewProjectList] = useState<Project[]>([]); // partir la lista en 2

  const [importantProjectList, setImportantProjectList] = useState<Project[]>(
    [],
  );
  const [interestingProjectList, setInterestingProjectList] = useState<
    number[]
  >([1, 2, 3, 4, 5, 6, 7, 8]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  const [showCategoryList, setShowCategoryList] = useState(false);

  const [onSearch, setOnSearch] = useState(false);
  // const onSearchCategory = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAllCharged, setIsAllCharged] = useState(false);
  const [categorySelectedId, setCategorySelectedId] = useState<number[]>([]);
  

  const {onChange, form} = useForm({
    searchText: '',
  });

  //#endregion

  //#region UseEffects

  /**
   * cierra la pantalla de inicio
   */
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  //TODO llamada a la api para coger cada elemento
  useEffect(() => {
    categoryListApi();
    projectListApi();
    organizationListApi();
    setCategoriesSelected([]);
    setIsAllCharged(true);
  }, []);

  useEffect(() => {
    categoryListApi();
    projectListApi();
    setRefreshing(false);
    onSearchText('');
    setCategoriesSelected([]);
  }, [refreshing]);

  //se usa para que cuando una categoría esté seleccionada, se filtren proyectos si coinciden con la categoría
  useEffect(() => {
    categorySelectedFilter();
    console.log("Añadiendo el nuevo" + JSON.stringify(categorySelectedId))
    if(categorySelectedId.length <= 0){
      setOnSearch(false)
    }
  }, [categorySelectedId]);

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
    console.log("Entra al filter" + JSON.stringify(categorySelectedId))
    // si ya estaba en la lista se eliminará
    // si no está en la lista, se añadirá
    if(categorySelectedId.includes(id)){
      const ifCategory =  categorySelectedId.filter(x => x !== id);
      console.log("Los filtrados, si existe en la lista, se borra" + JSON.stringify(ifCategory))
      setCategorySelectedId([...ifCategory])
    }else{
      setCategorySelectedId([...categorySelectedId, id]);
      
    }
  };

  const categorySelectedFilter = () => {
    //si no hay categorías y estaba mostrandolas, se pone el on search a false
    if (categorySelectedId.length <= 0 && onSearch) {
      setCategorySelectedId([]);
      setOnSearch(false);
    } else {
      const filtered = newProjectList.filter(project =>
        project.hasTag.some(id =>
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

  const splitDataIntoRows = (data: Project[], columns: number) => {
    const rows = [];
    for (let i = 0; i < data.length; i += columns) {
      rows.push(data.slice(i, i + columns));
    }
    return rows;
  };

  const rows = splitDataIntoRows(newProjectList, 2);

  //#region ApiCalls

  const categoryListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<HasTag[]>('/project/hastag/', {
        headers: {
          Authorization: token,
        },
      });
      setCategoryList(resp.data);
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
      // console.log(JSON.stringify(resp.data));
      setNewProjectList(resp.data);
    } catch {}
  };

  const organizationListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Organization[]>('/organization/', {
        headers: {
          Authorization: token,
        },
      });
      setOrganizationList(resp.data);
    } catch {}
  };
  //#endregion

  //#endregion

  if (!isAllCharged) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}} onTouchEnd={onClickExit}>
        {/* titulo */}
        <View style={HomeStyles.titleView}>
          <Text style={HomeStyles.title}>HOME</Text>
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
          contentContainerStyle={{flexGrow: 1}}
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
                height: 54,
                width: '100%',
                textAlignVertical: 'center',
                marginLeft: 24,
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
              {categoryList.map((x, index) => {
                if (categoryList.length - 1 === index) {
                  return (
                    <Card
                      key={index}
                      type="categoryPlus"
                      categoryImage={index}
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
                      categoryImage={index}
                      title={x.hasTag}
                      onPress={() => {
                        categoryFilter(x.id);
                      }}
                      pressed={categorySelectedId.includes(x.id)
                        ? true
                        : false}
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
                      fill={'#dd4d4d'}
                    />
                  </View>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      fontFamily: FontFamily.NotoSansDisplaySemiBold,
                      fontSize: FontSize.fontSizeText18,
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
                    data={newProjectList}
                    renderItem={({item, index}) => {
                      if (
                        newProjectList.length - 1 === index &&
                        newProjectList.length > 1
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
                    }}>
                    Proyectos destacados
                  </Text>
                </View>

                <FlatList
                  style={HomeStyles.importantProjectScrollView}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={newProjectList}
                  renderItem={({item, index}) => {
                    if (newProjectList.length - 1 === index) {
                      return (
                        <Card
                          key={index}
                          type="importantsPlus"
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
                          type="importants"
                          categoryImage={index}
                          boolHelper={true}
                          onPress={() => {
                            onProjectPress(item.id);
                          }}
                          title={item.name}
                          description={item.description}
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
                    <IconBootstrap name={'stars'} size={20} color={'red'} />
                  </View>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      fontFamily: FontFamily.NotoSansDisplaySemiBold,
                      fontSize: FontSize.fontSizeText18,
                    }}>
                    Te puede interesar...
                  </Text>
                </View>
                <ScrollView
                  style={HomeStyles.interestingScrollView}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}>
                  {newProjectList.map((x, index) => {
                    if (newProjectList.length - 1 === index) {
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
                    <IconBootstrap name={'stars'} size={20} color={'red'} />
                  </View>
                  <Text
                    style={{
                      textAlignVertical: 'center',
                      fontFamily: FontFamily.NotoSansDisplaySemiBold,
                      fontSize: FontSize.fontSizeText18,
                    }}>
                    Organizaciones destacadas
                  </Text>
                </View>
                <ScrollView
                  style={HomeStyles.importantOrganizationScrollView}
                  horizontal={true}
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}>
                  {organizationList.map((x, index) => {
                    if (organizationList.length - 1 === index) {
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
                          title={x.principalName}
                          description={x.description}
                          onPress={() =>
                            navigation.navigate('OrganizationPage', {id: x.id})
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
                  marginLeft: 24,
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
                  }}>
                  Resultados de busqueda
                </Text>
              </View>

              <ScrollView
                style={{
                  alignSelf: 'center',
                  // backgroundColor: 'red',
                  width: '90%',
                }}
                contentContainerStyle={{flexGrow: 1}}
                nestedScrollEnabled={true}
                automaticallyAdjustsScrollIndicatorInsets
                scrollEnabled={true}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {importantProjectList.map((x, index) => {
                  // if (importantProjectList.length - 1 === index) {
                  return (
                    <Card
                      key={index}
                      type="projectFound"
                      categoryImage={index}
                      title={x.name}
                    />
                  );
                  // }
                })}
              </ScrollView>
              {/* <FlatList
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  width: '90%',
                }}
                contentContainerStyle={{flexGrow: 1}}
                data={importantProjectList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <Card
                    key={index}
                    type="projectFound"
                    categoryImage={index}
                    title={item.toString()}
                  />
                )}
                nestedScrollEnabled
                automaticallyAdjustContentInsets={false}
                scrollEnabled
                horizontal={false}
                showsHorizontalScrollIndicator={false}
              /> */}
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
              return (
                <View
                  style={{
                    width: RFPercentage(42),
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                  }}>
                  <Checkbox
                    status={'checked'}
                    onPress={() => {
                      console.log(item);
                    }}
                  />
                  <Text>{item.hasTag}</Text>
                </View>
              ); //aquí poner el plus
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const HomeStyles = StyleSheet.create({
  scrollParent: {
    flexGrow: 1,
  },
  title: {
    alignSelf: 'center',
    // height: Size.globalHeight / 12,
    marginTop: 49,
    justifyContent: 'center',
    fontSize: FontSize.fontSizeTextTitle,
    fontWeight: 'bold',
    FontFamily: FontFamily.NotoSansDisplayRegular,
  },
  titleView: {
    // backgroundColor: 'red',
    height: RFPercentage(14),
  },
  searchView: {
    // backgroundColor: 'green',
    height: RFPercentage(4),
    marginBottom: 33,
    marginHorizontal: 24,
  },
  categoryView: {
    // backgroundColor: 'cyan',
    flexDirection: 'column',
    height: RFPercentage(22),
    marginBottom: 38,
  },
  categoryScrollView: {
    // height: '20%',
    marginHorizontal: 24,
  },
  newProjectView: {
    // backgroundColor: 'yellow',
    marginBottom: '9%',
    height: RFPercentage(29),
  },
  newProjectScrollView: {
    marginHorizontal: 24,
    // height: Size.globalHeight / 4,
  },
  importantProjectView: {
    // backgroundColor: 'brown',
    marginBottom: RFPercentage(7),
    height: RFPercentage(40),
  },
  importantProjectScrollView: {
    marginHorizontal: RFPercentage(3),
    height: RFPercentage(50),
  },
  interestingView: {
    // backgroundColor: 'purple',
    marginBottom: RFPercentage(5),
    height: RFPercentage(37),
  },
  interestingScrollView: {
    marginHorizontal: 24,
    // height: Size.globalHeight / 2,
  },
  importantOrganizationView: {
    // backgroundColor: 'grey',
    marginBottom: RFPercentage(1),
    height: RFPercentage(30),
  },
  importantOrganizationScrollView: {
    marginHorizontal: 24,
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
