import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  Paragraph,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../thyme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project} from '../interfaces/appInterfaces';
import {
  CommonActions,
  useNavigation,
  StackActions
} from '@react-navigation/native';
import { StackParams } from '../navigation/ProjectNavigator';
import { Colors } from '../thyme/colors';

interface Props extends StackScreenProps<StackParams, 'MarcadorExample'> {}

export const MarcadorExample = ({route, navigation}: Props) => {
  const {projectName, description, photo, marks} = route.params;
  const [visible, setVisible] = useState(false);
  const [visibleFinish, setVisibleFinish] = useState(false);
  const [showMoreText, setShowMoreText] = useState('');

  const [project, setProject] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    projectName: '',
    description: '',
    photo: '',
    marks: []
  });

  useEffect(() => {
    setNewProject({projectName:projectName, description: description, photo: photo, marks: marks});
  }, [])
  
  
  const showDialog = (moreText: string) => {
    setShowMoreText(moreText);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);
  const hideDialogFinish = () => setVisibleFinish(false);

  const showFinishMessage = async () => {
    
    await saveData();
    hideDialogFinish();

    navigation.popToTop()
  };

  const endProject = async () =>{
    // setProject([newProject]);
    
    // se cargan los datos primero
    const data = await getData();

    //si hay datos guardados se seleccionan
    if (data.length > 0) {
      setProject(data);
      console.log(data);
    }


    // se guarda en base de datos
    if (project.length > 0) {
      console.log('con data');
      setProject([...project, newProject]);
      console.log(project);
    } else {
      console.log('sin data');
      setProject([newProject]);
      console.log(project);
    }
    setVisibleFinish(true)
    
  }

  const close = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: -1,
        routes: [
          {name: 'HomeScreen'},
          {name: 'NewProjectScreen'},
          {name: 'Marcador'},
          {name: 'MarcadorExample'},
        ],
      }),
    );
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('projects');
      console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : '';
    } catch (e) {
      // error reading value
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(project));
    } catch (error) {
      // Error saving data
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>PRUEBA TU MARCADOR</Text>
          {marks.length > 0 &&
            marks.map((x, i) => (
              <View  key={i}>
                <Text
                  style={{
                    margin: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.primary,
                    fontSize: 18
                  }}>
                  {x.ask}
                </Text>
                <TextInput
                  style={{
                    marginHorizontal: 15,
                    marginBottom: 10,
                    borderTopEndRadius: 20,
                    // borderTopStartRadius: 20,
                  }}
                  right={
                    <TextInput.Icon
                      onPress={() => showDialog(x.description)}
                      icon="information-variant"
                    />
                  }
                  mode="flat"
                  autoCorrect={false}
                  autoCapitalize="none"
                  underlineColor="#B9E6FF"
                  activeOutlineColor="#5C95FF"
                  selectionColor="#2F3061"
                  textColor="#2F3061"
                  outlineColor="#5C95FF"
                  autoFocus={true}
                  dense={false}
                  onChangeText={value => console.log(value)}
                />
              </View>
            ))}
        </ScrollView>
        <View style={styles.bottomViewButton}>
          <Button
            style={styles.button}
            icon="chevron-left"
            mode="elevated"
            // contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            onPress={() =>
              navigation.navigate('Marcador', {
                projectName,
                description,
                photo,
                marks,
                onBack: true,
              })
            }>
            Volver
          </Button>
          <Button
            style={{...styles.button, left: 110}}
            icon="chevron-right"
            mode="elevated"
            contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            onPress={() => endProject()}>
            Finalizar
          </Button>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Más información</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{showMoreText}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cerrar</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={visibleFinish} onDismiss={hideDialogFinish}>
            <Dialog.Title>Finalizar</Dialog.Title>
            <Dialog.Content>
              <Paragraph>¿ Desea guardar el proyecto ?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogFinish}>Cerrar</Button>
              <Button onPress={showFinishMessage}>Guardar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
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
  },
  bottomViewButton: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    position: 'relative',
    bottom: 0,
    width: 110,
  },
  modalStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
  },
});
