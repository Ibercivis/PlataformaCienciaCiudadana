import React, {SetStateAction, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalStyles} from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Project} from '../interfaces/appInterfaces';
import {
  Searchbar,
  Button,
  Card,
  Title,
  Paragraph,
  AnimatedFAB,
  Portal,
  Modal,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import {FontSize} from '../theme/fonts';
import {Size} from '../theme/size';

interface Props extends StackScreenProps<any, any> {}

const height = Size.globalHeight > 720 ? 80 : 50;
const iconSize = Size.globalWidth > 500 ? 70 : 40;

export const HomeScreen = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: SetStateAction<string>) =>
    setSearchQuery(query);

  const [isExtended, setIsExtended] = useState(true);
  const [project, setProject] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project>();

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setProject([]);
    getData().then(x => {
      if (x) {
        setProject([...project, x]);
      }
    });
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('projects');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

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
              key={index}
              onPress={() => {
                setSelected(item);
                showModal();
                console.log(selected);
              }}>
              <Card.Title
                title={item.projectName}
                subtitle="creador"
                titleStyle={{fontSize: FontSize.fontSize}}
                left={() => (
                  <Icon
                    style={globalStyles.icons}
                    name="arrow-back"
                    size={25}
                    color="#5C95FF"
                  />
                )}
              />
              <Card.Content>
                <Title>Descripcion</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              <Card.Cover
                style={{padding: 2}}
                source={{uri: 'https://picsum.photos/700'}}
              />
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
      {/* <AnimatedFAB
        icon={'plus'}
        label={'Nuevo proyecto'}
        extended={isExtended}
        onPress={() => navigation.navigate('NewProjectScreen', [])}
        visible={true}
        animateFrom={'right'}
        iconMode={'dynamic'}
        style={[styles.fabStyle]}
      /> */}
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
            <Image
              source={require('../assets/icons/add.png')}
              style={{
                width: iconSize + 20,
                height: iconSize + 20,
                borderRadius: 50,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* <IconButton
      style={{bottom: 16, right: 16, position: 'absolute', backgroundColor: 'grey'}}
        icon="plus"
        
        iconColor={'black'}
        size={iconSize}
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
              {selected?.projectName}
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
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
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
    bottom: 16,
    right: 16,
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
