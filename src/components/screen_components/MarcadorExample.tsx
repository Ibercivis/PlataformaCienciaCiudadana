import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  Paragraph,
  Portal,
  ProgressBar,
  Text,
  TextInput,
} from 'react-native-paper';
import {globalStyles} from '../../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project, Projects} from '../../interfaces/appInterfaces';
import {
  CommonActions,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import {StackParams} from '../../navigation/ProjectNavigator';
import {Colors} from '../../theme/colors';
import {fonts, FontSize} from '../../theme/fonts';
import translate from '../../theme/es.json';
import citmapApi from '../../api/citmapApi';
import {HeaderComponent} from '../HeaderComponent';

const maxWidth = Dimensions.get('screen').width;
const window = Dimensions.get('window');

interface Props extends StackScreenProps<StackParams, 'MarcadorExample'> {}

interface ProjectTemp {
  hasTag: number[];
  name: string;
  creator: number;
  description: string;
}

export const MarcadorExample = ({route, navigation}: Props) => {
  const {projectName, description, photo, hastag, topic, marks} = route.params;
  const [visible, setVisible] = useState(false);
  const [visibleFinish, setVisibleFinish] = useState(false);
  const [loadingProgressBar, setLoadingProgressBar] = useState(false);
  const [showMoreText, setShowMoreText] = useState('');

  const [project, setProject] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    projectName: '',
    description: '',
    hastag: [],
    topic: [],
    photo: '',
    marks: [],
  });

  useEffect(() => {
    setNewProject({
      projectName: projectName,
      description: description,
      hastag: hastag,
      topic: topic,
      photo: photo,
      marks: marks,
    });
  }, []);

  const showDialog = (moreText: string) => {
    setShowMoreText(moreText);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);
  const hideDialogFinish = () => setVisibleFinish(false);

  const showFinishMessage = async () => {
    hideDialogFinish();
    setLoadingProgressBar(true);
    await saveData();
  };

  const endProject = async () => {
    // setProject([newProject]);

    // se cargan los datos primero
    const data = await getData();
    //si hay datos guardados se seleccionan

    setVisibleFinish(true);
  };

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
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('projects');
      // console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : '';
    } catch (e) {
      // error reading value
    }
  };

  const saveData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      let creator;
      try {
        const resp = await citmapApi.get('/authentication/user/', {
          headers: {
            Authorization: token,
          },
        });
        creator = JSON.stringify(resp.data.pk, null, 1);
      } catch (err) {
        console.log('creator not selected');
      }

      try {
        const resp = await citmapApi.post<Projects>(
          '/project/create/',
          {
            hasTag: hastag,
            topic: topic,
            name: projectName,
            creator: creator,
            description: description,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        setLoadingProgressBar(false);
        setTimeout(() => {
          navigation.popToTop();
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      // Error saving data
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={{...globalStyles.globalMargin, flex: 1}}>
        <HeaderComponent
          title={translate.strings.new_project_mark_example_screen[0].title}
          onPressLeft={() => navigation.goBack()}
          onPressRight={() => console.log()}
        />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* <Text style={fonts.title}>
            {translate.strings.new_project_mark_example_screen[0].title}
          </Text> */}
          {marks.length > 0 &&
            marks.map((x, i) => (
              <View key={i}>
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: 15,
                  }}>
                  <Text
                    style={{
                      marginTop: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: Colors.primary,
                      fontSize: FontSize.fontSizeText,
                    }}>
                    {x.ask}
                  </Text>
                  <TextInput
                    style={{
                      ...styles.textInput,
                    }}
                    right={
                      <TextInput.Icon
                        onPress={() => showDialog(x.description)}
                        icon="information-variant"
                      />
                    }
                    placeholder={
                      translate.strings.new_project_mark_example_screen[0]
                        .response_input
                    }
                    mode="flat"
                    autoCorrect={false}
                    autoCapitalize="none"
                    // onChangeText={value => console.log(value)}
                    underlineColor="#B9E6FF"
                    activeOutlineColor="#5C95FF"
                    selectionColor="#2F3061"
                    textColor="#2F3061"
                    outlineColor={Colors.lightorange}
                    autoFocus={false}
                    dense={false}
                  />
                </View>
              </View>
            ))}
        </ScrollView>

        {/* navegation buttons */}
        <View style={styles.bottomViewButton}>
          <Button
            style={styles.button}
            icon="chevron-left"
            mode="elevated"
            labelStyle={{
              fontSize: FontSize.fontSizeTextMin,
            }}
            buttonColor="white"
            onPress={() =>
              navigation.navigate('Marcador', {
                projectName,
                description,
                hastag,
                topic,
                photo,
                marks,
                onBack: true,
              })
            }>
            Volver
          </Button>
          <Button
            style={{...styles.button}}
            icon="chevron-right"
            mode="elevated"
            contentStyle={{flexDirection: 'row-reverse'}}
            labelStyle={{
              fontSize: FontSize.fontSizeTextMin,
            }}
            buttonColor="white"
            onPress={() => endProject()}>
            Finalizar
          </Button>
        </View>

        {/* show more info */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>
              {
                translate.strings.new_project_mark_example_screen[0]
                  .more_information[0].title
              }
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>{showMoreText}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>
                {
                  translate.strings.new_project_mark_example_screen[0]
                    .more_information[0].close_button
                }
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={loadingProgressBar} onDismiss={hideDialog}>
            <Dialog.Title>
              {
                translate.strings.new_project_mark_example_screen[0]
                  .more_information[0].title
              }
            </Dialog.Title>
            <Dialog.Content>
              <View>
                <Text style={{marginBottom: 20}}>Guardando proyecto</Text>
                <ProgressBar
                  // progress={60}
                  indeterminate
                  color="#4a0072"
                />
              </View>
            </Dialog.Content>
          </Dialog>

          {/* finish modal */}
          <Dialog visible={visibleFinish} onDismiss={hideDialogFinish}>
            <Dialog.Title style={{textAlign: 'center'}}>
              {
                translate.strings.new_project_mark_example_screen[0]
                  .save_project[0].title
              }
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={styles.modalText}>
                {
                  translate.strings.new_project_mark_example_screen[0]
                    .save_project[0].body
                }
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                labelStyle={styles.buttonModal}
                onPress={hideDialogFinish}>
                {
                  translate.strings.new_project_mark_example_screen[0]
                    .save_project[0].close_button
                }
              </Button>
              <Button
                labelStyle={styles.buttonModal}
                onPress={showFinishMessage}>
                {
                  translate.strings.new_project_mark_example_screen[0]
                    .save_project[0].save_button
                }
              </Button>
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
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    // position: 'absolute',
    // bottom: 0,
    // width: 110,
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
  buttonModal: {
    marginVertical: 5,
    color: Colors.lightorange,
    fontSize: FontSize.fontSizeText,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: FontSize.fontSizeText,
    textAlign: 'center',
    paddingVertical: FontSize.fontSizeText,
    flexShrink: 1,
  },
});
