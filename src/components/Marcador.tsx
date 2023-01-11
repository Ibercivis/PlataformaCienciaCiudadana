import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';

import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Dimensions,
  TextInput as RNTextInput,
  Image,
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
import {FontSize} from '../theme/fonts';
import {Keyboard} from 'react-native';

interface Props extends StackScreenProps<StackParams, 'Marcador'> {}

const maxWidth = Dimensions.get('screen').width;
const window = Dimensions.get('window');
const height = window.width > 500 ? 80 : 50;
const iconSize = window.width > 500 ? 60 : 30;
const iconSizeFab = window.width > 500 ? 50 : 20;

export const Marcador = ({route, navigation}: Props) => {
  const {projectName, description, photo, marks: markas, onBack} = route.params;
  const [marks, setMarks] = useState<Mark[]>([]);
  const [markType, setMarkType] = useState('');
  const [selectedMark, setSelectedMark] = useState<Mark>({
    name: '',
    type: '',
    ask: '',
    description: '',
  });
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const projectNameRef = useRef<RNTextInput>(null);
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

  const newMark = (type: string) => {
    setMarkType(type);
    setIsEdit(false);
    setSelectedMark({ name: '',
    type: '',
    ask: '',
    description: '',})
    clear();
    showModal();
  };

  const addAsk = () => {
    if (!isEdit) {
      form.type = markType;
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
    onChange(value, 'type');
  };

  const nextScreen = () => {
    if (marks.length > 0) {
      console.log(marks);
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

  const onClearInput = async () => {
    console.log('clear');
    Keyboard.dismiss();
    projectNameRef.current!.clear();
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>MARCADOR</Text>
          {marks.length > 0 ? (
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
                  <Text style={styles.text}>Pregunta:</Text>
                  <Text style={{}}>{item.ask}</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row',}}>
                  <IconButton
                    icon="delete"
                    iconColor="black"
                    size={25}
                    style={{
                      // marginRight: 20,
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
                      alignSelf: 'center',
                      // justifyContent: 'flex-end', alignItems: 'flex-end'
                    }}
                    onPress={() => duplicate(item)}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text
              style={{...styles.text, alignSelf: 'center', marginBottom: 20}}>
              Seleccione el tipo{' '}
            </Text>
          )}
        </ScrollView>
        {/* <View style={{ ...styles.bottomViewButton}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => newMark()}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: 'grey',
              borderRadius: 50,
              position: 'absolute',
              bottom: 0,
              // left: -100
            }}>
            <Image
              source={require('../assets/icons/plus.png')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View> */}

        {/* buttons screen */}
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

        {/* add text */}
        <View
          style={{
            position: 'absolute',
            bottom: 210,
            right: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'grey',
            borderRadius: 50,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => newMark('string')}>
            <Image
              source={require('../assets/icons/text-type.png')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
        {/* add number */}
        <View
          style={{
            position: 'absolute',
            bottom: 140,
            right: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'grey',
            borderRadius: 50,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => newMark('number')}>
            <Image
              source={require('../assets/icons/number-type.png')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
        {/* add photo */}
        <View
          style={{
            position: 'absolute',
            bottom: 70,
            right: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'grey',
            borderRadius: 50,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => newMark('photo')}>
            <Image
              source={require('../assets/icons/photo-type.png')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={styles.modalStyle}>
          <View>
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
              <View
                style={{
                  flexDirection: 'row',
                  // width: window.width - 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  ref={projectNameRef}
                  style={{
                    ...styles.textInput,
                  }}
                  placeholder="Pregunta"
                  mode="flat"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => onChange(value, 'ask')}
                  underlineColor="#B9E6FF"
                  activeOutlineColor="#5C95FF"
                  selectionColor="#2F3061"
                  textColor="#2F3061"
                  outlineColor={Colors.lightorange}
                  autoFocus={false}
                  dense={false}
                  defaultValue={selectedMark.ask}
                />
              </View>
              {isEdit && (
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
              )}

              <View
                style={{
                  flexDirection: 'row',
                  // width: window.width - 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  ref={projectNameRef}
                  style={{
                    ...styles.textInput,
                  }}
                  placeholder="Descripción de la pregunta"
                  mode="flat"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={value => onChange(value, 'description')}
                  underlineColor="#B9E6FF"
                  activeOutlineColor="#5C95FF"
                  selectionColor="#2F3061"
                  textColor="#2F3061"
                  outlineColor={Colors.lightorange}
                  autoFocus={false}
                  dense={false}
                  defaultValue={selectedMark.description}
                />
              </View>
            </ScrollView>
            <Button style={styles.buttonModal} onPress={addAsk}>
              Guardar
            </Button>
            <Button style={styles.buttonModal} onPress={hideModal}>
              Cancelar
            </Button>
          </View>
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
    marginBottom: 15,
    marginHorizontal: 20,
    // paddingTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  buttonModal: {
    marginVertical: 5,
    color: Colors.lightorange,
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
    width: maxWidth - 150,
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
  textInput: {
    width: window.width > 500 ? window.width - 150 : window.width - 80,
    // height: height,
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: 25,
    paddingBottom: 0,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: Colors.lightorange,
    fontSize: FontSize.fontSizeText,
  },
});
