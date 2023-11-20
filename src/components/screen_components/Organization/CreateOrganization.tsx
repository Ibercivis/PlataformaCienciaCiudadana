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
import Person from '../../../assets/icons/general/person.svg';
import FrontPage from '../../../assets/icons/project/image.svg';
import {InputText} from '../../utility/InputText';
import ImagePicker from 'react-native-image-crop-picker';
import {FontSize} from '../../../theme/fonts';
import {
  NewOrganization,
  Organization,
  User,
  UserInfo,
} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {useForm} from '../../../hooks/useForm';
import {CommonActions} from '@react-navigation/native';
import {Spinner} from '../../utility/Spinner';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<StackParams, 'CreateOrganization'> {}

export const CreateOrganization = ({navigation, route}: Props) => {
  // variables de las imagenes
  const MAX_CHARACTERS = 500;
  const [profileImage, setProfileImage] = useState<any>();
  const [profileImageBlob, setProfileImageBlob] = useState<any>();
  const [profileImageCharged, setProfileImageCharged] = useState<any>();
  const [organizationImage, setOrganizationImage] = useState<any>();
  const [organizationImageBlob, setOrganizationImageBlob] = useState<any>();
  const [organizationImageCharged, setOrganizationImageCharged] =
    useState<any>();
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);
  const [suggestionsSelected, setSuggestionsSelected] = useState<UserInfo[]>(
    [],
  );
  const [arrayAdminId, setArrayAdminId] = useState<number[]>([]);
  const [arrayMembersId, setArrayMembersId] = useState<number[]>([]);
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [inputValueUser, setInputValueUser] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const {form, onChange} = useForm<NewOrganization>({
    type: [],
    creator: 0,
    administrators: [],
    members: [],
    principalName: '',
    url: '',
    description: '',
    contactName: '',
    contactMail: '',
    logo: '',
    cover: '',
  });
  /**
   * validación
   */
  const [nameValidate, setNameValidate] = useState(true);
  const [mailValidate, setMailValidate] = useState(true);
  const [descriptionValidate, setDescriptionValidate] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [waitingData, setWaitingData] = useState(false);

  /**
   * Llama a la lista de usuarios.
   * TODO además, cuando se entre en edición, se llamará a la organización y se
   * seteará el form y se guardará el id para luego guardarla
   */
  useEffect(() => {
    UserListApi();
  }, []);

  useEffect(() => {
    if (userList.length > 0) {
      if (route.params) {
        if (route.params.id) {
          setIsEdit(true);
          OrganizationApi();
        }
      } else {
        setWaitingData(false);
      }
    }
  }, [userList]);

  useEffect(() => {
    if (inputValueUser === '') {
      setSuggestions([]);
    }
  }, [inputValueUser]);

  /**
   * Se usa para que cuando el arrayAdminId cambie su estado, el form se rellene
   */
  useEffect(() => {
    form.administrators = arrayAdminId;
  }, [arrayAdminId]);

  useEffect(() => {
    form.members = arrayMembersId;
  }, [arrayMembersId]);

  /**
   * controla que cuando haya algo que mostrar en la busqueda, la pantalla evite el teclado
   */
  useEffect(() => {
    let count = 0;

    if (suggestions.length == 1) {
      // count = (suggestions.length - 1) * 12;
      count = suggestions.length * 13;
    } else if (suggestions.length === 2) {
      count = 20;
    } else if (suggestions.length >= 3) {
      count = 27;
      // count = (suggestions.length - 1) * 12;
    } else {
      // count = suggestions.length * 12;
      count = 24;
    }
    count += RFPercentage(5);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: RFPercentage(count), animated: true});
    }
  }, [suggestions]);

  /**
   * Elementos del modal
   */
  const [saveModal, setSaveModal] = useState(false);
  const showModalSave = () => setSaveModal(true);
  const hideModalSave = () => setSaveModal(false);
  const [infoModal, setInfoModal] = useState(false);
  const showModalInfo = () => setInfoModal(true);
  const hideModalInfo = () => setInfoModal(false);
  const [controlSizeImage, setControlSizeImage] = useState(false);
  const showModalControlSizeImage = () => setControlSizeImage(true);
  const hideModalControlSizeImage = () => setControlSizeImage(false);

  /**
   * Llama para saber los usuarios que hay para añadir a integrantes
   * Además, setea el array de ids de los administradores a lo que tiene en form
   * ( como es crear, estará vacío pero si edita, estará lleno)
   * lo mismo com members
   */
  const UserListApi = async () => {
    setWaitingData(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<UserInfo[]>('/users/list/', {
        headers: {
          Authorization: token,
        },
      });
      setUserList(resp.data);
      setArrayAdminId(form.administrators);
      setArrayMembersId(form.members);
    } catch {}
  };

  const OrganizationApi = async () => {
    let token;

    while (!token) {
      token = await AsyncStorage.getItem('token');
    }
    try {
      const resp = await citmapApi.get<Organization>(
        `/organization/${route.params.id}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      form.administrators = resp.data.administrators;
      form.members = resp.data.members;
      setArrayAdminId(form.administrators);
      setArrayMembersId(form.members);
      form.contactMail = resp.data.contactMail;
      form.creator = resp.data.creator;
      form.description = resp.data.description;
      form.contactName = resp.data.contactName;
      form.principalName = resp.data.principalName;

      if (resp.data.cover != undefined) {
        setOrganizationImage(resp.data.cover);
        setOrganizationImageBlob(resp.data.cover);
        setOrganizationImageCharged(resp.data.cover);
      }
      if (resp.data.logo != undefined) {
        setProfileImage(resp.data.logo);
        setProfileImageBlob(resp.data.logo);
        setProfileImageCharged(resp.data.logo);
      }
      if (
        resp.data.members.length > 0 &&
        resp.data.administrators.length <= 0
      ) {
        const unique = new Set(suggestionsSelected);
        resp.data.members.forEach(id => {
          const sugg = userList.find(x => x.id === id);
          if (
            sugg &&
            !suggestionsSelected.some(selectedOrg => selectedOrg.id === sugg.id)
          ) {
            unique.add(sugg);
          }
        });
        setSuggestionsSelected([...unique]);
      }
      if (
        resp.data.administrators.length > 0 &&
        resp.data.members.length <= 0
      ) {
        const unique = new Set(suggestionsSelected);
        resp.data.administrators.forEach(id => {
          const sugg = userList.find(x => x.id === id);
          if (
            sugg &&
            !suggestionsSelected.some(selectedOrg => selectedOrg.id === sugg.id)
          ) {
            unique.add(sugg);
          }
        });
        setSuggestionsSelected([...unique]);
      }

      if (resp.data.administrators.length > 0 && resp.data.members.length > 0) {
        const combinedList = resp.data.members.concat(resp.data.administrators);

        const unique = new Set(suggestionsSelected);
        combinedList.forEach(id => {
          const sugg = userList.find(x => x.id === id);
          if (
            sugg &&
            !suggestionsSelected.some(selectedOrg => selectedOrg.id === sugg.id)
          ) {
            unique.add(sugg);
          }
        });
        setSuggestionsSelected([...unique]);
      }
      setWaitingData(false);
    } catch (err) {
      console.log('hay un error: ' + err);
    }
  };

  const openProfilePhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    })
      .then(response => {
        //   console.log(JSON.stringify(response[0].sourceURL));
        if (response && response.data) {
          if (response.size < 4 * 1024 * 1024) {
            const newImage = response;
            setProfileImage(response);
            form.logo = newImage;
            setProfileImageBlob({
              uri: newImage.path, // Debes ajustar esto según la estructura de response
              type: newImage.mime, // Tipo MIME de la imagen
              name: 'profile.jpg', // Nombre de archivo de la imagen (puedes cambiarlo)
            });
            setProfileImageCharged(undefined);
          } else {
            // showModalControlSizeImage();
            Toast.show({
              type: 'error',
              text1: 'Image',
              // text2: 'No se han podido obtener los datos, por favor reinicie la app',
              text2: 'La imagen pesa demasiado. Peso máximo, 4MB',
            });
          }
        } else {
          Toast.show({
            type: 'info',
            text1: 'Image',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: 'Imagen no seleccionada',
          });
        }
      })
      .catch(err => {
        Toast.show({
          type: 'info',
          text1: 'Image',
          // text2: 'No se han podido obtener los datos, por favor reinicie la app',
          text2: 'Imagen no seleccionada',
        });
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
    })
      .then(response => {
        //   console.log(JSON.stringify(response[0].sourceURL));
        if (response && response.data) {
          if (response.size < 4 * 1024 * 1024) {
            const newImage = response;
            setOrganizationImage(response);
            form.cover = newImage;
            setOrganizationImageBlob({
              uri: newImage.path, // Debes ajustar esto según la estructura de response
              type: newImage.mime, // Tipo MIME de la imagen
              name: 'cover.jpg', // Nombre de archivo de la imagen (puedes cambiarlo)
            });
            setOrganizationImageCharged(undefined);
          } else {
            // showModalControlSizeImage();
            Toast.show({
              type: 'error',
              text1: 'Image',
              // text2: 'No se han podido obtener los datos, por favor reinicie la app',
              text2: 'La imagen pesa demasiado. Peso máximo, 4MB',
            });
          }
        }
      })
      .catch(err => {
        Toast.show({
          type: 'info',
          text1: 'Image',
          // text2: 'No se han podido obtener los datos, por favor reinicie la app',
          text2: 'Imagen no seleccionada',
        });
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

    if (suggestionsSelected.includes(selected)) {
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

    addToMembers(selected.id);
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
    // Agrega el elemento a suggestions
    setSuggestions([...suggestions, itemToMove]);
  };

  /**
   * Añade a la lista de miembros
   * @param id id del usuario
   */
  const addToMembers = (id: number) => {
    // Busca si existe en la lista arrayMembersId el id que se le pasa
    const index = arrayMembersId.indexOf(id);

    if (index === -1) {
      // Si no existe, se agrega
      setArrayMembersId([...arrayMembersId, id]);
    } else {
      // Si existe, se borra
      const updatedArray = arrayMembersId.filter(memberId => memberId !== id);
      setArrayMembersId(updatedArray);
    }
  };

  /**
   * Cambia el miembro a Administrador
   * @param id id del usuario
   */
  const changeToAdmin = (id: number) => {
    // Busca si existe en la lista arrayAdminId el id que se le pasa
    const indexInAdmin = arrayAdminId.indexOf(id);
    // Busca si existe en la lista arrayMembersId el id que se le pasa
    const indexInMembers = arrayMembersId.indexOf(id);

    if (indexInAdmin === -1) {
      // Si no existe en arrayAdminId, se agrega y se elimina de arrayMembersId si existe
      setArrayAdminId([...arrayAdminId, id]);

      if (indexInMembers !== -1) {
        const updatedMembersArray = arrayMembersId.filter(
          memberId => memberId !== id,
        );
        setArrayMembersId(updatedMembersArray);
      }
    } else {
      // Si existe en arrayAdminId, se borra y se agrega a arrayMembersId si no existe
      const updatedAdminArray = arrayAdminId.filter(adminId => adminId !== id);
      setArrayAdminId(updatedAdminArray);

      if (indexInMembers === -1) {
        setArrayMembersId([...arrayMembersId, id]);
      }
    }
  };

  const compruebaAdmin = (id: number) => {
    const index = arrayAdminId.indexOf(id);
    if (index === -1) return false;
    else return true;
  };

  //#region CREATE / EDIT
  const onCreate = async () => {
    setWaitingData(true);
    let valid = true;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // validación correo
    let token;
    while (!token) {
      token = await AsyncStorage.getItem('token');
    }

    //hace una llamada para saber qué usuario es el que está creando
    // si está editando, se puede hacer una validación para que no entre aquí
    try {
      const userInfo = await citmapApi.get<User>(
        '/users/authentication/user/',
        {
          headers: {
            Authorization: token,
          },
        },
      );
      form.creator = userInfo.data.pk;
    } catch (err) {
      console.log(err);
    }

    if (form.principalName.length <= 0) {
      valid = false;
      setNameValidate(false);
    }

    if (form.contactMail.length <= 0) {
      valid = false;
      setMailValidate(false);
    } else if (!emailRegex.test(form.contactMail)) {
      valid = false;
      setMailValidate(false);
    }

    if (form.description.length <= 0) {
      valid = false;
      setDescriptionValidate(false);
    }

    //comprobar que todo está bien antes de crear
    if (!valid) {
      showModalSave();
      setWaitingData(false);
    } else {
      try {
        const formData = new FormData();
        formData.append('principalName', form.principalName);
        formData.append('creator', form.creator);
        if (form.administrators.length > 0) {
          formData.append('administrators', form.administrators);
        }
        if (form.members.length > 0) {
          formData.append('members', form.members);
        }
        formData.append('url', form.url);
        formData.append('description', form.description);
        formData.append('contactName', form.contactName);
        formData.append('contactMail', form.contactMail);
        if (profileImageBlob) {
          formData.append('logo', profileImageBlob);
        }
        if (organizationImageBlob) {
          formData.append('cover', organizationImageBlob);
        }
        console.log(JSON.stringify(formData, null, 2));
        const organizationCreated = await citmapApi.post(
          '/organization/create/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: token,
            },
          },
        );
        setWaitingData(false);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'OrganizationPage',
            params: {id: organizationCreated.data.id, isNew: true},
          }),
        );
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un estado de error (por ejemplo, 4xx, 5xx)
          console.error(
            'Error de respuesta del servidor:',
            error.response.data,
          );
          console.error(
            'Estado de respuesta del servidor:',
            error.response.status,
          );
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.response.data,
          });
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió una respuesta (por ejemplo, no hay conexión)
          console.error('Error de solicitud:', error.request);
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.request,
          });
        } else {
          // Se produjo un error en la configuración de la solicitud
          console.error(
            'Error de configuración de la solicitud:',
            error.message,
          );
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.message,
          });
        }
      } finally {
        setWaitingData(false);
      }
    }
  };
  const onEdit = async () => {
    setWaitingData(true);
    let valid = true;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // validación correo
    let token;

    while (!token) {
      token = await AsyncStorage.getItem('token');
    }

    //hace una llamada para saber qué usuario es el que está creando
    // si está editando, se puede hacer una validación para que no entre aquí
    try {
      const userInfo = await citmapApi.get<User>(
        '/users/authentication/user/',
        {
          headers: {
            Authorization: token,
          },
        },
      );
      form.creator = userInfo.data.pk;
    } catch (err) {
      console.log(err);
    }

    if (form.principalName.length <= 0) {
      valid = false;
      setNameValidate(false);
    }

    if (form.contactMail.length <= 0) {
      valid = false;
      setMailValidate(false);
    } else if (!emailRegex.test(form.contactMail)) {
      valid = false;
      setMailValidate(false);
    }

    if (form.description.length <= 0) {
      valid = false;
      setDescriptionValidate(false);
    }

    //comprobar que todo está bien antes de crear
    if (!valid) {
      showModalSave();
    } else {
      try {
        const formData = new FormData();
        formData.append('principalName', form.principalName);
        formData.append('creator', form.creator);
        if (form.administrators.length > 0) {
          for (let i = 0; i < form.administrators.length; i++) {
            formData.append('administrators', form.administrators[i]);
          }
        }
        if (form.members.length > 0) {
          for (let i = 0; i < form.members.length; i++) {
            formData.append('members', form.members[i]);
          }
        }
        formData.append('url', form.url);
        formData.append('description', form.description);
        formData.append('contactName', form.contactName);
        formData.append('contactMail', form.contactMail);
        if (profileImageBlob && !profileImageCharged) {
          formData.append('logo', profileImageBlob);
        }
        if (organizationImageBlob && !organizationImageCharged) {
          console.log('entra en cover');
          formData.append('cover', organizationImageBlob);
        }
        console.log(JSON.stringify(formData, null, 2));
        const organizationCreated = await citmapApi.patch(
          `/organization/${route.params.id}/`,
          formData,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        setWaitingData(false);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'OrganizationPage',
            params: {id: route.params.id, isNew: false},
          }),
        );
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un estado de error (por ejemplo, 4xx, 5xx)
          console.error(
            'Error de respuesta del servidor:',
            error.response.data,
          );
          console.error(
            'Estado de respuesta del servidor:',
            error.response.status,
          );
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.response.data,
          });
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió una respuesta (por ejemplo, no hay conexión)
          console.error('Error de solicitud:', error.request);
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.request,
          });
        } else {
          // Se produjo un error en la configuración de la solicitud
          console.error(
            'Error de configuración de la solicitud:',
            error.message,
          );
          Toast.show({
            type: 'error',
            text1: 'Error',
            // text2: 'No se han podido obtener los datos, por favor reinicie la app',
            text2: error.message,
          });
        }
      } finally {
        setWaitingData(false);
      }
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
                width: '85%',
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
                      marginTop: '5%',
                      //   marginHorizontal: RFPercentage(1),
                      width: '42%',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        marginBottom: '2%',
                        flexWrap: 'wrap',
                        fontSize: FontSize.fontSizeText13,
                      }}
                      minimumFontScale={0.5}
                      adjustsFontSizeToFit={true}>
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
                          backgroundColor: Colors.secondaryBackground,
                          borderRadius: 100,
                          padding: '2%',
                        }}>
                        {/* TODO cambiar el icono por un touchable */}
                        <TouchableOpacity onPress={() => openProfilePhoto()}>
                          <Person
                            fill={'black'}
                            height={RFPercentage(7)}
                            width={RFPercentage(7)}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => openProfilePhoto()}
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(7),
                            zIndex: 999,
                            backgroundColor: 'white',
                            borderRadius: 50,
                          }}>
                          <PlusImg
                            width={RFPercentage(4)}
                            height={RFPercentage(4)}
                            fill={'#0059ff'}
                          />
                        </TouchableOpacity>
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
                        {profileImageCharged ? (
                          <Image
                            source={{
                              uri: profileImageCharged,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 50,
                              resizeMode: 'cover',
                            }}
                          />
                        ) : (
                          <Image
                            source={{
                              uri:
                                'data:image/jpeg;base64,' + profileImage.data,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 50,
                              resizeMode: 'cover',
                            }}
                          />
                        )}

                        <TouchableOpacity
                          onPress={() => openProfilePhoto()}
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(7),
                            zIndex: 999,
                            backgroundColor: 'white',
                            borderRadius: 50,
                          }}>
                          <PlusImg
                            width={RFPercentage(4)}
                            height={RFPercentage(4)}
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
                      marginTop: '5%',
                      width: '60%',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        marginBottom: '2%',
                        flexWrap: 'wrap',
                        fontSize: FontSize.fontSizeText13,
                      }}>
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
                          backgroundColor: Colors.secondaryBackground,
                          borderRadius: 10,
                          padding: '2%',
                          //   paddingBottom: '2%'
                        }}>
                        <TouchableOpacity onPress={() => openPortadaPhoto()}>
                          <FrontPage
                            fill={'#000'}
                            width={RFPercentage(7)}
                            height={RFPercentage(7)}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(17),
                            zIndex: 999,
                            backgroundColor: 'white',
                            borderRadius: 50,
                          }}>
                          <PlusImg
                            width={RFPercentage(4)}
                            height={RFPercentage(4)}
                            fill={'#0059ff'}
                          />
                        </TouchableOpacity>
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
                        {organizationImageCharged ? (
                          <Image
                            source={{
                              uri: organizationImageCharged,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                              resizeMode: 'cover',
                            }}
                          />
                        ) : (
                          <Image
                            source={{
                              uri:
                                'data:image/jpeg;base64,' +
                                organizationImage.data,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                              resizeMode: 'cover',
                            }}
                          />
                        )}

                        <TouchableOpacity
                          onPress={openPortadaPhoto}
                          style={{
                            width: RFPercentage(4),
                            position: 'absolute',
                            bottom: RFPercentage(-1),
                            left: RFPercentage(17),
                            zIndex: 999,
                            backgroundColor: 'white',
                            borderRadius: 50,
                          }}>
                          <PlusImg
                            width={RFPercentage(4)}
                            height={RFPercentage(4)}
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
                    isValid={nameValidate}
                    label={'Escribe el nombre de la organización...'}
                    keyboardType="default"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => {
                      onChange(value, 'principalName'), setNameValidate(true);
                    }}
                    value={form.principalName}
                  />
                </View>
                {/* Email de contacto */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <Text style={{color: 'black'}}>Email de contacto</Text>
                  <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    isValid={mailValidate}
                    label={'Mail de contacto'}
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={value => {
                      onChange(value, 'contactMail'), setMailValidate(true);
                    }}
                    value={form.contactMail}
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
                    isValid={descriptionValidate}
                    label={'Presenta tu organización en la biografia'}
                    keyboardType="default"
                    multiline={true}
                    maxLength={MAX_CHARACTERS}
                    numOfLines={5}
                    onChangeText={value => {
                      onChange(value, 'description'),
                        setDescriptionValidate(true);
                    }}
                    value={form.description}
                  />
                  <View
                    style={{
                      // width: '80%',
                      marginRight: '1%',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                    }}>
                    
                    <Text
                      style={{
                        color:
                          form.description.length <= MAX_CHARACTERS
                            ? 'black'
                            : 'red',
                            fontSize: FontSize.fontSizeText13
                      }}>
                      {form.description.length}
                    </Text>
                    <Text style={{fontSize: FontSize.fontSizeText13}}>/{MAX_CHARACTERS}</Text>
                  </View>
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
                      placeholder="Buscar integrantes..."
                      value={inputValueUser}
                      onChangeText={text => {
                        handleInputChangeUser(text);
                      }}
                      style={styles.input}
                    />
                    {inputValueUser.length <= 0 ? (
                      <TouchableOpacity onPress={() => showModalInfo()}>
                        <Text
                          style={{
                            color: Colors.semanticInfoDark,
                            fontSize: FontSize.fontSizeText13,
                            marginHorizontal: '2%',
                            marginTop: '1%',
                          }}>
                          ¿Cómo añadir integrantes?
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <></>
                    )}

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
                      suggestionsSelected.map((item, index) => {
                        const isAdmin = compruebaAdmin(item.id);

                        return (
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
                              <TouchableOpacity
                                onPress={() => changeToAdmin(item.id)}>
                                <Text
                                  style={{
                                    fontSize: FontSize.fontSizeText13,
                                    color: Colors.contentQuaternaryLight,
                                  }}>
                                  {isAdmin === true
                                    ? 'Administrador'
                                    : 'Miembro'}
                                </Text>
                              </TouchableOpacity>
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
                        );
                      })}
                  </View>
                </View>
              </View>
              {/* boton crear */}
              <View style={styles.buttonContainer}>
                {isEdit ? (
                  <CustomButton
                    backgroundColor={Colors.primaryLigth}
                    label={'Editar organizacion'}
                    onPress={() => onEdit()}
                  />
                ) : (
                  <CustomButton
                    backgroundColor={Colors.primaryLigth}
                    label={'Crear organización'}
                    onPress={() => onCreate()}
                  />
                )}
              </View>

              {/* modals */}
              <SaveProyectModal
                visible={saveModal}
                hideModal={hideModalSave}
                onPress={hideModalSave}
                size={RFPercentage(8)}
                color={Colors.semanticWarningDark}
                label="Ha surgido un problema, vuelva a intentarlo."
                helper={false}
              />
              <SaveProyectModal
                visible={controlSizeImage}
                hideModal={hideModalControlSizeImage}
                onPress={hideModalControlSizeImage}
                size={RFPercentage(8)}
                color={Colors.semanticWarningDark}
                label="La imagen no puede pesar mas de 4 Mb"
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
          <Spinner visible={waitingData} />
          <Toast />
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
    height: RFPercentage(5),
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: RFPercentage(1.4),
    paddingVertical: RFPercentage(0.4),
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
