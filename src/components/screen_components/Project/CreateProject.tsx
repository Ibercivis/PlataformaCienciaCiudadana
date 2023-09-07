import React, {useEffect, useRef, useState} from 'react';
import {HeaderComponent} from '../../HeaderComponent';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Button,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import {Colors} from '../../../theme/colors';
import {StackParams} from '../../../navigation/MultipleNavigator';
import {CustomButton} from '../../utility/CustomButton';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {InputText} from '../../utility/InputText';
import {HasTag} from '../../../interfaces/appInterfaces';
import {Organization, Question} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {Checkbox, IconButton, Switch} from 'react-native-paper';
import Hashtag from '../../../assets/icons/general/Hashtag.svg';
import {FontFamily, FontSize} from '../../../theme/fonts';
import {Size} from '../../../theme/size';
import ImagePicker from 'react-native-image-crop-picker';
import {GeometryForms} from '../../utility/GeometryForms';
import PlusSquare from '../../../assets/icons/general/plus-square.svg';
import PlusImg from '../../../assets/icons/general/Plus-img.svg';
import {QuestionCard} from '../../utility/QuestionCard';
import {IconTemp} from '../../IconTemp';
import {useForm} from '../../../hooks/useForm';

interface Props extends StackScreenProps<StackParams, 'CreateProject'> {}

