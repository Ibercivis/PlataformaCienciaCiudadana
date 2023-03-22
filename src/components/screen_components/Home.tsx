import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../theme/theme';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Animated,
} from 'react-native';
import {Projects, HasTag, Topic} from '../../interfaces/appInterfaces';
import {
  Searchbar,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Modal,
} from 'react-native-paper';
import {fonts, FontSize} from '../../theme/fonts';
import {Size} from '../../theme/size';
import {IconTemp} from '../../components/IconTemp';
import citmapApi from '../../api/citmapApi';
import {Colors} from '../../theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LoadingScreen} from '../../screens/LoadingScreen';
import {AnimatedFab} from '../AnimatedFab';
import {CustomButton} from '../CustomButton';

import {SpeedDial} from '@rneui/themed';
import { StatusBar } from 'react-native';

interface Props extends StackScreenProps<any, any> {}

export const Home = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {top} = useSafeAreaInsets();

  const onChangeSearch = (query: SetStateAction<string>) =>
    setSearchQuery(query);

  // speeddial

  const [open, setOpen] = useState(false);
  const speedDialRef = useRef().current;

  // proyectos sin y con filtro
  const [project, setProject] = useState<Projects[]>([]);
  const [projectAll, setProjectAll] = useState<Projects[]>([]);
  const [projectFiltered, setProjectFiltered] = useState<Projects[]>([]);

  // tags
  const [hasTag, setHasTag] = useState<HasTag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  //filtros
  const [hasTagToFilter, setHasTagToFilter] = useState<number>(0);
  const [lastHastagFilter, setLastHastagFilter] = useState<number>(0);
  const [topicToFilter, setTopicToFilter] = useState<number>(0);
  const [lastTopicFilter, setLastTopicFilter] = useState<number>(0);

  // proyecto seleccionado
  const [selected, setSelected] = useState<Projects>();

  // boolean controladores. Si está filtrado, si el modal es visible, si está actualizando, si ha cargado todo
  const [isFilteredHastag, setIsFilteredHastag] = useState(false);
  const [isFilteredTopic, setIsFilteredTopic] = useState(false);
  /**
   * true HASTAG, false topic
   */
  const [filterType, setFilterType] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAllCharged, setIsAllCharged] = useState(false);

  // id del creador
  const [creator, setCreator] = useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  //prueba boton animado
  const animation = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.spring(animation, {
      toValue: 1.2,
      friction: 2,
      tension: 60,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    navigation.navigate('NewProjectScreen', []);
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    StatusBar.setHidden(true)
    setHasTagToFilter(0);
    setLastHastagFilter(0);
    setTopicToFilter(0);
    setProject([]);
    setProjectAll([]);
    getData();
    getCreator();
    getHasTag();
    getTopics();
    setRefreshing(false);
  }, [refreshing]);

  //espera a que cambie el valor numerico del id del hastag por el que filtrar para así cambiar el del isFiltered
  useEffect(() => {
    setIsFilteredHastag(!isFilteredHastag);
  }, [hasTagToFilter]);

  useEffect(() => {
    setIsFilteredTopic(!isFilteredTopic);
  }, [topicToFilter]);

  // si isfiltered, se limpian los proyectos para luego rellenarlos
  useEffect(() => {
    console.log('HASTAG');
    console.log(isFilteredHastag);
    console.log(isFilteredTopic);
    if (isFilteredHastag && !isFilteredTopic) {
      console.log('entra para limpiar los proyectos en hastag');
      setProject([]);
    }
  }, [isFilteredHastag]);

  useEffect(() => {
    console.log('TOPIC');
    console.log(isFilteredHastag);
    console.log(isFilteredTopic);
    if (!isFilteredHastag && isFilteredTopic) {
      console.log('entra para limpiar los proyectos en topic');
      setProject([]);
    }
  }, [isFilteredTopic]);

  // si isFiltered y se han limpiado los proyectos, se llamará a la función que llena de nuevo los proyectos filtrados
  useEffect(() => {
    if (isFilteredHastag) setProjectByTag(hasTagToFilter);
    if (isFilteredTopic) setProjectByTopic(topicToFilter);
  }, [project]);

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      // const jsonValue = await AsyncStorage.getItem('projects');
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
      const resp = await citmapApi.get('/projects/', {
        headers: {
          Authorization: token,
        },
      });
      if (resp.data) {
        setProject(resp.data);
        setProjectAll(resp.data);
      }
      setIsAllCharged(true);
    } catch (e) {
      console.log('error get projects ' + e);
      getData();
    }
  };

  const getHasTag = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/project/hastag/', {
        headers: {
          Authorization: token,
        },
      });
      if (resp.data) {
        setHasTag(resp.data);
      }
    } catch (e) {
      console.log('error hastag ' + e);
      getHasTag();
    }
  };

  const getTopics = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/project/topics/', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      if (resp.data) {
        setTopics(resp.data);
      }
    } catch (e) {
      console.log('error topic ' + e);
      getTopics();
    }
  };

  const getCreator = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/authentication/user/', {
        headers: {
          Authorization: token,
        },
      });
      const data = parseInt(JSON.stringify(resp.data.pk, null, 1));
      const filtered = project.filter(x => x.creator === creator);
      setCreator(data);
    } catch (err) {
      console.log('creator not selected');
    }
  };

  /**
   * Metodo que devuelve tags de tipo Hastag
   * @param ids array con los id por los cuales se filtrará
   * @returns tags HasTag
   */
  const showHastagFull = (ids: number[]) => {
    let hastags: HasTag[] = [];
    ids.map(x => {
      hasTag.map(y => {
        if (y.id === x) {
          hastags.push(y);
        }
      });
    });

    if (hastags.length > 0) {
      return (
        <>
          {hastags.map((x, index) => (
            <View
              style={{
                marginVertical: '2%',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              key={index}>
              {hasTagToFilter === x.id ? (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.tags,
                    backgroundColor: Colors.lightorange,
                    marginVertical: '2%',
                    marginRight: '2%',
                    alignItems: 'baseline',
                  }}
                  onPress={() => {
                    setHasTagToFilter(0);
                    setLastHastagFilter(0);
                  }}>
                  <View style={{marginHorizontal: '5%'}}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontStyle: 'italic',
                        fontSize: FontSize.fontSizeTextMin,
                      }}>
                      {x.hasTag}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.tags,
                    marginVertical: '2%',
                    marginRight: '2%',
                    alignItems: 'baseline',
                  }}
                  onPress={() => {
                    setHasTagToFilter(x.id);
                  }}>
                  <View style={{marginHorizontal: 15}}>
                    <Text
                      style={{
                        color: Colors.darkorange,
                        fontStyle: 'italic',
                        fontSize: FontSize.fontSizeTextMin,
                      }}>
                      {x.hasTag}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      );
    } else {
      return <Paragraph>Nothing</Paragraph>;
    }
  };

  /**
   * Metodo que devuelve tags de tipo Topic
   * @param ids array con los id por los cuales se filtrará
   * @returns tags Topics
   */
  const showTopicsFull = (ids: number[]) => {
    let topico: Topic[] = [];
    ids.map(x => {
      topics.map(y => {
        if (y.id === x) {
          topico.push(y);
        }
      });
    });

    if (topico.length > 0) {
      return (
        <>
          {topico.map((x, index) => (
            <View
              style={{
                marginVertical: '2%',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              key={index}>
              {topicToFilter === x.id ? (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.tags,
                    backgroundColor: Colors.lightblue,
                    marginVertical: '2%',
                    marginRight: '2%',
                    alignItems: 'baseline',
                  }}
                  onPress={() => {
                    setTopicToFilter(0);
                    setLastTopicFilter(0);
                  }}>
                  <View style={{marginHorizontal: '2%'}}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontStyle: 'italic',
                        fontSize: FontSize.fontSizeTextMin,
                      }}>
                      {x.topic}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.tags,
                    marginVertical: '1%',
                    marginRight: '2%',
                    alignItems: 'baseline',
                  }}
                  onPress={() => {
                    setTopicToFilter(x.id);
                  }}>
                  <View style={{marginHorizontal: 15}}>
                    <Text
                      style={{
                        color: Colors.lightblue,
                        fontStyle: 'italic',
                        fontSize: FontSize.fontSizeTextMin,
                      }}>
                      {x.topic}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      );
    } else {
      return <Paragraph>Sin topics</Paragraph>;
    }
  };

  /**
   * hace una actualización de los proyectos
   */
  const onRefresh = () => {
    setRefreshing(true);
    setProject(projectAll);
    setIsFilteredHastag(false);
    setHasTagToFilter(0);
    setTopicToFilter(0);
  };

  /**
   * Método que filtra por el id pasado HASTAG. Si no tiene con qué filtrar, establece todos los pryectos de nuevo
   * @param id number por el cual se filtrará un proyecto
   */
  const setProjectByTag = (id: number) => {
    if (hasTagToFilter > 0) {
      // si el ultimo filtrado es diferente del nuevo y el ultimo es diferente de 0, significa que se está intentando filtrar por otro nuevo
      if (lastHastagFilter !== id && lastHastagFilter !== 0) {
        let newProject: Projects[] = [];
        projectFiltered.map(x => {
          x.hasTag.map(y => {
            if (y === id) {
              newProject.push(x);
            }
          });
        });
        setProject(newProject);
        setIsFilteredHastag(false);
      } else {
        let newProject: Projects[] = [];
        projectAll.map(x => {
          x.hasTag.map(y => {
            if (y === id) {
              // setProject([...project, x]);
              newProject.push(x);
              // console.log('id ' + id + ' es igual a ' + x.hasTag);
            }
          });
        });
        setProject(newProject);
        setIsFilteredHastag(false);
        setProjectFiltered(newProject);
        setLastHastagFilter(id);
      }
    } else {
      setIsFilteredHastag(false);
      setProject(projectAll);
      setHasTagToFilter(0);
    }
  };

  /**
   * Método que filtra por el id pasado TOPIC. Si no tiene con qué filtrar, establece todos los pryectos de nuevo
   * @param id number por el cual se filtrará un proyecto
   */
  const setProjectByTopic = (id: number) => {
    if (topicToFilter > 0) {
      // si el ultimo filtrado es diferente del nuevo y el ultimo es diferente de 0, significa que se está intentando filtrar por otro nuevo
      if (lastTopicFilter !== id && lastTopicFilter !== 0) {
        let newProject: Projects[] = [];
        projectFiltered.map(x => {
          x.topic.map(y => {
            if (y === id) {
              newProject.push(x);
            }
          });
        });
        setProject(newProject);
        setIsFilteredTopic(false);
      } else {
        let newProject: Projects[] = [];
        projectAll.map(x => {
          x.topic.map(y => {
            if (y === id) {
              // setProject([...project, x]);
              newProject.push(x);
              // console.log('id ' + id + ' es igual a ' + x.hasTag);
            }
          });
        });
        setProject(newProject);
        setIsFilteredTopic(false);
        setProjectFiltered(newProject);
        setLastTopicFilter(id);
      }
    } else {
      setIsFilteredTopic(false);
      setProject(projectAll);
      setTopicToFilter(0);
    }
  };

  /**
   * Método que establece el Speed Dial a false y redirige a la ruta seleccionada.
   * @param nav number que indicará la ruta a tomar ( 1 nuevo proyecto, 2 nueva organización )
   */
  const onSpeedDialPress = (nav: number) => {
    switch (nav) {
      case 1:
        setOpen(!open);
        navigation.navigate('NewProjectScreen', []);
        break;

      case 2:
        setOpen(!open);
        navigation.navigate('OrganisationScreen');
        break;
    }
  };

  if (!isAllCharged) {
    return <LoadingScreen />;
  }
  /**
   * animación que se aplica al style de una Animated.View
   */
  const animatedStyle = {
    transform: [{scale: animation}],
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          marginVertical: 0,
          marginTop: refreshing ? top : 0,
        }}>
        <Searchbar
          style={{marginBottom: 10}}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        {project.length > 0 &&
          project.map((item, index) => (
            <Card
              style={{...globalStyles.globalMargin, marginVertical: '3%'}}
              mode="elevated"
              key={item.id}
              // onPress={() => {
              //   setSelected(item);
              //   showModal();
              // }}
            >
              <Card.Title
                title={item.name}
                // subtitle={item.creator}
                titleStyle={{
                  fontSize: FontSize.fontSizeText,
                  marginVertical: '5%',
                  alignSelf: 'center',
                  fontWeight: 'bold',
                }}
              />

              <Card.Cover
                style={{padding: 2, marginTop: '2%', marginHorizontal: '3%'}}
                source={{uri: 'https://picsum.photos/700'}}
              />
              <Card.Content style={{marginTop: '4%'}}>
                <Title>Descripcion</Title>
                <Paragraph style={{marginVertical: '2%'}}>
                  {item.description}
                </Paragraph>
              </Card.Content>
              {/* <Card.Content>{item.hasTag.map(x => showHastag(x))}</Card.Content> */}
              <Card.Content
                style={{
                  marginTop: '2%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {showHastagFull(item.hasTag)}
              </Card.Content>
              <Card.Content
                style={{
                  marginVertical: '2%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {showTopicsFull(item.topic)}
              </Card.Content>
              <Card.Actions style={{alignSelf: 'center'}}>
                {creator === item.creator ? (
                  <>
                    {/* <Button
                      labelStyle={{
                        ...styles.buttonModal,
                      }}
                      onPress={() =>
                        navigation.navigate('NewProjectScreen', {
                          projectName: item.name,
                          description: item.description,
                          hastag: item.hasTag,
                          topic: item.topic,
                          id: item.id,
                        })
                      }>
                      Editar
                    </Button> */}
                    <CustomButton
                      label={'Editar'}
                      onPress={() =>
                        navigation.navigate('NewProjectScreen', {
                          projectName: item.name,
                          description: item.description,
                          hastag: item.hasTag,
                          topic: item.topic,
                          id: item.id,
                        })
                      }
                    />
                    <CustomButton
                      label={'Borrar'}
                      onPress={() => showHastagFull(item.hasTag)}
                    />
                    {/* <Button
                      labelStyle={{
                        ...styles.buttonModal,
                      }}
                      onPress={() => showHastagFull(item.hasTag)}>
                      Borrar
                    </Button> */}
                  </>
                ) : (
                  // <Button
                  //   labelStyle={{
                  //     fontSize: FontSize.fontSizeText,
                  //   }}
                  //   onPress={() => navigation.navigate('NavigatorMapBox')}>
                  //   Participar
                  // </Button>
                  <CustomButton
                    label={'Participar'}
                    onPress={() => navigation.navigate('NavigatorMapBox')}
                  />
                )}
              </Card.Actions>
            </Card>
          ))}
      </ScrollView>
      <SpeedDial
        ref={speedDialRef}
        transitionDuration={200}
        color={Colors.primary}
        isOpen={open}
        icon={{name: 'plus', type: 'material-community', color: '#fff'}}
        openIcon={{name: 'close', type: 'material-community', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          color={Colors.primary}
          icon={{
            name: 'database-plus',
            type: 'material-community',
            color: '#fff',
          }}
          title="Nuevo proyecto"
          onPress={() => {onSpeedDialPress(1)}}
        />
        <SpeedDial.Action
          color={Colors.primary}
          icon={{name: 'domain', type: 'material-community', color: '#fff'}}
          title="Nueva organización"
          onPress={() => {onSpeedDialPress(2)}}
        />
      </SpeedDial>
      {/* <IconButtonTemp
        style={styles.viewButtonModalAdd}
        name="plus-circle-outline"
        size={Size.iconSizeExtraLarge}
        onPress={() => navigation.navigate('NewProjectScreen', [])}
      /> */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={styles.modalStyle}>
          <ScrollView
            style={{paddingVertical: 20, margin: 20, borderRadius: 30}}
            showsVerticalScrollIndicator={false}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: FontSize.fontSizeText,
                fontWeight: 'bold',
                color: '#2F3061',
                borderColor: '#2F3061',
                marginVertical: 20,
              }}>
              {selected?.name}
            </Text>
          </ScrollView>
          <Button style={styles.buttonModal} onPress={() => console.log()}>
            Editar
          </Button>
          <Button style={styles.buttonModal} onPress={hideModal}>
            Cancelar
          </Button>
        </Modal>
      </Portal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  modalStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    marginHorizontal: 20,
    // paddingTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  buttonModal: {
    fontSize: FontSize.fontSizeText,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  viewButtonModalAdd: {
    bottom: Size.window.width * 0.05,
    right: Size.window.width * 0.05,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  tags: {
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  item: {
    // padding: '3%',
    // marginHorizontal: '3%',
    flexDirection: 'row',
    // alignItems: 'flex-start',
    // justifyContent: 'space-between',
  },
});
