import React, {useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';

import {Picker} from '@react-native-picker/picker';
import {
  View,
  Button as ButtonNative,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  IconButton,
  Paragraph,
  Portal,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../../theme/theme';
import {useForm} from '../../hooks/useForm';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Mark} from '../../interfaces/appInterfaces';
import {StackParams} from '../../navigation/ProjectNavigator';
import {Colors} from '../../theme/colors';
import {fonts, FontSize} from '../../theme/fonts';
import {Keyboard} from 'react-native';
import {Size} from '../../theme/size';
import translate from '../../theme/es.json';
import {IconTemp} from '../IconTemp';
import {HeaderComponent} from '../HeaderComponent';
import Modal from 'react-native-modal';
import {InputField} from '../InputField';
import {CustomButton} from '../CustomButton';

interface Props extends StackScreenProps<StackParams, 'Marcador'> {}

const maxWidth = Dimensions.get('screen').width;
const window = Dimensions.get('window');

export const Marcador = ({route, navigation}: Props) => {
  const {
    projectName,
    description,
    photo,
    marks: markas,
    hastag,
    topic,
    onBack,
  } = route.params;
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
  const [askError, setAskError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    // console.log(projectName + ' '+description + ' ' + topic + ' ' + hastag  )
    if (onBack) {
      if (markas) {
        setMarks(markas);
      }
    } else {
      setMarks([]);
    }
  }, []);

  const showModal = () => {
    setAskError(false);
    setDescriptionError(false);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const showDialog = () => {
    setVisibleAlert(true);
  };

  const hideDialog = () => setVisibleAlert(false);

  /**
   * Creas una marca con un tipo predefinido
   * @param type Mark type
   */
  const newMark = (type: string) => {
    setMarkType(type);
    setIsEdit(false);
    setSelectedMark({name: '', type: '', ask: '', description: ''});
    clear();
    showModal();
  };

  const addAsk = () => {
    if (!isEdit) {
      form.type = markType;
      if (form.ask.length <= 0) {
        console.log('entra si ask <= 0');
        setAskError(true);
      }else{
        setAskError(false);
      }

      if (form.description.length <= 0) {
        console.log('entra si descrip <= 0');
        setDescriptionError(true);
      }else{
        setDescriptionError(false);
      }
      
      if (form.ask.length > 0 && form.description.length > 0) {
        setMarks([...marks, form]);
        setAskError(false);
        setDescriptionError(false);
        // showDialog();
        hideModal();
      }
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
      hideModal();
    }
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
      // console.log(marks);
      navigation.navigate('MarcadorExample', {
        projectName,
        description,
        hastag,
        topic,
        photo,
        marks,
      });
    } else {
      showDialog();
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        <HeaderComponent
          title={translate.strings.new_project_mark_screen[0].title}
          onPressLeft={() => navigation.goBack()}
          onPressRight={() => console.log()}
        />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {marks.length > 0 ? (
            marks.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  width: maxWidth,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.mark}
                  onPress={() => showMark(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: FontSize.fontSizeText}}>
                      {item.ask}
                    </Text>
                    {item.type == 'string' ? (
                      <Image
                        source={require('../../assets/icons/text-type.png')}
                        style={{
                          alignSelf: 'center',
                          width: '7%',
                          height: '80%',
                          borderRadius: 50,
                        }}
                      />
                    ) : item.type == 'number' ? (
                      <Image
                        source={require('../../assets/icons/number-type.png')}
                        style={{
                          alignSelf: 'center',
                          width: '7%',
                          height: '80%',
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../assets/icons/photo-type.png')}
                        style={{
                          alignSelf: 'center',
                          width: '7%',
                          height: '80%',
                          borderRadius: 50,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }}>
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
              {translate.strings.new_project_mark_screen[0].none_mark}
            </Text>
          )}
        </ScrollView>

        {/* buttons screen */}
        <View style={styles.bottomViewButton}>
          {/* <View>
            <CustomButton
              label={'VOLVER'}
              onPress={() => navigation.navigate('NewProjectScreen', {marks})}
              backgroundColor={'#ffffff'}
              fontColor={Colors.primary}
              width={Size.globalWidth * 0.3}
              iconLeft={'chevron-left'}
            />
          </View> */}
          {/* <View>
            <CustomButton
              label={'SIGUIENTE'}
              onPress={() => nextScreen()}
              backgroundColor={'#ffffff'}
              fontColor={Colors.primary}
              width={Size.globalWidth * 0.3}
              iconRight={'chevron-right'}
            />
          </View> */}
          <Button
            icon="chevron-left"
            mode="elevated"
            labelStyle={{
              fontSize: FontSize.fontSizeTextMin,
            }}
            buttonColor="white"
            onPress={() => navigation.navigate('NewProjectScreen', {marks})}>
            Volver
          </Button>
          <Button
            icon="chevron-right"
            mode="elevated"
            buttonColor="white"
            labelStyle={{
              fontSize: FontSize.fontSizeTextMin,
            }}
            contentStyle={{flexDirection: 'row-reverse'}}
            onPress={() => nextScreen()}>
            Siguiente
          </Button>
        </View>

        {/* buttons add container */}
        <View
          style={{
            right: 0,
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: '10%',
          }}>
          {/* add text */}
          <View style={{...styles.floatButton}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => newMark('string')}>
              {/* <Image
                source={require('../../assets/icons/text-type.png')}
                style={{
                  width: Size.iconSizeLarge,
                  height: Size.iconSizeLarge,
                  borderRadius: 50,
                }}
              /> */}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconTemp name="format-text" size={Size.iconSizeLarge} />
              </View>
            </TouchableOpacity>
          </View>
          {/* add number */}
          <View style={{...styles.floatButton}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => newMark('number')}>
              {/* <Image
                source={require('../../assets/icons/number-type.png')}
                style={{
                  width: Size.iconSizeLarge,
                  height: Size.iconSizeLarge,
                  borderRadius: 50,
                }}
              /> */}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconTemp name="numeric-1" size={Size.iconSizeLarge} />
              </View>
            </TouchableOpacity>
          </View>
          {/* add photo */}
          <View style={{...styles.floatButton}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => newMark('photo')}>
              {/* <Image
                source={require('../../assets/icons/photo-type.png')}
                style={{
                  width: Size.iconSizeLarge,
                  height: Size.iconSizeLarge,
                  borderRadius: 50,
                }}
              /> */}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconTemp name="camera" size={Size.iconSizeLarge} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* modal add/edit */}
      <Modal
        isVisible={visible}
        onDismiss={hideModal}
        style={{alignItems: 'center'}}
        animationIn="zoomIn"
        animationInTiming={300}
        animationOut="zoomOut"
        animationOutTiming={300}
        backdropOpacity={0.8}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View
          style={{...globalStyles.viewModal, height: Size.window.height * 0.5}}>
          <ScrollView
            disableScrollViewPanResponder={true}
            style={{borderRadius: 40, paddingHorizontal: '5%', width: '100%'}}
            showsVerticalScrollIndicator={false}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: FontSize.fontSizeTextSubTitle,
                marginBottom: '5%',
                fontWeight: 'bold',
                color: '#2F3061',
                borderColor: '#2F3061',
              }}>
              {translate.strings.new_project_mark_screen[0].new_mark[0].title}
            </Text>
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_project_mark_screen[0].new_mark[0]
                    .ask_input
                }
                icon="border-color"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'ask')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
                value={form.ask}
              />
              {askError ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={styles.helperText}>
                  {
                    translate.strings.new_project_mark_screen[0].new_mark[0]
                      .ask_input_err
                  }
                </HelperText>
              ) : (
                <HelperText
                  type="info"
                  visible={true}
                  style={styles.helperText}>
                  {
                    translate.strings.new_project_mark_screen[0].new_mark[0]
                      .ask_input
                  }
                </HelperText>
              )}
              {/* <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_project_mark_screen[0].new_mark[0]
                    .ask_input
                }
              </HelperText> */}
            </View>
            {isEdit && (
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Picker
                  style={{
                    flex: 1,
                    width:
                      window.width > 500
                        ? window.width - 120
                        : window.width - 60,
                  }}
                  selectedValue={form.type}
                  placeholder="Tipo de dato"
                  onValueChange={(itemValue, itemIndex) =>
                    onSelectType(itemValue)
                  }>
                  <Picker.Item label="Texto" value="string" />
                  <Picker.Item label="Número" value="number" />
                  <Picker.Item label="Fotografía" value="photo" />
                </Picker>
              </View>
            )}

            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_project_mark_screen[0].new_mark[0]
                    .description_input
                }
                icon="text"
                keyboardType="default"
                multiline={true}
                numOfLines={6}
                onChangeText={value => onChange(value, 'description')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
                value={form.description}
              />
              {descriptionError ? (
                <HelperText type="error" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_project_mark_screen[0].new_mark[0]
                    .description_input_err
                }
              </HelperText>
              ) : (
                <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_project_mark_screen[0].new_mark[0]
                    .description_input
                }
              </HelperText>
              )}
              
            </View>

            {/* <Button labelStyle={styles.buttonModal} onPress={addAsk}>
              {
                translate.strings.new_project_mark_screen[0].new_mark[0]
                  .save_button
              }
            </Button>
            <Button labelStyle={styles.buttonModal} onPress={hideModal}>
              {
                translate.strings.new_project_mark_screen[0].new_mark[0]
                  .close_button
              }
            </Button> */}
          </ScrollView>
          <View
            style={{
              // backgroundColor:'red',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {/* <ButtonNative title="Hide modal" onPress={hideModal} />
            <ButtonNative title="Hide modal" onPress={hideModal} /> */}
            <Button labelStyle={styles.buttonModal} onPress={addAsk}>
              {
                translate.strings.new_project_mark_screen[0].new_mark[0]
                  .save_button
              }
            </Button>
            <Button labelStyle={styles.buttonModal} onPress={hideModal}>
              {
                translate.strings.new_project_mark_screen[0].new_mark[0]
                  .close_button
              }
            </Button>
          </View>
        </View>
      </Modal>

      {/* modal error */}
      <Portal>
        <Dialog visible={visibleAlert} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title
            style={{
              alignSelf: 'center',
              paddingVertical: 15,
              fontSize: FontSize.fontSize,
            }}>
            {translate.strings.new_project_mark_screen[0].modal_error[0].title}
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.modalText}>
              {translate.strings.new_project_mark_screen[0].modal_error[0].body}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{...styles.modalText, textAlign: 'center'}}
              onPress={hideDialog}>
              {
                translate.strings.new_project_mark_screen[0].modal_error[0]
                  .close_button
              }
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: '3%',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: FontSize.fontSizeText + 15,
    fontWeight: 'bold',
    color: '#2F3061',
    // borderBottomWidth: 1,
    // borderColor: '#2F3061',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomViewButton: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '2%',
    marginVertical: '2%',
  },
  helperText: {
    fontSize: FontSize.fontSizeTextMin,
  },
  modalStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    height: Size.window.height * 0.5,
    top: '4%',
  },
  buttonModal: {
    // marginVertical: 10,
    color: Colors.lightorange,
    fontSize: FontSize.fontSizeTextMin,
    // paddingVertical: 10,
  },
  text: {
    fontSize: FontSize.fontSizeText,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  mark: {
    // borderWidth: 1,
    borderRadius: 30,
    borderColor: 'black',
    padding: 5,
    paddingHorizontal: 20,
    // marginVertical: '2%',

    alignContent: 'center',
    marginLeft: 10,
    width: maxWidth * 0.7,
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

  floatButton: {
    // position: 'absolute',
    // right: 0,
    // justifyContent: 'center',
    // alignSelf: 'center',
    // backgroundColor: Colors.lightorange,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 5.65,
    marginVertical: '1%',
    elevation: 1,
    right: 10,
  },
  modalText: {
    fontSize: FontSize.fontSizeText,
    textAlign: 'center',
    paddingVertical: FontSize.fontSizeText - 5,
    flexShrink: 1,
  },
});