export const CreateProject = ({navigation}: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const {fontScale} = useWindowDimensions();

  //#region FIRST
  const [categoryList, setCategoryList] = useState<HasTag[]>([]);
  const [userCategories, setUserCategories] = useState<HasTag[]>([]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [showCategoryList, setShowCategoryList] = useState(false); //boolean que controla que se pueda ver la lista de categorias
  const [inputValueOrganization, setInputValueOrganization] = useState(''); //para buscar organizacion
  const [suggestionsSelected, setSuggestionsSelected] = useState<
    Organization[]
  >([]); //las organizaciones seleccionadas
  const [suggestions, setSuggestions] = useState<Organization[]>([]); //las organizaciones sugeridas

  // variables que controlan las imagenes
  const [images, setImages] = useState<string[]>();
  const [isImageCarged, setIsImageCarged] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  //#endregion

  //#region SECOND
  const [isSwitchOnCreator, setIsSwitchOnCreator] = useState(false);
  const [isSwitchOnDataBaseProject, setIsSwitchOnDataBaseProject] =
    useState(false);
  const [isSwitchOnProject, setIsSwitchOnProject] = useState(false);
  //#endregion

  //#region  THIRD
  const [questions, setQuestions] = useState<Question[]>([
    {question_text: 'Cual es algo?', answer_type: 'STR'},
    {question_text: 'Cual es algo xd?', answer_type: 'NUM'},
  ]);

  /**
   * BOOLEAN que controla si se muestra o no el modal
   */
  const [showAnswerTypeList, setShowAnswerTypeList] = useState(false);

  /**
   *  index de la card que está seleccionada
   */
  const [isSelectedCardAnswer, setIsSelectedCardAnswer] = useState(-1);

  /**
   * OBJETO de tipo Question. Es el seleccionado
   */
  const [selectedQuestion, setSelectedQuestion] = useState<Question>({
    question_text: '',
    answer_type: '',
  });
  /**
   * contiene el index del "tipo de respuesta" seleccionado
   */
  const [responseSelected, setResponseSelected] = useState(-1);

  const answerType = [
    // {id: 1, type: 'STR', name: 'Ubicación', icon: 'map-marker'},
    // {id: 2, type: 'STR', name: 'Respuesta corta', icon: 'text'},
    // {id: 3, type: 'STR', name: 'Respuesta larga', icon: 'text-long'},
    // {id: 4, type: 'STR', name: 'Única opción', icon: 'format-list-numbered'},
    // {id: 5, type: 'STR', name: 'Varias opciones', icon: 'format-list-bulleted'},
    // {id: 6, type: 'NUM', name: 'Escala lineal', icon: 'tune'},
    // {id: 7, type: 'IMG', name: 'Foto', icon: 'camera-outline'},
    // {id: 8, type: 'STR', name: 'Fecha', icon: 'calendar-range'},
    // {id: 9, type: 'STR', name: 'Hora', icon: 'clock-time-four-outline'},
    {id: 10, type: 'STR', name: 'Tipo texto', icon: 'text'},
    {id: 11, type: 'NUM', name: 'Tipo numérico', icon: 'numeric'},
    {id: 12, type: 'IMG', name: 'Tipo imagen', icon: 'camera-outline'},
  ];

  const {form, onChange} = useForm<Question>({
    question_text: '',
    answer_type: '',
  });
  //#endregion

  useEffect(() => {
    categoryListApi();
    organizationListApi();
  }, []);

  useEffect(() => {
    if (inputValueOrganization.length <= 0) {
      clearSuggestions();
    }
  }, [inputValueOrganization]);

  useEffect(() => {
    console.log(JSON.stringify(images));
  }, [images]);

  //#region CONTROLAR STEPPER
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  //#endregion

  //#region API CALLS
  const categoryListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<HasTag[]>('/project/hastag/', {
        headers: {
          Authorization: token,
        },
      });
      setCategoryList(resp.data);
      resp.data.map(x => {
        if (userCategories.includes(x)) {
          setUserCategories(
            userCategories.filter(selectedItem => selectedItem !== x),
          );
        }
      });
    } catch {}
  };

  const organizationListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Organization[]>('/organization/', {
        headers: {
          Authorization: token,
        },
      });
      setOrganizationList(resp.data);
    } catch {}
  };
  //#endregion

  //#region METHODS

  //#region FIRST

  /**
   * Comprueba si existen categorias preestablecidas. Sirve para controlar los check y saber qué categorias están
   * seleccionadas
   * @param item categoria
   */
  const setCheckCategories = (item: HasTag) => {
    // Verificar si el elemento ya está seleccionado
    if (userCategories.includes(item)) {
      setUserCategories(
        userCategories.filter(selectedItem => selectedItem !== item),
      );
    } else {
      setUserCategories([...userCategories, item]);
    }
  };

  const handleInputChangeOrganization = (text: string) => {
    setInputValueOrganization(text);
    setSuggestions(
      organizationList.filter(suggestion =>
        suggestion.principalName
          .toLocaleLowerCase()
          .includes(text.toLowerCase()),
      ),
    );
  };

  const handleSuggestionPress = (suggestion: Organization) => {
    // Keyboard.dismiss();
    setInputValueOrganization(suggestion.principalName);
    setSuggestions([]);
    console.log(JSON.stringify(suggestion));
    // if (!suggestionsSelected.includes(suggestion)) {
    //   setSuggestionsSelected([...suggestionsSelected, suggestion]);
    //   console.log('entra en handleSugestion y entra dentro si incluye o no');
    // }
  };

  const handleInputBlur = () => {
    // Si el input está en blanco o se pierde el foco, limpiar las sugerencias
    clearSuggestions();
    if (!inputValueOrganization.trim()) {
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    }).then(response => {
      //   console.log(JSON.stringify(response[0].sourceURL));
      if (response && response[0].data) {
        const newImage = response[0].data;
        setImages([newImage]);
        setActiveImageIndex(0);
        setIsImageCarged(true);
      }
    });
  };

  const deleteImage = () => {
    setIsImageCarged(false);
    setImages(undefined);
  };

  //#endregion

  //#region SECOND
  const onToggleSwitchCreator = () => setIsSwitchOnCreator(!isSwitchOnCreator);
  const onToggleSwitchDataBaseProject = () =>
    setIsSwitchOnDataBaseProject(!isSwitchOnDataBaseProject);
  const onToggleSwitchProject = () => setIsSwitchOnProject(!isSwitchOnProject);
  //#endregion

  //#region THIRD

  /**
   * Sirve para seleccionar una card
   * tiene que guardar el index que pertenece al answerType
   * @param i index de las cards para seleccionar una
   * @param  index de las cards para seleccionar una
   */
  const onSelectedCard = (i: number, item : Question) => {
    setIsSelectedCardAnswer(i);
    const indiceAmswerType = knowAnswerType(item)
    setResponseSelected(indiceAmswerType);
    // const temp = questions.find((x, index) => index === i);
    // if (temp) setSelectedQuestion(temp);
    setSelectedQuestion(item)
  };

  const onResponseSelected = (response: number) => {
    setResponseSelected(response);
  };

  const createAnswer = () => {
    setQuestions([...questions, {question_text: '', answer_type: ''}]);
  };

  const onDelete = (item: Question) => {
    const arrayCopy = [...questions];
    const index = questions.indexOf(item);
    if (index !== -1) {
      arrayCopy.splice(index, 1);
      setQuestions(arrayCopy);
    }
  };

  const duplicate = (item: Question) => {
    setQuestions([...questions, item]);
  };

  /**
   * guarda el indice de la card
   * @param index indice
   */
  const onEditResponseType = (index: number, item : Question) => {
    onSelectedCard(index, item);
    setShowAnswerTypeList(true);
  };

  /**
   *  funciona por dentro
   * @param x id del asnwerType
   */
  const onSelectResponseTypeModal = (type: string, index: number) => {
    console.log(index + ' ' + type)
    setQuestions(prevQuestions => {
      return prevQuestions.map((question, i) => {
        if (question === selectedQuestion) {
          return {...selectedQuestion, ['answer_type']: type};
        }
        return question;
      });
    });
    // setResponseType(type)
  };

  const showData = () => {
    questions.map(x => {
      console.log(JSON.stringify(x, null, 2));
    });
  };

  // Función para manejar cambios en las tarjetas
  // CAMBIA EL TEXTO DEL INPUT
  const handleQuestionChange = (
    index: number,
    fieldName: string,
    value: any,
  ) => {
    // Encuentra la tarjeta por su ID y actualiza los datos
    setQuestions(prevQuestions => {
      return prevQuestions.map((question, i) => {
        if (i === index) {
          return {...question, [fieldName]: value};
        }
        return question;
      });
    });
  };

  const setAnswerType = (type: string) => {
    const temp = answerType.find(
      x => x.type.toLocaleLowerCase() === type.toLocaleLowerCase(),
    )?.name;
    // console.log(temp);
    return temp;
  };

  /**
   * 
   * @param item este valor es el item que se envía para saber su answer type
   * @returns devuelve el answer type que corresponda
   */
  const knowAnswerType = (item: Question) => {
    const temp = answerType.findIndex((x)=> x.type.toLowerCase() === item.answer_type.toLowerCase());
    return temp;
  };

  //#endregion

  //#endregion

  //#region RENDERS

  const firstScreen = () => {
    return (
      <KeyboardAvoidingView>
        <View
          style={{
            alignItems: 'center',
            // width: '80%',
          }}>
          {/* imagenes */}
          <View
            style={{
              marginVertical: RFPercentage(1),
              //   backgroundColor: 'red',
            }}>
            <Text style={{color: 'black'}}>Imagenes del proyecto</Text>
            {!images && (
              <View style={{width: RFPercentage(41), justifyContent: 'center'}}>
                <IconButton
                  icon="image-album"
                  iconColor="#5F4B66"
                  size={Size.iconSizeLarge}
                  onPress={() => selectImage()}
                />
              </View>
            )}
            {images && (
              <View
                style={{
                  //   alignItems: 'center',
                  //   justifyContent: 'center',
                  height: RFPercentage(15),
                  width: RFPercentage(41),
                  marginBottom: RFPercentage(2),
                  marginTop: RFPercentage(2),
                  padding: 10,
                  flexDirection: 'row',
                }}>
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + images[0],
                  }}
                  style={{
                    position: 'absolute',
                    height: RFPercentage(15),
                    width: RFPercentage(13),
                    backgroundColor: 'white',
                    // alignSelf: 'flex-start',
                    borderRadius: 10,
                    zIndex: 1,
                    left: RFPercentage(4),
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                />
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + images[0],
                  }}
                  style={{
                    position: 'absolute',
                    height: RFPercentage(15),
                    width: RFPercentage(13),
                    borderRadius: 10,
                    zIndex: 0,
                    left: RFPercentage(10),
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                />
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + images[0],
                  }}
                  style={{
                    position: 'absolute',
                    height: RFPercentage(15),
                    width: RFPercentage(13),
                    backgroundColor: 'green',
                    // alignSelf: 'center',
                    borderRadius: 10,
                    zIndex: -1,
                    left: RFPercentage(16),
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                />
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + images[0],
                  }}
                  style={{
                    position: 'absolute',
                    height: RFPercentage(15),
                    width: RFPercentage(13),
                    backgroundColor: 'green',
                    // alignSelf: 'center',
                    borderRadius: 10,
                    zIndex: -2,
                    left: RFPercentage(22),
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                />
                <TouchableOpacity
                  style={{
                    width: RFPercentage(5),
                    position: 'absolute',
                    bottom: RFPercentage(-2),
                    left: RFPercentage(18),
                    zIndex: 999,
                  }}>
                  {/* <IconButton
                    icon="image-album"
                    iconColor="#5F4B66"
                    size={Size.iconSizeLarge}
                    onPress={() => selectImage()}
                  /> */}
                  <PlusSquare
                    width={RFPercentage(4)}
                    height={RFPercentage(4)}
                    fill={'#0059ff'}
                  />
                </TouchableOpacity>
                {/* <Button
                  //   style={{margin: 15, width: 150, alignSelf: 'center'}}
                  title="borrar imagen"
                  onPress={() => deleteImage()}
                /> */}
              </View>
            )}
          </View>
          {/* nombre de del proyecto */}
          <View
            style={{
              width: '100%',
              marginVertical: RFPercentage(1),
            }}>
            <Text style={{color: 'black'}}>Nombre del proyecto</Text>
            <InputText
              // isInputText={() => setIsInputText(!isInputText)}
              label={'Nombre del proyecto'}
              keyboardType="default"
              multiline={false}
              numOfLines={1}
              onChangeText={value => console.log(value)}
            />
          </View>
          {/* descripcion del proyecto */}
          <View
            style={{
              width: '100%',
              marginVertical: RFPercentage(1),
            }}>
            <Text style={{color: 'black'}}>Descripción del proyecto</Text>
            <InputText
              // isInputText={() => setIsInputText(!isInputText)}
              label={'Escribe la descripción'}
              keyboardType="default"
              multiline={true}
              maxLength={300}
              numOfLines={5}
              onChangeText={value => console.log(value)}
            />
          </View>
          {/* add categories */}
          <View
            style={{
              width: '100%',
              marginVertical: RFPercentage(1),
            }}>
            <Text style={{color: 'black'}}>Añadir categorías al proyecto</Text>
            <View style={{width: RFPercentage(41)}}>
              <CustomButton
                backgroundColor={Colors.secondaryDark}
                label={'Seleccionar categorías'}
                onPress={() => setShowCategoryList(true)}
              />
            </View>
          </View>
          {/* lista de categorias */}
          {userCategories && (
            <>
              {userCategories.map(x => {
                return (
                  <View
                    key={x.id}
                    style={{
                      width: RFPercentage(41),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: RFPercentage(1),
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{}}>
                        <Hashtag
                          fill={'black'}
                          width={RFPercentage(4)}
                          height={RFPercentage(4)}
                        />
                      </View>
                      <Text
                        style={{
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          marginHorizontal: RFPercentage(2),
                        }}>
                        {x.hasTag}
                      </Text>
                    </View>

                    <View style={{width: RFPercentage(8)}}>
                      <CustomButton
                        backgroundColor={'transparent'}
                        label={'Eliminar'}
                        onPress={() => setCheckCategories(x)}
                        fontColor="red"
                        outlineColor="red"
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}
          {/* add organizaciones */}
          {/* <View
            style={{
              width: '100%',
              marginVertical: RFPercentage(1),
            }}>
            <Text style={{color: 'black', marginBottom: '2%'}}>
              Añadir organizaciones al proyeto
            </Text>
            <View
              style={{width: RFPercentage(41), marginBottom: RFPercentage(4)}}>
              <View style={styles.container}>
                <TextInput
                  // ref={inputRefs.inputOrganization}
                  onBlur={handleInputBlur}
                  style={styles.input}
                  placeholder="Escribe el nombre de la organización"
                  value={inputValueOrganization}
                  onChangeText={handleInputChangeOrganization}
                />
                {suggestions.length > 0 &&
                  suggestions.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionsList}
                      //   onBlur={handleInputBlur}
                      onPress={() => handleSuggestionPress(item)}>
                      <Text style={styles.suggestionItem}>
                        {item.principalName}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View> */}

          {/* lista de organizaciones */}
          {/* {suggestionsSelected && (
              <>
                {suggestionsSelected.map(x => {
                  return (
                    <View
                      key={x.id}
                      style={{
                        width: RFPercentage(41),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: RFPercentage(1),
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{}}>
                          <Hashtag
                            fill={'black'}
                            width={RFPercentage(4)}
                            height={RFPercentage(4)}
                          />
                        </View>
                        <Text
                          style={{
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginHorizontal: RFPercentage(2),
                          }}>
                          {x.principalName}
                        </Text>
                      </View>

                      <View style={{width: RFPercentage(8)}}>
                        <CustomButton
                          backgroundColor={'transparent'}
                          label={'Eliminar'}
                          onPress={() => console.log()}
                          fontColor="red"
                          outlineColor="red"
                        />
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </View> */}

          {/* testeo organizacinoes */}
          <View
            style={{
              width: '100%',
              marginVertical: RFPercentage(1),
            }}>
            <Text style={{color: 'black', marginBottom: '2%'}}>
              Añadir organizaciones al proyeto
            </Text>
            <View
              style={{
                width: RFPercentage(41),
                marginBottom: RFPercentage(4),
              }}>
              <TextInput
                placeholder="Search..."
                value={inputValueOrganization}
                onChangeText={handleInputChangeOrganization}
                style={styles.input}
              />
              {suggestions.length > 0 &&
                suggestions.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionsList}
                    //   onBlur={handleInputBlur}
                    onPress={() => handleSuggestionPress(item)}>
                    <Text style={styles.suggestionItem}>
                      {item.principalName}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const secondScreen = () => {
    return (
      <>
        <KeyboardAvoidingView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              width: RFPercentage(41),
              marginHorizontal: RFPercentage(2),
              //   backgroundColor: 'red',
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: RFPercentage(1),
                // backgroundColor: 'red'
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: RFPercentage(1),
                }}>
                <Text style={{color: 'black'}}>
                  Privacidad base de datos del proyecto
                </Text>
                <Switch
                  value={isSwitchOnDataBaseProject}
                  onValueChange={onToggleSwitchDataBaseProject}
                />
              </View>
              <Text
                style={{
                  color: Colors.contentQuaternaryDark,
                  fontSize: FontSize.fontSizeText13,
                  width: '80%',
                  alignSelf: 'flex-start',
                  marginLeft: '3%',
                  //   backgroundColor:'green'
                }}>
                Si lo activas, bla bla bla balbla bla bla balbla bla bla balbla
                bla bla balbla bla bla balbla bla bla balbla bla bla bal
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: RFPercentage(1),
                }}>
                <Text style={{color: 'black'}}>Privacidad del proyecto</Text>
                <Switch
                  value={isSwitchOnProject}
                  onValueChange={onToggleSwitchProject}
                />
              </View>
              <Text
                style={{
                  color: Colors.contentQuaternaryDark,
                  fontSize: FontSize.fontSizeText13,
                  width: '80%',
                  alignSelf: 'flex-start',
                  marginLeft: '3%',
                  //   backgroundColor:'green'
                }}>
                Si lo activas, bla bla bla balbla bla bla balbla bla bla balbla
                bla bla balbla bla bla balbla bla bla balbla bla bla bal
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 'auto',
              alignSelf: 'center',
              //   backgroundColor:'green'
            }}>
            <View style={{}}>
              {isSwitchOnProject && (
                <>
                  {/* password */}
                  <View
                    style={{
                      //   width: '80%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        // left: '-5%',
                        marginLeft: -RFPercentage(3),
                        top: '50%',
                        alignSelf: 'center',
                        // justifyContent: 'center',
                        position: 'absolute',
                        paddingLeft: RFPercentage(1),
                        // backgroundColor:'green'
                      }}>
                      {true ? (
                        <GeometryForms
                          name="circle-fill"
                          size={Size.iconSizeExtraMin}
                          color={Colors.semanticSuccessLight}
                        />
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{
                        width: RFPercentage(41),
                      }}>
                      <InputText
                        // isInputText={() => setIsInputText(!isInputText)}
                        label={'Escriba la contraseña'}
                        inputType={true}
                        multiline={false}
                        numOfLines={1}
                        isSecureText={true}
                        onChangeText={value => console.log('password')}
                      />
                    </View>
                  </View>
                  {/* password repeat */}
                  <View
                    style={{
                      width: RFPercentage(41),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        marginLeft: -RFPercentage(3),
                        top: '50%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        paddingLeft: RFPercentage(1),
                      }}>
                      {true ? (
                        <GeometryForms
                          name="circle-fill"
                          size={Size.iconSizeExtraMin}
                          color={Colors.semanticSuccessLight}
                        />
                      ) : (
                        <></>
                      )}
                    </View>
                    <InputText
                      // isInputText={() => setIsInputText(!isInputText)}
                      label={'Confirma la contraseña'}
                      inputType={true}
                      multiline={false}
                      numOfLines={1}
                      isSecureText={true}
                      onChangeText={value => console.log('password')}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  };

  const thirdScreen = () => {
    return (
      <>
        <KeyboardAvoidingView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              width: '100%',
              marginHorizontal: RFPercentage(1),
            }}>
            <ScrollView>
              {questions.map((item, index) => (
                <QuestionCard
                  onPress={() => onSelectedCard(index, item)}
                  onEdit={() => onEditResponseType(index, item)}
                  onDelete={() => onDelete(item)}
                  onDuplicate={() => duplicate(item)}
                  onFocus={() => onSelectedCard(index, item)}
                  key={index}
                  index={index + 1}
                  selected={index === isSelectedCardAnswer}
                  form={item}
                  onChangeText={(fieldName, value) =>
                    handleQuestionChange(index, fieldName, value)
                  }
                  responseType={item.answer_type}
                />
              ))}
              <TouchableOpacity
                style={{width: RFPercentage(4), alignSelf: 'center'}}
                onPress={createAnswer}>
                <PlusImg
                  style={{
                    position: 'relative',
                    alignSelf: 'center',
                    marginVertical: RFPercentage(3),
                  }}
                  height={RFPercentage(4)}
                  width={RFPercentage(4)}
                  fill={'black'}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  };

  //#endregion

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={RFPercentage(2)}
      style={{flex: 1, backgroundColor: 'transparent'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajusta la vista por encima del teclado
    >
      <SafeAreaView style={{flexGrow: 1}}>
        <HeaderComponent
          title={'Crear un nuevo proyecto'}
          onPressLeft={() => navigation.goBack()}
          rightIcon={false}
        />
        {/* <TouchableWithoutFeedback onPress={handlePressOutside}> */}
        <View style={styles.container}>
          {/* los puntitos */}
          <View style={styles.stepsContainer}>
            {Array.from({length: totalSteps}, (_, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  index === currentStep - 1 && styles.activeStepDot,
                ]}
              />
            ))}
          </View>
          {/* cada elemento de aquí dentro contendrá cada vista de la creación del proyecto. Dentro habrá un scrollview para cada elemento? */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              // height: 'auto',
            }}
            style={{}}
            //   keyboardShouldPersistTaps="handled"
          >
            {currentStep === 1 && firstScreen()}
            {currentStep === 2 && secondScreen()}
            {currentStep === 3 && thirdScreen()}
            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <CustomButton
                  backgroundColor={Colors.secondaryDark}
                  label={'Volver'}
                  onPress={handlePrevStep}
                />
              )}
              {currentStep < totalSteps && (
                <CustomButton
                  backgroundColor={Colors.primaryDark}
                  label={'Continuar'}
                  onPress={handleNextStep}
                />
              )}
              {currentStep === 3 && (
                <CustomButton
                  backgroundColor={Colors.primaryDark}
                  label={'Crear y continuar'}
                  onPress={() => showData()}
                />
              )}
            </View>
          </ScrollView>
          {showCategoryList && (
            <View style={styles.showCategoryView}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  height: 10,
                  marginBottom: '2%',
                }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 50,
                    backgroundColor: 'grey',
                    height: 8,
                    width: '10%',
                  }}></TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: '4%',
                  marginHorizontal: RFPercentage(4),
                }}>
                <View>
                  <Text>Categorías</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => setShowCategoryList(false)}>
                    <Text style={{color: Colors.lightblue}}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '90%',
                }}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={categoryList}
                renderItem={({item, index}) => {
                  const isChecked = userCategories.includes(item);
                  return (
                    <View
                      style={{
                        width: RFPercentage(42),
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                      }}>
                      <Checkbox
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setCheckCategories(item);
                        }}
                      />
                      <Text>{item.hasTag}</Text>
                    </View>
                  ); //aquí poner el plus
                }}
              />
            </View>
          )}
          {showAnswerTypeList && (
            <View style={styles.showCategoryView}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  height: 10,
                  marginBottom: '2%',
                }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 50,
                    backgroundColor: 'grey',
                    height: 8,
                    width: '10%',
                  }}></TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: '4%',
                  marginHorizontal: RFPercentage(4),
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: FontSize.fontSizeText14,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    Tipo de respuesta
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAnswerTypeList(false),
                        setResponseSelected(-1),
                        setSelectedQuestion({
                          question_text: '',
                          answer_type: '',
                        });
                    }}>
                    <Text style={{color: Colors.lightblue}}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '90%',
                }}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={answerType}
                renderItem={({item, index}) => {
                  const isChecked = index === responseSelected ? true : false; //solo sirve para marcar el que está seleccionado
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        width: RFPercentage(42),
                      }}>
                      {isChecked ? (
                        <View style={{width: RFPercentage(30)}}>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => setResponseSelected(-1)}
                            // onPress={() => setResponseSelectedObject(item)}
                            // onPress={() => onSelectResponseTypeModal(-1)}
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              height: 35,
                              borderRadius: 12,
                              marginTop: '2.5%',
                              backgroundColor: Colors.primaryDark,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row', // Coloca el icono y el texto en una fila
                                alignItems: 'center', // Centra verticalmente el contenido
                                justifyContent: 'flex-start', // Alinea el contenido al principio (izquierda)
                                paddingHorizontal: RFPercentage(5), // Añade espaciado horizontal al contenido
                                backgroundColor: 'transparent',
                              }}>
                              <View
                                style={{
                                  marginRight: 'auto',
                                  marginLeft: RFPercentage(1),
                                }}>
                                <IconTemp
                                  name={item.icon}
                                  size={Size.iconSizeMin}
                                  style={{alignSelf: 'center'}}
                                />
                              </View>

                              <Text
                                style={{
                                  flex: 1, // Permite que el texto ocupe el espacio restante
                                  textAlign: 'center', // Centra horizontalmente el texto
                                  fontWeight: '500',
                                  fontSize: FontSize.fontSizeText14 / fontScale,
                                  alignSelf: 'center',
                                  fontFamily: FontFamily.NotoSansDisplayMedium,
                                  color: '#fff',
                                }}>
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{width: RFPercentage(22)}}>
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => {
                                onResponseSelected(index), //se guarda el index del type
                                onSelectResponseTypeModal(item.type, index), // se modifica la question para que cambie su type
                                setShowAnswerTypeList(false); // se cierra el modal
                            }}
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              height: 35,
                              borderRadius: 12,
                              marginTop: '2.5%',
                              backgroundColor: Colors.contentSecondaryDark,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row', // Coloca el icono y el texto en una fila
                                alignItems: 'center', // Centra verticalmente el contenido
                                justifyContent: 'flex-start', // Alinea el contenido al principio (izquierda)
                                paddingHorizontal: RFPercentage(1), // Añade espaciado horizontal al contenido
                                backgroundColor: 'transparent',
                              }}>
                              <View
                                style={{
                                  marginRight: 'auto',
                                  marginLeft: RFPercentage(1),
                                }}>
                                <IconTemp
                                  name={item.icon}
                                  size={Size.iconSizeMin}
                                  style={{alignSelf: 'center'}}
                                />
                              </View>

                              <Text
                                style={{
                                  flex: 1,
                                  textAlign: 'left',
                                  fontWeight: '500',
                                  fontSize: FontSize.fontSizeText14 / fontScale,
                                  alignSelf: 'center',
                                  fontFamily: FontFamily.NotoSansDisplayMedium,
                                  color: '#000000',
                                  marginLeft: '15%',
                                }}>
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
        {/* </TouchableWithoutFeedback> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
  },
  activeStepDot: {
    backgroundColor: Colors.contentQuaternaryLight,
  },
  stepText: {
    fontSize: 18,
    marginBottom: 20,
  },
  showCategoryView: {
    position: 'absolute',
    backgroundColor: 'white',
    // height: RFPercentage(80),
    width: '100%',
    zIndex: 200,
    bottom: 0,
    alignSelf: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
    paddingVertical: '5%',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: RFPercentage(41),
    marginVertical: '5%',
    alignSelf: 'center',
  },
  //estilos del input buscador de organizaciones

  input: {
    fontSize: FontSize.fontSizeText13,
    marginBottom: 10,
    width: RFPercentage(41),
    height: RFPercentage(4.5),
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: RFPercentage(1.4),
  },
  suggestionsList: {
    position: 'absolute',
    top: 40,
    // left: 0,
    // right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 999,
    width: RFPercentage(38),
    // height: RFPercentage(6),
  },
  suggestionItem: {
    padding: 10,
    // borderBottomWidth: 1,
    height: RFPercentage(6),
    // backgroundColor: 'gray',
    textAlignVertical: 'center',
    color: 'black',
  },
});
