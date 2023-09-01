import React, {useEffect, useRef, useState} from 'react';
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
  ListRenderItemInfo,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Button,
  Dialog,
  HelperText,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper';

import {useForm} from '../../hooks/useForm';
import {useAnimation} from '../../hooks/useAnimation';
import citmapApi from '../../api/citmapApi';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackParams} from '../../navigation/HomeNavigator';
import {Project, Mark, HasTag, Topic} from '../../interfaces/appInterfaces';

import {globalStyles} from '../../theme/theme';
import {fonts, FontSize} from '../../theme/fonts';
import {Colors} from '../../theme/colors';
import {Size} from '../../theme/size';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import translate from '../../theme/es.json';
import {InputField} from '../../components/InputField';
import {IconTemp} from '../IconTemp';

import {MultiSelect} from 'react-native-element-dropdown';
import {IMultiSelectRef} from 'react-native-element-dropdown/lib/typescript/components/MultiSelect/model';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {BackButton} from '../BackButton';
import Modal from 'react-native-modal';
import {InfoButton} from '../InfoButton';
import {HeaderComponent} from '../HeaderComponent';

interface Props extends StackScreenProps<StackParams, 'NewProjectScreen'> {}

const dataCarousel = [
  {
    title: 'Creación del proyecto',
    numPantalla: 'Primera',
    body: 'En estos campos es obligatorio el nombre, descripción y añadir mínimo un hastag y topic ',
  },
  {
    title: 'Añadir marcas',
    numPantalla: 'Segunda',
    body: 'En la parte inferior derecha, tenemos 3 botones que añadirán una marca de tipo imagen, número o campo de texto',
  },
  {
    title: 'Fase final',
    numPantalla: 'Tercera',
    body: 'En esta pantalla habrá que rellenar los campos que has creado a modo de ejemplo',
  },
];
/**
 * constantes dedicadas al carousel, tamaño de los items dentro de este y de el mismo
 */
const SLIDER_WIDTH = Dimensions.get('window').width *0.9 ; // tamaño total del componente
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const SLIDER_HEIGHT = Dimensions.get('window').height;
const ITEM_HEIGHT = Math.round(SLIDER_WIDTH * 0.9);

