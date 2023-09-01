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
} from 'react-native';
import {Colors} from '../../../theme/colors';
import {StackParams} from '../../../navigation/MultipleNavigator';
import {CustomButton} from '../../utility/CustomButton';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {InputText} from '../../utility/InputText';
import {HasTag} from '../../../interfaces/appInterfaces';
import {Organization} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {Checkbox, IconButton, Switch} from 'react-native-paper';
import Hashtag from '../../../assets/icons/general/Hashtag.svg';
import {FontSize} from '../../../theme/fonts';
import {Size} from '../../../theme/size';
import ImagePicker from 'react-native-image-crop-picker';
import {GeometryForms} from '../../utility/GeometryForms';
import PlusSquare from '../../../assets/icons/general/plus-square.svg';

interface Props extends StackScreenProps<StackParams, 'CreateProject'> {}

export const CreateProject = ({navigation}: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  //control de inputs
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

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
                  }}
                  
                  >
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
              width: RFPercentage(41),
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
                <Text style={{color: 'black'}}>Visibilidad del perfil</Text>
                <Switch
                  value={isSwitchOnCreator}
                  onValueChange={onToggleSwitchCreator}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: RFPercentage(1),
                }}>
                <Text style={{color: 'black'}}>Visibilidad del perfil</Text>
                <Switch
                  value={isSwitchOnDataBaseProject}
                  onValueChange={onToggleSwitchDataBaseProject}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: RFPercentage(1),
                }}>
                <Text style={{color: 'black'}}>Visibilidad del perfil</Text>
                <Switch
                  value={isSwitchOnProject}
                  onValueChange={onToggleSwitchProject}
                />
              </View>
              {isSwitchOnProject && (
                <>
                  {/* password */}
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        // left: '-5%',
                        marginLeft: -20,
                        top: '50%',
                        alignSelf: 'center',
                        // justifyContent: 'center',
                        position: 'absolute',
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
                      label={'Escriba la contraseña'}
                      inputType={true}
                      multiline={false}
                      numOfLines={1}
                      isSecureText={true}
                      onChangeText={value => console.log('password')}
                    />
                  </View>
                  {/* password repeat */}
                  <View
                    style={{
                      width: '80%',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        left: '-5%',
                        top: '50%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
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
    return <></>;
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
