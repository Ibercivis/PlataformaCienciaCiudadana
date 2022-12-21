import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  AnimatedFAB,
  Button,
  Dialog,
  IconButton,
  MD3Colors,
  Paragraph,
  Portal,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../thyme/theme';
import {ScrollView} from 'react-native-gesture-handler';
import {useForm} from '../hooks/useForm';
import {Project, Mark} from '../interfaces/appInterfaces';
import {Fab} from './Fab';
import {StackParams} from '../navigation/ProjectNavigator';

interface Props extends StackScreenProps<StackParams, 'NewProjectScreen'> {}

export const NewProject = ({navigation, route}: Props) => {
  const {marks} = route.params;
  console.log(marks);
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
    // onChange('', 'projectName');
    // onChange('', 'description');
    // onChange('', 'photo');
  }, []);

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
    }else{
      showDialog();
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>NUEVO PROYECTO</Text>
          <View>
            <TextInput
              style={{margin: 15}}
              label="Nombre del proyecto"
              autoCorrect={false}
              autoCapitalize="none"
              underlineColor="#B9E6FF"
              activeOutlineColor="#5C95FF"
              selectionColor="#2F3061"
              textColor="#2F3061"
              outlineColor="#5C95FF"
              autoFocus={true}
              dense={true}
              onChangeText={value => onChange(value, 'projectName')}
            />
            <TextInput
              style={{margin: 15}}
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
              onChangeText={value => onChange(value, 'description')}
            />
            <View style={styles.photoContainer}>
              <Text
                style={{margin: 10, marginHorizontal: 20, color: '#2F3061'}}>
                Imagen del proyecto
              </Text>
              {!tempUri && (
                <View style={styles.photo}>
                  <IconButton
                    icon="image"
                    iconColor="#5F4B66"
                    size={50}
                    onPress={() => galeria()}
                  />
                  {/* <IconButton
                      icon="camera"
                      iconColor="#5F4B66"
                      size={50}
                      onPress={() => takePhoto()}
                    /> */}
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
            onPress={() => nextScreen()}>
            Siguiente
          </Button>
        </View>
      </KeyboardAvoidingView>
      <Fab
        iconName="arrow-back-outline"
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', top: 20, left: 20}}
        size={40}
      />
      {/* <AnimatedFAB
          icon={'chevron-right'}
          label={'Siguiente'}
          extended={true}
          onPress={() =>
            navigation.navigate('Marcador', {projectName, description, photo})
          }
          visible={true}
          animateFrom={'right'}
          iconMode={'dynamic'}
          style={[styles.fabStyle]}
        /> */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{alignSelf: 'center'}}>Error de creación</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Es necesario establecer un nombre y una descripción válidos.</Paragraph>
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
    marginBottom: 20
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
    marginBottom: 20,
  },
  photo: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 300,
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#EADEDA',
  },
  buttonNav: {
    position: 'relative',
    bottom: 0,
    width: 110,
  },
  bottomViewButtonNav: {
    flexDirection: 'row-reverse',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
});
