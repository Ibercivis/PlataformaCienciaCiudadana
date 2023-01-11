import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';

import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Modal,
  Paragraph,
  Portal,
  TextInput,
  Title,
} from 'react-native-paper';
import {globalStyles} from '../theme/theme';
import {useForm} from '../hooks/useForm';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Mark} from '../interfaces/appInterfaces';
import {StackParams} from '../navigation/ProjectNavigator';
import {Colors} from '../theme/colors';

interface Props extends StackScreenProps<StackParams, 'Marcador'> {}

const maxWidth = Dimensions.get('screen').width;

export const Marcador = ({route, navigation}: Props) => {
  const {projectName, description, photo, marks: markas, onBack} = route.params;
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedMark, setSelectedMark] = useState<Mark>({
    name: '',
    type: '',
    ask: '',
    description: '',
  });
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const {form, setState, onChange, clear} = useForm<Mark>({
    name: '',
    type: '',
    ask: '',
    description: '',
  });

  const [visible, setVisible] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(false);

  useEffect(() => {
    if (onBack) {
      if (markas) {
        setMarks(markas);
      }
    } else {
      setMarks([]);
    }
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const showDialog = () => {
    setVisibleAlert(true);
  };

  const hideDialog = () => setVisibleAlert(false);

  const newMark = () => {
    setIsEdit(false);
    clear();
    showModal();
  };

  const addAsk = () => {
    if (!isEdit) {
      setMarks([...marks, form]);
    } else {
      //primero se coge el que se va a editar del array y su posicion
      //segundo se copia lo del form a esa posicion

      //copia del array
      const arrayCopy = [...marks];
      //posicion de la marca a editar
      const index = marks.indexOf(selectedMark);
      const updated = marks.map((x, i) => {
        if (i === index) {
          x = form;
          return x;
        } else {
          return x;
        }
      });
      setMarks(updated);
    }
    hideModal();
  };

  const showMark = (item: Mark) => {
    setIsEdit(true);
    setState(item);
    setSelectedMark(item);
    showModal();
  };

  const removeMark = (item: Mark) => {
    const arrayCopy = [...marks];
    const index = marks.indexOf(item);
    if (index !== -1) {
      arrayCopy.splice(index, 1);
      setMarks(arrayCopy);
    }
  };
  const duplicate = (item: Mark) => {
    setMarks([...marks, item]);
  };

  const onSelectType = (value: string = '') => {
    onChange(value, 'type')
  }

  const nextScreen = () => {
    if (marks.length > 0) {
      console.log(marks)
      navigation.navigate('MarcadorExample', {
        projectName,
        description,
        photo,
        marks,
      });
    } else {
      showDialog();
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>MARCADORES</Text>
          {marks.length > 0 &&
            marks.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  width: maxWidth,
                }}>
                <TouchableOpacity
                  style={styles.mark}
                  onPress={() => showMark(item)}>
                  <Text style={styles.text}>Nombre:</Text>
                  <Text style={{}}>{item.name}</Text>
                  <Text style={styles.text}>Pregunta:</Text>
                  <Text style={{}}>{item.ask}</Text>
                </TouchableOpacity>
                {/* <Card
                  style={{
                    marginVertical: 10,
                    width: '80%',
                    marginHorizontal: 10,
                    flex:1,
                    
                  }}
                  mode="elevated">
                  <Card.Content style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Title>{item.name}</Title>
                    <Paragraph>{item.ask}</Paragraph>
                  </Card.Content>
                </Card> */}
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <IconButton
                    icon="delete"
                    iconColor="black"
                    size={25}
                    style={{
                      marginRight: 20,
                      alignSelf: 'center',
                      // justifyContent: 'flex-end', alignItems: 'flex-end'
                    }}
                    onPress={() => removeMark(item)}
                  />
                  <IconButton
                    icon="content-duplicate"
                    iconColor="black"
                    size={25}
                    style={{
                      marginRight: 20,
                      alignSelf: 'center',
                      // justifyContent: 'flex-end', alignItems: 'flex-end'
                    }}
                    onPress={() => duplicate(item)}
                  />
                </View>
              </View>
            ))}
          <IconButton
            icon="plus-circle-outline"
            iconColor="black"
            style={{alignSelf: 'center',  backgroundColor: 'transparent', width: 50, height: 50, marginTop: 20}}
            size={50}
            onPress={() => newMark()}
          />
        </ScrollView>
        <View style={styles.bottomViewButton}>
          <Button
            style={styles.button}
            icon="chevron-left"
            mode="elevated"
            // contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            onPress={() => navigation.navigate('NewProjectScreen', {marks})}>
            Volver
          </Button>
          <Button
            style={{...styles.button, right: 0}}
            icon="chevron-right"
            mode="elevated"
            contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            onPress={() => nextScreen()}>
            Siguiente
          </Button>
        </View>
      </KeyboardAvoidingView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={styles.modalStyle}>
          <ScrollView
            style={{paddingVertical: 20}}
            showsVerticalScrollIndicator={false}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#2F3061',
                borderColor: '#2F3061',
                marginVertical: 20,
              }}>
              Nueva marca
            </Text>
            <TextInput
              style={{
                marginHorizontal: 15,
                borderRadius: 1,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
                // marginTop: 20,
              }}
              label="Nombre del marcador"
              autoCorrect={false}
              autoCapitalize="none"
              underlineColor="#B9E6FF"
              activeOutlineColor="#5C95FF"
              selectionColor="#2F3061"
              textColor="#2F3061"
              outlineColor="#5C95FF"
              autoFocus={true}
              dense={true}
              value={form.name}
              onChangeText={value => onChange(value, 'name')}
            />
            <TextInput
              style={{
                margin: 15,
                borderRadius: 1,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
              }}
              label="Pregunta"
              autoCorrect={false}
              autoCapitalize="none"
              underlineColor="#B9E6FF"
              activeOutlineColor="#5C95FF"
              selectionColor="#2F3061"
              textColor="#2F3061"
              outlineColor="#5C95FF"
              multiline={true}
              numberOfLines={2}
              dense={true}
              value={form.ask}
              onChangeText={value => onChange(value, 'ask')}
            />
            <Picker
              selectedValue={form.type}
              placeholder="Tipo de dato"
              onValueChange={(itemValue, itemIndex) =>
                onSelectType(itemValue)
              }>
              <Picker.Item label="Texto" value="string" />
              <Picker.Item label="Número" value="number" />
              <Picker.Item label="Fotografía" value="photo" />
            </Picker>
            <TextInput
              style={{
                margin: 15,
                borderRadius: 1,
                borderTopEndRadius: 10,
                borderTopStartRadius: 10,
              }}
              label="Descripción"
              autoCorrect={false}
              autoCapitalize="none"
              underlineColor="#B9E6FF"
              activeOutlineColor="#5C95FF"
              selectionColor="#2F3061"
              textColor="#2F3061"
              outlineColor="#5C95FF"
              multiline={true}
              numberOfLines={4}
              dense={true}
              value={form.description}
              onChangeText={value => onChange(value, 'description')}
            />
          </ScrollView>
          <Button style={styles.buttonModal} onPress={addAsk}>
            Guardar
          </Button>
          <Button style={styles.buttonModal} onPress={hideModal}>
            Cancelar
          </Button>
        </Modal>
      </Portal>

      <Portal>
        <Dialog visible={visibleAlert} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{alignSelf: 'center'}}>
            Error de creación
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>Se requiere añadir al menos una marca</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F3061',
    borderBottomWidth: 1,
    borderColor: '#2F3061',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomViewButton: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: 110,
  },
  modalStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
    marginHorizontal: 20,
    // paddingTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  buttonModal: {
    marginVertical: 5,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  mark: {
    // borderWidth: 1,
    borderRadius: 30,
    borderColor: 'black',
    padding: 5,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginLeft: 10,
    width: maxWidth - 110,
    backgroundColor: 'white',
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
