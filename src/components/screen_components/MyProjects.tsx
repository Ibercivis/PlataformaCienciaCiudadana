import {StackScreenProps} from '@react-navigation/stack';
import React, {SetStateAction, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Searchbar,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Modal,
} from 'react-native-paper';
import citmapApi from '../../api/citmapApi';
import {Projects, HasTag, Topic} from '../../interfaces/appInterfaces';
import {FontSize} from '../../theme/fonts';
import {Size} from '../../theme/size';
import {IconTemp} from '../IconTemp';
import {globalStyles} from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props extends StackScreenProps<any, any> {}

export const MyProjects = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {top} = useSafeAreaInsets();

  const onChangeSearch = (query: SetStateAction<string>) =>
    setSearchQuery(query);

  const [project, setProject] = useState<Projects[]>([]);
  const [projectFiltered, setProjectFiltered] = useState<Projects[]>([]);
  const [hasTag, setHasTag] = useState<HasTag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<Projects>();

  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setProject([]);
    getHasTag();
    getTopics();
    getData();

    setRefreshing(false);
  }, [refreshing]);

  useEffect(() => {
    filterData();
  }, [project]);

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/projects/', {
        headers: {
          Authorization: token,
        },
      });
      if (resp.data) {
        setProject(resp.data);
      }
    } catch (e) {
      console.log('error get projects ' + e);
      getData();
    }
  };

  const filterData = async () => {
    const token = await AsyncStorage.getItem('token');
    let creator: number;
    try {
      const resp = await citmapApi.get('/authentication/user/', {
        headers: {
          Authorization: token,
        },
      });
      creator = parseInt(JSON.stringify(resp.data.pk, null, 1));
      const filtered = project.filter(x => x.creator === creator);
      setProjectFiltered(filtered);
    } catch (err) {
      console.log('creator not selected');
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
        <Paragraph style={styles.item}>
          {hastags.map(x => (
            <TouchableOpacity
              key={x.id}
              style={{...styles.tags}}
              onPress={() => console.log(x)}>
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
          ))}
        </Paragraph>
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
        <Paragraph style={styles.item}>
          {topico.map(x => (
            <TouchableOpacity
              key={x.id}
              style={{...styles.tags}}
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
        </Paragraph>
      );
    } else {
      return <Paragraph>Nothing</Paragraph>;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
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
        {projectFiltered.length > 0 &&
          projectFiltered.map((item, index) => (
            <Card
              style={globalStyles.globalMargin}
              mode="elevated"
              key={item.id}
              onPress={() => {
                setSelected(item);
                showModal();
              }}>
              <Card.Title
                title={item.name}
                subtitle={item.creator}
                titleStyle={{fontSize: FontSize.fontSizeText}}
                key={item.id}
                left={() => (
                  <Icon
                    style={globalStyles.icons}
                    name="arrow-back"
                    size={25}
                    color="#5C95FF"
                  />
                )}
              />

              <Card.Cover
                style={{padding: 2, marginTop: '2%'}}
                source={{uri: 'https://picsum.photos/700'}}
              />
              <Card.Content>
                <Title>Descripcion</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              {/* <Card.Content>{item.hasTag.map(x => showHastag(x))}</Card.Content> */}
              <Card.Content>{showHastagFull(item.hasTag)}</Card.Content>
              <Card.Content>{showTopicsFull(item.topic)}</Card.Content>
              <Card.Actions style={{alignSelf: 'center'}}>
                <Button
                  labelStyle={{
                    fontSize: FontSize.fontSizeText,
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
                    fontSize: FontSize.fontSizeText,
                  }}
                  onPress={() => showHastagFull(item.hasTag)}>
                  Borrar
                </Button>
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
    marginVertical: 5,
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
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginHorizontal: 10,
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
    // marginHorizontal: 10,
    flexDirection: 'row',
    // alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
