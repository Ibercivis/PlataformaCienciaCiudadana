import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Dimensions,
  TextInput as RNTextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper';
import {globalStyles} from '../../theme/theme';
import {useForm} from '../../hooks/useForm';
import {Project, Mark} from '../../interfaces/appInterfaces';
import {Fab} from '../Fab';
import {StackParams} from '../../navigation/ProjectNavigator';
import {fonts, FontSize} from '../../theme/fonts';
import {Colors} from '../../theme/colors';
import translate from '../../theme/es.json';
import {CustomButton} from '../../components/CustomButton';
import {InputField} from '../../components/InputField';
import { Size } from '../../theme/size';

const window = Dimensions.get('window');
const iconSizeFab = window.width > 500 ? 60 : 40;

interface Props extends StackScreenProps<StackParams, 'NewProjectScreen'> {}

export const NewProject = ({navigation, route}: Props) => {
  const {marks} = route.params;
  const projectNameRef = useRef<RNTextInput>(null);
  const [img, setImg] = useState('');
  const [tempUri, setTempUri] = useState<string>();
  const [project, setProject] = useState<Project>({
    projectName: '',
    description: '',
    photo: '',
    marks: [],
  });
  const [visible, setVisible] = useState(false);
  const {projectName, description, photo, onChange} = useForm<Project>(project);
  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    if (tempUri) onChange(tempUri, 'photo');
  }, [tempUri]);

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      response => {
        if (response.didCancel) return;
        if (response.assets) {
          setTempUri(response.assets![0].uri?.toString());
        }
      },
    );
  };

  const galeria = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) return;
        if (response.assets) {
          setTempUri(response.assets![0].uri);
        }
      },
    );
  };

  const deleteImage = () => {
    if (tempUri) {
      setTempUri(undefined);
    }
  };

  const nextScreen = () => {
    if (projectName.length > 0 && description.length > 0) {
      navigation.navigate('Marcador', {
        projectName,
        description,
        photo,
        marks,
        onBack: true,
      });
    } else {
      showDialog();
    }
  };

  const clearNameRef = () => {
    projectNameRef.current!.clear();
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={fonts.title}>
            {translate.ES.new_project_screen[0].title}
          </Text>
          <View>
            {/* <View
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
                placeholder={translate.ES.new_project_screen[0].project_name_input}
                mode="flat"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'projectName')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor={Colors.lightorange}
                autoFocus={false}
                dense={false}
              />
            </View> */}
            <InputField
              label={translate.ES.new_project_screen[0].project_name_input}
              icon="format-title"
              keyboardType="email-address"
              multiline={false}
              numOfLines={1}
              onChangeText={value => onChange(value, 'projectName')}
              iconColor={Colors.lightorange}
            />
            {/* <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <TextInput
                style={{
                  ...styles.textInput,
                }}
                placeholder={
                  translate.ES.new_project_screen[0].description_input
                }
                mode="flat"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'description')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                autoFocus={false}
                dense={false}
                multiline={true}
                numberOfLines={10}
              />
            </View> */}
            <InputField
              label={translate.ES.new_project_screen[0].description_input}
              icon="text"
              keyboardType="default"
              multiline={true}
              numOfLines={6}
              onChangeText={value => onChange(value, 'description')}
              iconColor={Colors.lightorange}
            />
            <View
              style={{
                flexDirection: 'row',
                // width: window.width - 25,
              }}>
              <Text
                style={{
                  
                  marginTop: '8%',
                  marginBottom: '3%',
                  color: '#2F3061',
                  backgroundColor: ' red',
                  fontSize: FontSize.fontSizeText,
                }}>
                {translate.ES.new_project_screen[0].image_title}
              </Text>
            </View>
            <View style={styles.photoContainer}>
              {!tempUri && (
                <View style={styles.photo}>
                  <IconButton
                    icon="image-album"
                    iconColor="#5F4B66"
                    size={Size.iconSizeLarge}
                    onPress={() => galeria()}
                  />
                </View>
              )}
              {tempUri && (
                <>
                  <Image
                    source={{
                      uri: tempUri,
                    }}
                    style={{
                      width: '90%',
                      height: 350,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                  />
                  <Button
                    style={{margin: 15, width: 150, alignSelf: 'center'}}
                    icon="delete"
                    mode="elevated"
                    buttonColor="white"
                    onPress={() => deleteImage()}>
                    Borrar imagen
                  </Button>
                </>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={{...styles.bottomViewButtonNav}}>
          <Button
            style={{...styles.buttonNav}}
            icon="chevron-right"
            mode="elevated"
            contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            labelStyle={{
              fontSize: FontSize.fontSizeText,
              justifyContent: 'center',
              top: '1%',
              paddingVertical: 5,
            }}
            onPress={() => nextScreen()}>
            {translate.ES.global[0].next_button}
          </Button>
        </View>
      </KeyboardAvoidingView>
      <Fab
        iconName="arrow-left"
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', top: 20, left: 20}}
        size={iconSizeFab}
        iconSize={iconSizeFab}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{alignSelf: 'center'}}>
            Error de creación
          </Dialog.Title>
          <Dialog.Content style={{top: '4%', paddingVertical: 10}}>
            <Paragraph style={styles.modalText}>
              Es necesario establecer un nombre y una descripción válidos.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity activeOpacity={0.5} onPress={hideDialog}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: '5%',
                }}>
                <Text style={{fontSize: FontSize.fontSizeText, color: 'black'}}>
                  Cerrar
                </Text>
              </View>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: '4%'
  },
  
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  touchable: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textButton: {
    color: 'black',
  },
  bottomViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  photoContainer: {
    marginBottom: "10%",
  },
  photo: {
    alignItems: 'center',
    flex:1,
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightorange,
    justifyContent: 'center',
    backgroundColor: '#EADEDA',
  },
  buttonNav: {
    // textAlign: 'center',
    // color: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  bottomViewButtonNav: {
    flexDirection: 'row-reverse',
    marginHorizontal: 5,
    marginBottom: 10,
  },

  textInput: {
    width: '90%',
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
  modalText: {
    fontSize: FontSize.fontSizeText,
    textAlign: 'center',
    paddingVertical: FontSize.fontSizeText,
    flexShrink: 1,
  },
});