export const NewProject = ({navigation, route}: Props) => {
  const {
    marks,
    description: descript,
    hastag: hastags,
    photo: photos,
    projectName: name,
    topic: topicos,
  } = route.params;

  // refers
  const projectNameRef = useRef<RNTextInput>(null);
  const multiselectHastag = useRef<IMultiSelectRef>(null);
  const multiselectTopic = useRef<IMultiSelectRef>(null);
  // carousel
  const carousel = useRef(null);
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  // image
  const [img, setImg] = useState('');
  const [tempUri, setTempUri] = useState<string>();

  const [project, setProject] = useState<Project>({
    projectName: '',
    description: '',
    photo: '',
    hastag: [],
    topic: [],
    marks: [],
  });
  //modales
  const [visible, setVisible] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  // hooks
  let {projectName, description, photo, hastag, topic, onChange} =
    useForm<Project>(project);
  const {FadeIn, FadeOut, opacity} = useAnimation();

  // variables
  const [hasTag, setHasTag] = useState<HasTag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [hasTagObjectSelected, setHasTagObjectSelected] = useState<HasTag[]>(
    [],
  );
  const [topicObjectSelected, setTopicObjectSelected] = useState<Topic[]>([]);
  const [selectedHastag, setSelectedHastag] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);

  // dialogs
  const showDialog = () => {
    setVisible(true);
  };

  const showHelpModal = () => {
    setHelpModal(true);
  };

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    if (name && descript) {
      projectName = name;
      description = descript;
    }
  }, []);

  useEffect(() => {
    getHasTag();
    getTopic();
  }, []);

  /**
   * cambia en el form la foto cuando detecta que ha sido cambiada
   */
  useEffect(() => {
    if (tempUri) onChange(tempUri, 'photo');
  }, [tempUri]);

  /**
   * abre la información guía
   */
  useEffect(() => {
    showHelpModal();
  }, []);

  /**
   * cuando detecta que el state hasTag ha cambiado, comprueba si le han pasado por params hastags, si es así, entra en el método
   */
  useEffect(() => {
    if (hastags) {
      setSelectedHastagMethod();
    }
  }, [hasTag]);
  /**
   * cuando detecta que el state topic ha cambiado, comprueba si le han pasado por params hastags, si es así, entra en el método
   */
  useEffect(() => {
    if (topicos) {
      setSelectedTopicsMethod();
    }
  }, [topics]);

  /**
   * si hay movimiento en el state de hastagobjectselected, hace un mapeo para renderizar los items uno a uno
   */
  useEffect(() => {
    hasTagObjectSelected.map(x => {
      renderDataItemHastagSelected(x, undefined);
    });
    // console.log(selectedHastag);
  }, [selectedHastag]);

  useEffect(() => {
    topicObjectSelected.map(x => {
      renderDataItemTopicsSelected(x, undefined);
    });
  }, [selectedTopics]);

  /**
   * Metodo que obtiene los hastag mediante el token.
   * Setea hastag
   */
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
      console.log('error hastag');
    }
  };

  /**
   * Metodo que obtiene los topic mediante el token.
   * Setea topic
   */
  const getTopic = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get('/project/topics/', {
        headers: {
          Authorization: token,
        },
      });
      if (resp.data) {
        setTopics(resp.data);
      }
      if (topicos) {
        onChange(topicos, 'topic');
      }
    } catch (e) {
      console.log('error topic');
    }
  };

  /**
   * Si se le han pasado hastag en los params, genera un array de strings,
   * hace un mapeo de los hastag que le han pasado por params, dentro, se hace un mapeo de los hastag obtenidos de la api para que
   * si coincide el id, sean añadidos al array de strings y al array de hastagSelected
   */
  const setSelectedHastagMethod = () => {
    if (hastags) {
      let newHastags: number[] = [];
      hasTag.map(x => {
        hastags.map(y => {
          if (y === x.id) {
            setHasTagObjectSelected([...hasTagObjectSelected, x]);
            newHastags.push(x.id); //cosa rara, por defecto cuando se añaden, se añade el id
          }
        });
      });

      setSelectedHastag(newHastags);
    }
  };

  /**
   * Si se le han pasado topics en los params, genera un array de strings,
   * hace un mapeo de los topics que le han pasado por params, dentro, se hace un mapeo de los topics obtenidos de la api para que
   * si coincide el id, sean añadidos al array de strings y al array de topicsSelected
   */
  const setSelectedTopicsMethod = () => {
    if (topicos) {
      let newTopics: number[] = [];
      topics.map(x => {
        topicos.map(y => {
          if (y === x.id) {
            setTopicObjectSelected([...topicObjectSelected, x]);
            newTopics.push(x.id);
          }
        });
      });
      setSelectedTopics(newTopics);
    }
  };

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
    if (name && descript) {
      projectName = name;
      description = descript;
    }
    if (
      projectName.length > 0 &&
      description.length > 0 &&
      hasTag.length > 0 &&
      topic.length > 0
    ) {
      navigation.navigate('Marcador', {
        projectName,
        description,
        photo,
        marks,
        hastag,
        topic,
        onBack: true,
      });
    } else {
      showDialog();
    }
  };

  /**
   *
   * @param item object HASTAG
   * @returns elementos del desplegable
   */
  const renderDataItem = (item: HasTag) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.hasTag}</Text>
        <Icon name={'abjad-hebrew'} size={Size.iconSizeMin} color={'black'} />
      </View>
    );
  };

  const renderDataItemTopic = (item: Topic) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.topic}</Text>
        <Icon name={'abjad-hebrew'} size={Size.iconSizeMin} color={'black'} />
      </View>
    );
  };

  const onCloseHelpModal = () => {
    setHelpModal(!helpModal);
  };

  /**
   *
   * @param item cada elemento del carousel
   * @returns cada vista del carousel
   */
  const renderCarouselItem = (
    item:
      | ListRenderItemInfo<{title: string; body: string; numPantalla: string}>
      | {
          item: {title: string; body: string; numPantalla: string};
          index: number;
        },
  ) => {
    return (
      <View style={carouselStyles.container}>
        <Text
          style={{
            fontSize: FontSize.fontSizeTextTitle,
            marginVertical: '5%',
            alignSelf: 'center',
            fontWeight: 'bold',
          }}>
          {item.item.title}
        </Text>
        <Text style={{fontSize: FontSize.fontSizeTextMin}}>
          {item.item.numPantalla}
        </Text>
        <Text style={{fontSize: FontSize.fontSizeText}}>{item.item.body}</Text>
      </View>
    );
  };

  /**
   *
   * @param item objeto HASTAG
   * @param unSelect determina si el elemento está seleccionado o no
   * @returns elementos seleccionados
   */
  const renderDataItemHastagSelected = (
    item: HasTag,
    unSelect: ((item: HasTag) => void) | undefined,
  ) => {
    return (
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <View style={styles.selectedStyle}>
          <Text style={styles.textSelectedStyle}>{item.hasTag}</Text>
          <Icon
            name={'delete'}
            size={Size.iconSizeMin}
            // color={'black'}
          />
        </View>
      </TouchableOpacity>
    );
  };
  /**
   *
   * @param item objeto TOPIC
   * @param unSelect determina si el elemento está seleccionado o no
   * @returns elementos seleccionados
   */
  const renderDataItemTopicsSelected = (
    item: Topic,
    unSelect: ((item: Topic) => void) | undefined,
  ) => {
    return (
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <View style={styles.selectedStyle}>
          <Text style={{...styles.textSelectedStyle, color: Colors.lightblue}}>
            {item.topic}
          </Text>
          <Icon
            name={'delete'}
            size={Size.iconSizeMin}
            // color={'black'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  //habría que borrarlos y añadirlos en base de datos?
  const onNewText = (item: string) => {
    // setSelectedHastag([...selectedHastag, item]);
    console.log(selectedHastag);
  };

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        {name ? (
          // <Text style={fonts.title}>
          //   {translate.strings.new_project_screen[0].title_edit}
          // </Text>
          <HeaderComponent
            title={translate.strings.new_project_screen[0].title_edit}
            onPressLeft={() => navigation.goBack()}
            onPressRight={() => showHelpModal()}
          />
        ) : (
          // <Text style={fonts.title}>
          //   {translate.strings.new_project_screen[0].title}
          // </Text>
          <HeaderComponent
            title={translate.strings.new_project_screen[0].title}
            onPressLeft={() => navigation.goBack()}
            onPressRight={() => showHelpModal()}
          />
        )}
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <Text style={styles.title}>
                {translate.strings.new_project_screen[0].title_section}
              </Text>
            </View>

            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_project_screen[0].project_name_input
                }
                icon="border-color"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'projectName')}
                iconColor={Colors.lightorange}
                value={name}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {translate.strings.new_project_screen[0].project_name_helper}
              </HelperText>
            </View>
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_project_screen[0].description_input
                }
                icon="text"
                keyboardType="default"
                multiline={true}
                numOfLines={6}
                onChangeText={value => onChange(value, 'description')}
                iconColor={Colors.lightorange}
                value={descript}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {translate.strings.new_project_screen[0].description_helper}
              </HelperText>
            </View>
            {/* MultiSelect de hastag */}
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: '5%',
              }}>
              <View
                style={{
                  width: '80%',
                  // backgroundColor: 'blue'
                }}>
                <MultiSelect
                  ref={multiselectHastag}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  // inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={hasTag}
                  labelField="hasTag"
                  valueField="id"
                  placeholder="Hastags"
                  value={selectedHastag}
                  search
                  searchPlaceholder="Buscar..."
                  onChangeText={text => onNewText(text)}
                  onChange={item => {
                    setSelectedHastag(item);
                    onChange(item, 'hastag');
                  }}
                  renderItem={renderDataItem}
                  renderSelectedItem={
                    (item, unSelect) =>
                      renderDataItemHastagSelected(item, unSelect)
                    // <TouchableOpacity
                    //   onPress={() => unSelect && unSelect(item)}>
                    //   <View style={styles.selectedStyle}>
                    //     <Text style={styles.textSelectedStyle}>
                    //       {item.hasTag}
                    //     </Text>
                    //     <Icon
                    //       name={'delete'}
                    //       size={Size.iconSizeMin}
                    //       // color={'black'}
                    //     />
                    //   </View>
                    // </TouchableOpacity>
                  }
                />
              </View>

              {/* add tag */}
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignContent: 'center',
                  width: '18%',
                  // backgroundColor: 'red',
                }}>
                <TouchableOpacity style={{}}>
                  <View
                    style={{
                      ...styles.selectedStyle,
                      height: Size.window.height * 0.035,
                      marginTop: 0,
                      borderRadius: 50,
                    }}>
                    <Icon
                      name={'plus'}
                      size={Size.iconSizeMin}
                      color={Colors.darkorange}
                    />
                    <Text
                      style={{
                        ...styles.textSelectedStyle,
                        color: Colors.darkorange,
                      }}>
                      ADD
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* MultiSelect de topic */}
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: '8%',
              }}>
              <View
                style={{
                  width: '80%',
                }}>
                <MultiSelect
                  ref={multiselectTopic}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  // inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={topics}
                  labelField="topic"
                  valueField="id"
                  placeholder="Topics"
                  value={selectedTopics}
                  search
                  searchPlaceholder="Buscar..."
                  onChangeText={text => onNewText(text)}
                  onChange={item => {
                    setSelectedTopics(item);
                    onChange(item, 'topic');
                  }}
                  renderItem={renderDataItemTopic}
                  renderSelectedItem={
                    (item, unSelect) =>
                      renderDataItemTopicsSelected(item, unSelect)
                    // <TouchableOpacity
                    //   onPress={() => unSelect && unSelect(item)}>
                    //   <View style={styles.selectedStyle}>
                    //     <Text style={styles.textSelectedStyle}>
                    //       {item.topic}
                    //     </Text>
                    //     <Icon
                    //       name={'delete'}
                    //       size={Size.iconSizeMin}
                    //       // color={'black'}
                    //     />
                    //   </View>
                    // </TouchableOpacity>
                  }
                />
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignContent: 'center',
                  width: '18%',
                }}>
                <TouchableOpacity>
                  <View
                    style={{
                      ...styles.selectedStyle,
                      marginTop: 0,
                      borderRadius: 50,
                      height: Size.window.height * 0.035,
                    }}>
                    <Icon
                      name={'plus'}
                      size={Size.iconSizeMin}
                      color={Colors.darkorange}
                    />
                    <Text
                      style={{
                        ...styles.textSelectedStyle,
                        color: Colors.darkorange,
                      }}>
                      ADD
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginVertical: '8%'}}>
              <View>
                <Text style={styles.title}>
                  {translate.strings.new_project_screen[0].image_title}
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
          </View>
        </ScrollView>

        {/* nextButton */}
        <View style={{...styles.bottomViewButtonNav}}>
          <Button
            icon="chevron-right"
            mode="elevated"
            contentStyle={{flexDirection: 'row-reverse'}}
            buttonColor="white"
            labelStyle={{
              fontSize: FontSize.fontSizeTextMin,
            }}
            onPress={() => nextScreen()}>
            {translate.strings.global[0].next_button}
          </Button>
        </View>
      </KeyboardAvoidingView>

      {/* back button */}
      {/* <BackButton onPress={() => navigation.goBack()} /> */}

      {/* info button */}
      {/* <InfoButton onPress={() => showHelpModal()} /> */}

      {/* err modal */}
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

      {/* help info */}
      {/* <Portal>
        <Dialog
          visible={helpModal}
          onDismiss={onCloseHelpModal}
          style={{backgroundColor: 'white', opacity: 1}}>
          <Dialog.Content style={{top: '4%', paddingVertical: 10}}>
            <View>
              <Carousel
                layout="default"
                layoutCardOffset={9}
                useScrollView={true}
                ref={carousel}
                data={dataCarousel}
                renderItem={item => renderCarouselItem(item)}
                sliderWidth={SLIDER_WIDTH}
                sliderHeight={SLIDER_HEIGHT}
                itemWidth={ITEM_WIDTH}
                itemHeight={ITEM_HEIGHT}
                onSnapToItem={index => setIndex(index)}
              />
              <Pagination
                dotsLength={dataCarousel.length}
                activeDotIndex={index}
                ref={isCarousel}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)',
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity activeOpacity={0.5} onPress={onCloseHelpModal}>
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
      </Portal> */}
      <Modal
        style={{alignItems: 'center'}}
        onBackdropPress={() => setHelpModal(false)}
        isVisible={helpModal}
        animationIn="zoomIn"
        animationInTiming={300}
        animationOut="zoomOut"
        animationOutTiming={300}
        // backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={globalStyles.viewModal}>
          <Carousel
            layout="default"
            layoutCardOffset={9}
            useScrollView={true}
            ref={carousel}
            data={dataCarousel}
            renderItem={item => renderCarouselItem(item)}
            sliderWidth={SLIDER_WIDTH}
            sliderHeight={SLIDER_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            onSnapToItem={index => setIndex(index)}
            slideStyle={{backgroundColor: 'transparent', paddingHorizontal: '3%'}}
          />
          <Pagination
            dotsLength={dataCarousel.length}
            activeDotIndex={index}
            ref={isCarousel}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: '2%',
    marginHorizontal: '6%',
  },
  title: {
    fontSize: FontSize.fontSizeTextSubTitle,
    paddingVertical: FontSize.fontSizeText,
    alignItems: 'baseline',
    marginTop: '2%',
    marginBottom: '3%',
  },
  helperText: {
    fontSize: FontSize.fontSizeTextMin,
  },
  photoContainer: {
    marginBottom: '10%',
  },
  photo: {
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightorange,
    justifyContent: 'center',
    backgroundColor: '#EADEDA',
  },
  bottomViewButtonNav: {
    flexDirection: 'row-reverse',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  modalText: {
    fontSize: FontSize.fontSizeText,
    textAlign: 'center',
    paddingVertical: FontSize.fontSizeText,
    // flexShrink: 1,
    alignItems: 'baseline',
  },
  ///////////////////////////////

  dropdown: {
    height: Size.window.height * 0.035,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: '4%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: FontSize.fontSizeText,
  },
  selectedTextStyle: {
    fontSize: FontSize.fontSizeTextMin,
  },
  iconStyle: {
    width: Size.iconSizeMin,
    height: Size.iconSizeMin,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FontSize.fontSizeTextMin,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    marginTop: 8,
    marginRight: '3%',
    paddingHorizontal: '4%',
    marginVertical: '4%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    paddingVertical: '2%',
    fontSize: FontSize.fontSizeTextMin,
    color: Colors.lightorange,
  },
});

const carouselStyles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: '100%',
    height: SLIDER_HEIGHT,
    paddingBottom: 0,
    marginVertical: '2%',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 7,
  },
});

{
  /* <View
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
                  translate.strings.new_project_screen[0].description_input
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
            </View> */
}
