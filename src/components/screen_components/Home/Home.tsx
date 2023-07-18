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

interface Props extends StackScreenProps<any, any> {}

export const Home = ({navigation}: Props) => {
  //#region Variables/const
  const [categoryList, setCategoryList] = useState<HasTag[]>([]); //clonar para que la que se muestre solo tenga X registros siendo la ultima el +
  const [newProjectList, setNewProjectList] = useState<Project[]>([]); // partir la lista en 2

  const [importantProjectList, setImportantProjectList] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8,
  ]);
  const [interestingProjectList, setInterestingProjectList] = useState<
    number[]
  >([1, 2, 3, 4, 5, 6, 7, 8]);
  const [organizationList, setOrganizationList] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8,
  ]);

  const [showCategoryList, setShowCategoryList] = useState(false);

  const [onSearch, setOnSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

  useEffect(() => {
    categoryListApi();
    projectListApi();
    setRefreshing(false);
  }, [refreshing]);

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
   * busca y cambia la view
   */
  const onSearchText = (value: string) => {
    if (value.length > 0) {
      setOnSearch(true);
    } else {
      setOnSearch(false);
    }
  };

  /**
   * hace una actualización de los proyectos
   */
  const onRefresh = () => {
    setRefreshing(true);
    categoryListApi();
    projectListApi();
  };

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
      console.log(JSON.stringify(resp.data));
      setNewProjectList(resp.data);
    } catch {}
  };

  //#endregion

  //#endregion

  return (
    // <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={HomeStyles.scrollParent}
        onTouchEnd={onClickExit}
        // contentContainerStyle={{flexGrow: 1}}
        // keyboardShouldPersistTaps="handled"
        // scrollEnabled={true}
      >
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
            onChangeText={value => onSearchText(value)}
          />
        </View>
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
                  />
                );
              }
            })}
          </ScrollView>
        </LinearGradient>

        {onSearch == false ? (
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
                  <IconBootstrap name={'stars'} size={20} color={'blue'} />
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
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {/* <View
              style={{
                flexDirection: 'row',
              }}>
              {newProjectList1.map((x, index) => (
                <Card key={index} type="newProjects" categoryImage={index} />
              ))}
            </View> */}
                <FlatList
                  contentContainerStyle={{alignSelf: 'flex-start'}}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
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
                        />
                      ); //aquí poner el plus
                    } else {
                      return (
                        <Card
                          key={index}
                          type="newProjects"
                          categoryImage={index}
                          title={item.name}
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
                  <IconBootstrap name={'stars'} size={20} color={'blue'} />
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
              <ScrollView
                style={HomeStyles.importantProjectScrollView}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {importantProjectList.map((x, index) => {
                  if (importantProjectList.length - 1 === index) {
                    return (
                      <Card
                        key={index}
                        type="importantsPlus"
                        categoryImage={index}
                      />
                    );
                  } else {
                    return (
                      <Card
                        key={index}
                        type="importants"
                        categoryImage={index}
                        boolHelper={true}
                      />
                    );
                  }
                })}
              </ScrollView>
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
                style={HomeStyles.importantProjectScrollView}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {interestingProjectList.map((x, index) => {
                  if (interestingProjectList.length - 1 === index) {
                    return (
                      <Card
                        key={index}
                        type="interestingPlus"
                        categoryImage={index}
                      />
                    );
                  } else {
                    return (
                      <Card
                        key={index}
                        type="interesting"
                        categoryImage={index}
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
                showsHorizontalScrollIndicator={false}>
                {organizationList.map((x, index) => {
                  if (organizationList.length - 1 === index) {
                    return (
                      <Card
                        key={index}
                        type="organizationPlus"
                        categoryImage={index}
                      />
                    );
                  } else {
                    return (
                      <Card
                        key={index}
                        type="organization"
                        categoryImage={index}
                      />
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <View>
            {/* <FlatList
              contentContainerStyle={{
                alignSelf: 'center',
                // backgroundColor: 'red',
                width: '90%',
              }}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              // showsHorizontalScrollIndicator={false}
              data={newProjectList}
              renderItem={({item, index}) => {
                return (
                  <Card
                    key={index}
                    type="projectFound"
                    categoryImage={index}
                  />
                ); //aquí poner el plus
              }}
            /> */}
            <ScrollView
              style={{
                alignSelf: 'center',
                // backgroundColor: 'red',
                width: '90%',
              }}
              horizontal={false}
              showsHorizontalScrollIndicator={false}>
              {importantProjectList.map((x, index) => {
                if (importantProjectList.length - 1 === index) {
                  return (
                    <Card
                      key={index}
                      type="projectFound"
                      categoryImage={index}
                    />
                  );
                }
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>
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
          <FlatList
            contentContainerStyle={{
              alignSelf: 'center',
              backgroundColor: 'red',
              width: '90%',
            }}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={newProjectList}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'space-around',
                    alignItems: 'center',
                    // alignSelf: 'center',
                  }}>
                  <Text>index</Text>
                  <Checkbox
                    status={'checked'}
                    onPress={() => {
                      console.log(item);
                    }}
                  />
                </View>
              ); //aquí poner el plus
            }}
          />
        </View>
      )}
    </View>
    // </SafeAreaView>
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
    height: RFPercentage(38),
  },
  importantProjectScrollView: {
    marginHorizontal: 24,
    height: Size.globalHeight / 4,
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
    marginBottom: RFPercentage(7),
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
    borderWidth: 1,
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
    paddingVertical: '5%',
  },
});
