import {StackScreenProps} from '@react-navigation/stack';
import React, {SetStateAction, useEffect, useState} from 'react';
import {
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
import { Projects, HasTag } from '../../interfaces/appInterfaces';
import {FontSize} from '../../theme/fonts';
import {Size} from '../../theme/size';
import {IconTemp} from '../IconTemp';
import { globalStyles } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props extends StackScreenProps<any, any> {}

export const MyProjects = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: SetStateAction<string>) =>
    setSearchQuery(query);

  const [project, setProject] = useState<Projects[]>([]);
  const [hasTag, setHasTag] = useState<HasTag[]>([]);
  const [selected, setSelected] = useState<Projects>();

  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  const showModal = () => setVisibleDelete(true);
  const hideModal = () => setVisibleDelete(false);

  useEffect(() => {
    setProject([]);
    getHasTag();
    getData();
  }, []);

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/projects/', {
        headers: {
          Authorization: token,
        },
      });
      if(resp.data){
        setProject(resp.data)
      }
    } catch (e) {
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
      if(resp.data){
        setHasTag(resp.data)
      }
    } catch (e) {
      console.log('error hastag')
    }
  }

  const showHastag = (id: number) => {
    const data = hasTag.find(x => x.id === id);
    if(data){
      return (<Paragraph key={id}>{data?.hasTag}</Paragraph>)
    }else{
      return (<Paragraph>Nothing</Paragraph>)
    }
    
  }
  
  return (
    <>
      <ScrollView
        style={{flex: 1, backgroundColor: 'transparent', marginVertical: 10}}>
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
                // right={() => (
                //   item.hasTag.map(x => 
                //     showHastag(x)
                //   )
                //   )}
              />
              
              <Card.Cover
                style={{padding: 2, marginTop: '2%'}}
                source={{uri: 'https://picsum.photos/700'}}
              />
              <Card.Content>
                <Title>Descripcion</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              <Card.Actions style={{alignSelf: 'center'}}>
                <Button
                  labelStyle={{
                    fontSize: FontSize.fontSizeText,
                    paddingTop: Size.globalHeight > 720 ? 10 : 0,
                  }}
                  onPress={() => console.log('a1')}>
                  Participar
                </Button>
              </Card.Actions>
            </Card>
          ))}
      </ScrollView>

      {/* botón para añadir nuevo proyecto  */}
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

      {/* modal para editar o borrar, confirmacion */}
      <Portal>
        <Modal
          visible={visibleDelete}
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
              ¿ Desea eliminar el proyecto ?
            </Text>
          </ScrollView>
          <Button style={styles.buttonModal} onPress={() => console.log()}>
            Confirmar
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
});
