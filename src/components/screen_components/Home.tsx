import React, {SetStateAction, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../../theme/theme';
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

interface Props extends StackScreenProps<any, any> {}

export const Home = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {top} = useSafeAreaInsets();

  const onChangeSearch = (query: SetStateAction<string>) =>
    setSearchQuery(query);

  const [project, setProject] = useState<Projects[]>([]);
  const [projectAll, setProjectAll] = useState<Projects[]>([]);
  const [projectFiltered, setProjectFiltered] = useState<Projects[]>([]);

  const [hasTag, setHasTag] = useState<HasTag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  //filtros
  const [hasTagToFilter, setHasTagToFilter] = useState<number>(0);
  const [lastHastagFilter, setLastHastagFilter] = useState<number>(0);
  const [topicToFilter, setTopicToFilter] = useState<number>(0);
  const [lastTopicFilter, setLastTopicFilter] = useState<number>(0);

  const [selected, setSelected] = useState<Projects>();

  const [isFiltered, setIsFiltered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [creator, setCreator] = useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setHasTagToFilter(0);
    setLastHastagFilter(0);
    setTopicToFilter(0);
    getData();
    getCreator();
    setProject([]);
    setProjectAll([]);
    getHasTag();
    getTopics();
    setRefreshing(false);
  }, [refreshing]);

  //espera a que cambie el valor numerico del id del hastag por el que filtrar para así cambiar el del isFiltered
  useEffect(() => {
    setIsFiltered(!isFiltered);
  }, [hasTagToFilter, topicToFilter]);

  // si isfiltered, se limpian los proyectos para luego rellenarlos
  useEffect(() => {
    if (isFiltered) {
      setProject([]);
    }
  }, [isFiltered]);

  // si isFiltered y se han limpiado los proyectos, se llamará a la función que llena de nuevo los proyectos filtrados
  useEffect(() => {
    if (isFiltered) setProjectByTag(hasTagToFilter);
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

  const showHastag = (id: number) => {
    const data = hasTag.find(x => x.id === id);
    if (data) {
      return (
        <Paragraph
          style={{backgroundColor: Colors.lightorange, borderRadius: 50}}
          key={id}>
          {data?.hasTag}
        </Paragraph>
      );
    } else {
      return <Paragraph>Nothing</Paragraph>;
    }
  };

  const showHastagFull = (ids: number[]) => {
    let data = '';
    let hastags: HasTag[] = [];
    ids.map(x => {
      data = hasTag.find(y => y.id === x)?.hasTag + ' ' + data;
    });
    ids.map(x => {
      hasTag.map(y => {
        if (y.id === x) {
          hastags.push(y);
        }
      });
    });

    if (hastags.length > 0) {
      return (
        // <Paragraph
        //   style={{
        //     fontSize: FontSize.fontSizeTextMin,
        //     color: Colors.darkorange,
        //   }}>
        //   {data}
        // </Paragraph>

        <>
          {hastags.map(x => (
            <>
              {hasTagToFilter === x.id ? (
                <TouchableOpacity
                  key={x.id}
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
                  <View style={{marginHorizontal: '2%'}}>
                    <Text
                      style={{
                        color: Colors.primary,
                        fontStyle: 'italic',
                      }}>
                      {x.hasTag}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={x.id}
                  style={{
                    ...styles.tags,
                    marginVertical: '1%',
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
                      }}>
                      {x.hasTag}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          ))}
        </>
      );
    } else {
      return <Paragraph>Nothing</Paragraph>;
    }
  };

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
        // <Paragraph
        //   style={{fontSize: FontSize.fontSizeTextMin, color: Colors.lightblue}}>
        //   {data}
        // </Paragraph>
        <>
          {topico.map(x => (
            <TouchableOpacity
              key={x.id}
              style={{
                ...styles.tags,
                marginVertical: '1%',
                marginRight: '2%',
                alignItems: 'baseline',
              }}
              onPress={() => console.log(x)}>
              <View style={{marginHorizontal: 15}}>
                <Text
                  style={{
                    color: Colors.lightblue,
                    fontStyle: 'italic',
                  }}>
                  {x.topic}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      );
    } else {
      return <Paragraph>Sin topics</Paragraph>;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setProject(projectAll);
    setIsFiltered(false);
    setHasTagToFilter(0);
  };

  const setProjectByTag = (id: number) => {
    console.log(
      'hastagToFilter ' +
        hasTagToFilter +
        ' lastHastagFilter ' +
        lastHastagFilter,
    );
    console.log(JSON.stringify(project, null, 2));
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
        setIsFiltered(false);
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
        setIsFiltered(false);
        setProjectFiltered(newProject);
        setLastHastagFilter(id);
      }
    } else {
      setIsFiltered(false);
      setProject(projectAll);
      setHasTagToFilter(0);
    }

    // setProject(projectFiltered);
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
          marginVertical: 10,
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
              style={globalStyles.globalMargin}
              mode="elevated"
              key={index}
              // onPress={() => {
              //   setSelected(item);
              //   showModal();
              // }}
            >
              <Card.Title
                title={item.name}
                // subtitle={item.creator}
                titleStyle={{fontSize: FontSize.fontSizeText}}
                key={item.id}
                // left={() => (
                //   <Icon
                //     style={globalStyles.icons}
                //     name="arrow-back"
                //     size={25}
                //     color="#5C95FF"
                //   />
                // )}
              />

              <Card.Cover
                style={{padding: 2, marginTop: '2%'}}
                source={{uri: 'https://picsum.photos/700'}}
              />
              <Card.Content style={{marginVertical: '4%'}}>
                <Title>Descripcion</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              {/* <Card.Content>{item.hasTag.map(x => showHastag(x))}</Card.Content> */}
              <Card.Content
                style={{
                  marginVertical: '2%',
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
                    <Button
                      labelStyle={{
                        ...styles.buttonModal
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
                    </Button>
                    <Button
                      labelStyle={{
                        ...styles.buttonModal
                      }}
                      onPress={() => showHastagFull(item.hasTag)}>
                      Borrar
                    </Button>
                  </>
                ) : (
                  <Button
                    labelStyle={{
                      fontSize: FontSize.fontSizeText,
                    }}
                    onPress={() => navigation.navigate('NavigatorMapBox')}>
                    Participar
                  </Button>
                )}
              </Card.Actions>
            </Card>
          ))}
      </ScrollView>
      <View style={styles.viewButtonModalAdd}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('NewProjectScreen', [])}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconTemp name="plus-circle" size={Size.iconSizeExtraLarge} />
          </View>
        </TouchableOpacity>
      </View>
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
