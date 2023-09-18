import React, {useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '../../../navigation/MultipleNavigator';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {HeaderComponent} from '../../HeaderComponent';
import {CustomButton} from '../../utility/CustomButton';
import {Colors} from '../../../theme/colors';
import {InfoModal, SaveProyectModal} from '../../utility/Modals';
import PlusImg from '../../../assets/icons/general/Plus-img.svg';
import {Size} from '../../../theme/size';
import {IconButton} from 'react-native-paper';
import {InputText} from '../../utility/InputText';
import ImagePicker from 'react-native-image-crop-picker';
import {FontSize} from '../../../theme/fonts';
import {UserInfo} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {CustomButtonOutline} from '../../utility/CustomButtonOutline';
import {useForm} from '../../../hooks/useForm';
import {CommonActions} from '@react-navigation/native';

interface Props extends StackScreenProps<StackParams, 'CreateOrganization'> {}

export const CreateOrganization = ({navigation}: Props) => {
  useEffect(() => {}, []);

  // variables de las imagenes
  const [profileImage, setProfileImage] = useState<string[]>();
  const [organizationImage, setOrganizationImage] = useState<string[]>();
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);
  const [suggestionsSelected, setSuggestionsSelected] = useState<UserInfo[]>(
    [],
  );
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [inputValueUser, setInputValueUser] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const {form, onChange} = useForm({});
  const [isOk, setIsOk] = useState(false);

  useEffect(() => {
    UserListApi();
  }, []);

  useEffect(() => {
    if (inputValueUser === '') {
      setSuggestions([]);
    }
  }, [inputValueUser]);

  /**
   * controla que cuando haya algo que mostrar en la busqueda, la pantalla evite el teclado
   */
  useEffect(() => {
    let count = 0;

    if (suggestions.length == 1) {
      // count = (suggestions.length - 1) * 12;
      count = suggestions.length * 12;
    } else if (suggestions.length === 2) {
      count = 19;
    } else if (suggestions.length >= 3) {
      count = 26;
      // count = (suggestions.length - 1) * 12;
    } else {
      // count = suggestions.length * 12;
      count = 24;
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: RFPercentage(count), animated: true});
    }
  }, [suggestions]);

  /**
   * Elementos del modal
   */
  const [saveModal, setSaveModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const showModalSave = () => setSaveModal(true);
  const showModalInfo = () => setInfoModal(true);
  const hideModalSave = () => setSaveModal(false);
  const hideModalInfo = () => setInfoModal(false);

  const UserListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<UserInfo[]>('/users/list/', {
        headers: {
          Authorization: token,
        },
      });
      setUserList(resp.data);
    } catch {}
  };

  const openProfilePhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    }).then(response => {
      //   console.log(JSON.stringify(response[0].sourceURL));
      if (response && response.data) {
        const newImage = response.data;
        setProfileImage([newImage]);
      }
    });
  };

  const openPortadaPhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    }).then(response => {
      //   console.log(JSON.stringify(response[0].sourceURL));
      if (response && response.data) {
        const newImage = response.data;
        setOrganizationImage([newImage]);
      }
    });
  };

  const handleInputChangeUser = (text: string) => {
    setInputValueUser(text);
    setSuggestions(
      userList.filter(x =>
        x.username.toLocaleLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  /**
   * Añade a la lista que se mostrará de los usuarios de la organización y lo elimina de la lista de busqueda
   * @param selected UserInfo
   */
  const setUsersSelected = (selected: UserInfo, index: number) => {
    // Verifica si el elemento ya está en suggestionsSelected
    console.log(JSON.stringify(selected, null, 2));
    console.log('SEPARADOR');
    console.log(JSON.stringify(suggestionsSelected, null, 2));
    if (suggestionsSelected.includes(selected)) {
      console.log('entra en el return');
      return;
    }

    // Crea una nueva lista de sugerencias excluyendo selected
    const newSuggestions = suggestions.filter(item => item !== selected);
    // const newSuggestions = suggestions.splice(index, 1);

    // Establece la nueva lista de sugerencias como estado
    setSuggestions(newSuggestions);

    // Agrega el elemento a suggestionsSelected
    setSuggestionsSelected([...suggestionsSelected, selected]);

    setInputValueUser('');
  };

  /**
   * Elimina de la lista de usuarios de la organización al seleccionado.
   * Una vez hecho, le pasa ese usuario de nuevo a la lista de busqueda
   * @param item UserInfo a borrar de la lista
   * @returns
   */
  const moveItemToSuggestions = (index: number) => {
    if (index < 0 || index >= suggestionsSelected.length) {
      return; // Verifica si el índice está dentro de los límites válidos
    }

    // Obtiene el elemento a mover de suggestionsSelected
    const itemToMove = suggestionsSelected[index];

    // si existe, le hace el slice
    if (!itemToMove) {
      return;
    }
    const newSugSelected = suggestionsSelected.filter((x, i) => i !== index);

    setSuggestionsSelected(newSugSelected);
    //si lo incluye, no se copia, sino si
    if (suggestions.includes(itemToMove)) {
      return;
    }
    // Crea una nueva lista sin el elemento
    // const newSelected = [...suggestionsSelected];
    // console.log(newSelected)
    // newSelected.splice(index, 1);
    // setSuggestionsSelected(newSelected);

    // Agrega el elemento a suggestions
    setSuggestions([...suggestions, itemToMove]);
  };

  //#region CREATE

  const onCreate = () => {
    console.log(JSON.stringify(form, null, 2));
    //comprobar que todo está bien antes de crear
    if (!isOk) {
      showModalSave();
    } else {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'OrganizationPage',
          params: {id: 1, isNew: true},
        }),
      );
    }
  };

  //#endregion

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={RFPercentage(2)}
        style={{flex: 1, backgroundColor: 'transparent'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajusta la vista por encima del teclado
      >
        <SafeAreaView
          style={{flexGrow: 1}}
          onTouchEnd={() => {
            setSuggestions([]), setInputValueUser('');
          }}>
          <HeaderComponent
            title={'Crear una nueva organización'}
            onPressLeft={() => navigation.goBack()}
            rightIcon={false}
          />
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              ref={scrollViewRef}>
              {/* contenido principal */}
              <View
                style={{
                  alignItems: 'center',
                }}>
                {/* imagenes */}
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    width: RFPercentage(41),
                    height: RFPercentage(22),
                  }}>
                  {/* perfil */}
                  <View
                    style={{
                      marginVertical: RFPercentage(1),
                      alignItems: 'center',
                      //   marginHorizontal: RFPercentage(1),
                      // backgroundColor:'purple',
                      width: '40%',
                    }}>
                    <Text style={{color: 'black', marginBottom: '2%'}}>
                      Imagenes del perfil
                    </Text>
                    {!profileImage && (
                      <View
                        style={{
                          width: '73%',
                          height: '62%',
                          marginTop: '4%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.contentTertiaryLight,
                          borderRadius: 100,
                          padding: '2%',
                        }}>
                        {/* TODO cambiar el icono por un touchable */}
                        <IconButton
                          icon="account-outline"
                          iconColor="#000000"
                          size={Size.iconSizeLarge}
                          onPress={() => openProfilePhoto()}
                        />
                      </View>
                    )}
                    {profileImage && (
                      <View
                        style={{
                          width: '73%',
                          height: '62%',
                          marginTop: '4%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // backgroundColor: Colors.contentTertiaryLight,
                          borderRadius: 100,
                          padding: '2%',
                        }}>
                        <Image
                          source={{
                            uri: 'data:image/jpeg;base64,' + profileImage,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50,
                            resizeMode: 'cover',
                          }}
                        />

                        <TouchableOpacity
                          onPress={() => openProfilePhoto()}
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(6.2),
                            zIndex: 999,
                          }}>
                          <PlusImg
                            width={RFPercentage(3)}
                            height={RFPercentage(3)}
                            fill={'#0059ff'}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {/* portada */}
                  <View
                    style={{
                      marginVertical: RFPercentage(1),
                      alignItems: 'center',
                      width: '60%',
                    }}>
                    <Text style={{color: 'black', marginBottom: '2%'}}>
                      Imagenes de portada
                    </Text>
                    {!organizationImage && (
                      <View
                        style={{
                          width: '80%',
                          height: '60%',
                          marginTop: '4%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: Colors.contentTertiaryLight,
                          borderRadius: 10,
                          padding: '2%',
                          //   paddingBottom: '2%'
                        }}>
                        <IconButton
                          icon="image-album"
                          iconColor="#000000"
                          size={Size.iconSizeLarge}
                          onPress={() => openPortadaPhoto()}
                        />
                      </View>
                    )}
                    {organizationImage && (
                      <View
                        style={{
                          width: '80%',
                          height: '61%',
                          marginTop: '3.5%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // backgroundColor: Colors.contentTertiaryLight,
                          borderRadius: 10,
                          padding: '2%',
                        }}>
                        <Image
                          source={{
                            uri: 'data:image/jpeg;base64,' + organizationImage,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                            resizeMode: 'cover',
                          }}
                        />

                        <TouchableOpacity
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(18),
                            zIndex: 999,
                          }}>
                          <PlusImg
                            width={RFPercentage(3)}
                            height={RFPercentage(3)}
                            fill={'#0059ff'}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                {/* nombre de la organizacion */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>
                    Nombre de la organización
                  </Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Escribe el nombre de la organización...'}
                    keyboardType="default"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value =>
                      onChange(value, 'principalName' as never)
                    } //faltan poner los values
                  />
                </View>
                {/* biografia */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Biografía</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={'Presenta tu organización en la biografia'}
                    keyboardType="default"
                    multiline={true}
                    maxLength={300}
                    numOfLines={5}
                    onChangeText={value =>
                      onChange(value, 'biography' as never)
                    }
                  />
                </View>
                {/* integrantes */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black', marginBottom: '2%'}}>
                    Añadir integrantes
                  </Text>
                  <View
                    style={{
                      width: RFPercentage(41),
                      marginBottom: RFPercentage(4),
                    }}>
                    <TextInput
                      placeholder="Buscar..."
                      value={inputValueUser}
                      onChangeText={text => {
                        handleInputChangeUser(text);
                      }}
                      style={styles.input}
                    />
                    <TouchableOpacity onPress={() => showModalInfo()}>
                      <Text
                        style={{
                          color: Colors.primaryDark,
                          marginHorizontal: '2%',
                          marginTop: '1%',
                        }}>
                        ¿Cómo añadir integrantes?
                      </Text>
                    </TouchableOpacity>
                    {suggestions.length > 0 &&
                      suggestions.map((item, index) => (
                        <TouchableOpacity
                          key={item.id}
                          style={{
                            ...styles.suggestionsList,
                            borderBottomLeftRadius:
                              index === suggestions.length - 1 ? 10 : 0,
                            borderBottomRightRadius:
                              index === suggestions.length - 1 ? 10 : 0,
                          }}
                          onPress={() => setUsersSelected(item, index)}>
                          <Text style={styles.suggestionItem}>
                            {item.username}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    {suggestionsSelected.length > 0 && (
                      <Text
                        style={{
                          fontSize: FontSize.fontSizeText14 + 1,
                          color: 'black',
                          marginTop: '10%',
                          marginBottom: '3%',
                        }}>
                        Lista de integrantes
                      </Text>
                    )}
                    {suggestionsSelected.length > 0 &&
                      suggestionsSelected.map((item, index) => (
                        <View
                          style={{
                            width: RFPercentage(41),
                            marginVertical: '4%',
                            flexDirection: 'row',
                          }}
                          key={index + 1}>
                          {/* sustituir por avatar */}
                          <View
                            style={{
                              backgroundColor: 'red',
                              width: '10%',
                              marginRight: '5%',
                              borderRadius: 50,
                            }}></View>
                          {/* sustituir texto de abajo por el que sea */}
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              width: '60%',
                            }}>
                            <Text
                              style={{
                                fontSize: FontSize.fontSizeText14,
                                color: 'black',
                              }}>
                              {item.username}
                            </Text>
                            <Text
                              style={{
                                fontSize: FontSize.fontSizeText13,
                                color: Colors.contentQuaternaryLight,
                              }}>
                              {item.username}
                            </Text>
                          </View>
                          {/* que elimine de la lista */}
                          <View style={{width: '20%', marginLeft: '5%'}}>
                            <CustomButton
                              onPress={() => moveItemToSuggestions(index)}
                              backgroundColor="transparen"
                              fontColor="red"
                              label="Eliminar"
                              outlineColor="red"
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
              {/* boton crear */}
              <View style={styles.buttonContainer}>
                <CustomButton
                  backgroundColor={Colors.contentTertiaryLight}
                  label={'Crear organización'}
                  onPress={() => onCreate()}
                />
              </View>

              {/* modals */}
              <SaveProyectModal
                visible={saveModal}
                hideModal={hideModalSave}
                onPress={hideModalSave}
                size={RFPercentage(4)}
                color={Colors.semanticWarningDark}
                label="Ha surgido un problema, vuelva a intentarlo."
                helper={false}
              />
              <InfoModal
                visible={infoModal}
                hideModal={hideModalInfo}
                onPress={hideModalInfo}
                size={RFPercentage(4)}
                color={Colors.primaryLigth}
                label="¿Cómo añadir integrantes?"
                subLabel="Debes de escribir el nombre de usuario del integrante al que quieres añadir,
                 automáticamente se le enviará una solicitud para unirse a la organización.
                Una vez el usuario la acepte, pasará a ser integrante de la organización."
                helper={false}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: RFPercentage(41),
    marginVertical: '5%',
    alignSelf: 'center',
  },
  input: {
    fontSize: FontSize.fontSizeText13,
    // marginBottom: 10,
    width: RFPercentage(41),
    height: RFPercentage(4.5),
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: RFPercentage(1.4),
  },
  suggestionsList: {
    position: 'relative',
    top: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // zIndex: 999,
    width: RFPercentage(39),
    alignSelf: 'center',
  },
  suggestionItem: {
    padding: 10,
    height: RFPercentage(6),
    textAlignVertical: 'center',
    color: 'black',
  },
});
