import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '../../../hooks/useLocation';
import {LoadingScreen} from '../../../screens/LoadingScreen';
import Mapbox from '@rnmapbox/maps';
import {useForm} from '../../../hooks/useForm';
import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {InfoModal, InfoModalMap} from '../../utility/Modals';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Colors} from '../../../theme/colors';
import {TouchableOpacity} from 'react-native';
import Plus from '../../../assets/icons/map/plus-map.svg';
import Compass from '../../../assets/icons/map/Compass.svg';
import CardMap from '../../../assets/icons/map/card-map.svg';
import Back from '../../../assets/icons/map/chevron-left-map.svg';
import MarkEnabled from '../../../assets/icons/map/mark-asset.svg';
import MarkDisabled from '../../../assets/icons/map/mark-disabled.svg';
import Target from '../../../assets/icons/map/target-map.svg';
import {StackParams} from '../../../navigation/MultipleNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {HeaderComponent} from '../../HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {
  CreateObservation,
  FieldForm,
  ImageObservation,
  ObervationDataForm,
  Observation,
  Question,
  ShowProject,
  User,
} from '../../../interfaces/interfaces';
import {Spinner} from '../../utility/Spinner';
import {InputText} from '../../utility/InputText';
import {CardAnswerMap} from '../../utility/CardAnswerMap';
import {CustomButtonOutline} from '../../utility/CustomButtonOutline';
import {CustomButton} from '../../utility/CustomButton';
import {FontSize} from '../../../theme/fonts';
import {useDateTime} from '../../../hooks/useDateTime';

Mapbox.setWellKnownTileServer('mapbox');
Mapbox.setAccessToken(
  'pk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsYWt1NHYwNjBxMXYzbnBqN2luamV2ajQifQ.XJQH9SnPmCxVPoDnU0P2KQ',
);

interface Props extends StackScreenProps<StackParams, 'ParticipateMap'> {}
type Position = number[];

const {
  MapView,
  Camera,
  PointAnnotation,
  MarkerView,
  UserLocation,
  UserTrackingMode,
} = Mapbox;

export const ParticipateMap = ({navigation, route}: Props) => {
  const {
    hasLocation,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    initialPositionArray,
    loading,
  } = useLocation();

  const {currentISODateTime} = useDateTime();

  //#region VARIABLES
  // map refs
  const mapViewRef = useRef<Mapbox.MapView>();
  const cameraRef = useRef<Mapbox.Camera>();
  const featureRef = useRef<any>([]);
  const followView = useRef<boolean>(false);

  // modal variables
  const [infoModal, setInfoModal] = useState(false);
  const showModalInfo = () => setInfoModal(true);
  const hideModalInfo = () => setInfoModal(false);

  // form variables
  const {form, onChange, clear} = useForm<CreateObservation>({
    data: {
      subData: [],
    },
    field_form: 0,
    geoposition: {
      point: '',
    },
    timestamp: '',
    images: [],
  });

  /**
   * un field form que pertenece a un proyecto, contiene questions
   */
  const [fieldForm, setFieldForm] = useState<FieldForm>({
    id: 0,
    project: 0,
    questions: [],
  });
  const [userInfo, setUserInfo] = useState<User>({
    email: '',
    first_name: '',
    last_name: '',
    pk: 0,
    username: '',
  });

  /**
   * un array de preguntas que pertenecen a UN unico proyecto
   */
  const [questions, setQuestions] = useState<Question[]>([]);

  /**
   * cada observation es una MARCA en el mapa
   * cada observation tiene un id de FIELDFORM asociado
   * esta observation será la que, si se selecciona una marca, se pintará en la pantalla del formulario
   * NO EDITABLE
   */
  const [observation, setObservation] = useState<Observation>();
  /**
   * lista de observations que van filtradas por el fieldform asociado
   */
  const [observationList, setObservationList] = useState<Observation[]>([]);

  /**
   * esta lista estará compuesta de los marcadores que crea el usuario
   */
  const [observationListCreator, setObservationListCreator] = useState<
    CreateObservation[]
  >([]);

  /**
   * esta observation será usada en el formulario cuando se vaya a ver
   */
  const [newObservation, setNewObservation] = useState<Observation>({
    id: 0,
    creator: 0,
    field_form: 0,
    geoposition: {
      srid: '0',
      point: {
        latitude: 0,
        longitude: 0,
      },
    },
    data: [],
    images: [],
  });

  const [newObservationCreate, setNewObservationCreate] =
    useState<CreateObservation>({
      field_form: 0,
      geoposition: {
        point: '',
      },
      data: {
        subData: [],
      },
      timestamp: '',
    });

  // TODO gestionar lo de las imagenes
  const [imageObservation, setImageObservation] = useState<any>();
  const [imageObservationBlob, setImageObservationBlob] = useState<any>();

  // map controll
  const [isCreatingObservation, setIsCreatingObservation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [chargedData, setChargedData] = useState(false);
  const [onBack, setOnBack] = useState(true);

  const [waitingData, setWaitingData] = useState(true);

  // map variables

  const [showConfirmMark, setShowConfirmMark] = useState(false);

  //#endregion

  //#region USE EFFECT

  useEffect(() => {
    getProjectApi();
  }, []);

  /**
   * Activa el seguimiento por geolocalización
   */
  useEffect(() => {
    followUserLocation();
    showModalInfo();
    return () => {
      //cancelar el seguimiento
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    if (hasLocation) {
      showModalInfo();
    }
  }, []);

  useEffect(() => {
    cameraRef.current?.setCamera({
      centerCoordinate: [userLocation.longitude, userLocation.latitude],
    });
  }, []);

  /**
   * empleado para que cuando cargue el fieldform, se pueda obtener su id
   * solo entra si el id existe
   * cuando entra, hace el getObservaciones para pintar el mapa
   */
  useEffect(() => {
    if (fieldForm.id !== 0) {
      getObservation();
    }
  }, [fieldForm]);

  /**
   * entra cuando la lista de observaciones ha sido modificada
   * solo entra cuando los datos se han cargado
   * independientemente de si hay o no observaciones, da el paso al mapa
   */
  useEffect(() => {
    if (!waitingData) {
      setChargedData(true);
    }
  }, [observationList]);

  //#endregion

  //#region API CALLS
  const getProjectApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<ShowProject>(
        `/project/${route.params.id}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      const formfield = await citmapApi.get<FieldForm[]>(`/field_forms/`, {
        headers: {
          Authorization: token,
        },
      });

      if (fieldForm) {
        const single = formfield.data.find(x => x.project === route.params.id);
        if (single) {
          setFieldForm(single);
          setQuestions(single.questions);
        }
      }
    } catch {}
  };

  /**
   * cuando se cogen las observations, se pintan en el mapa
   * las observations se filtran segun el field form
   */
  const getObservation = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Observation[]>(
        `/field_form/${fieldForm.id}/observations/`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      // setObservationList(resp.data);
      const newDataParse = await parseObservations(resp.data);
      if (waitingData) {
        await setWaitingData(false);
      }
      setObservationList(newDataParse);
    } catch {}
  };

  const getObservationById = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Observation>(`/observations/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setObservation(resp.data);
    } catch {}
  };

  const getCreatorApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const userInfo = await citmapApi.get<User>(
        '/users/authentication/user/',
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setUserInfo(userInfo.data);
    } catch (err) {
      console.log('error en coger el creator');
      console.log(err);
    }
  };

  //#endregion

  //#region METHODS

  const clearFormData = () => {
    clear();
  };

  const onChangeText = (value: any, id: number, type: string) => {
    if (type === 'IMG') {
      // Busca si ya existe un elemento en form.images con la misma clave (id).
      const existingImageIndex = form.images!.findIndex(
        item => item.key === id,
      );

      if (existingImageIndex !== -1) {
        // Si ya existe un elemento con la misma clave (id), actualiza su valor.
        form.images![existingImageIndex].value = value;
      } else {
        // Si no existe un elemento con la misma clave (id), crea uno nuevo y agrégalo.
        const newImageObservation: ImageObservation = {
          key: id,
          value: value, // Supongo que aquí pasas la imagen como valor.
        };

        form.images!.push(newImageObservation);
      }
    } else {
      // Clona el array existente en form.data si existe, o crea uno nuevo si es nulo.
      const newDataArray = form.data.subData ? [...form.data.subData] : [];

      // Busca si ya existe un elemento en newDataArray con la misma clave (id).
      const existingElementIndex = newDataArray.findIndex(
        item => item.key === id.toString(),
      );

      if (existingElementIndex !== -1) {
        // Si ya existe un elemento con la misma clave (id), actualiza su valor.
        newDataArray[existingElementIndex].value = value;
      } else {
        // Si no existe un elemento con la misma clave (id), crea uno nuevo y agrégalo.
        newDataArray.push({key: id.toString(), value});
      }

      // Actualiza form.data con el nuevo array de elementos.
      form.data.subData = newDataArray;
    }
  };

  const parseGeoposition = (geopositionStr: string) => {
    // Verificamos si la cadena contiene 'POINT ('
    if (geopositionStr.includes('POINT (')) {
      // Extraemos las coordenadas de la cadena usando una expresión regular
      const match = /POINT \(([^ ]+) ([^)]+)\)/.exec(geopositionStr);

      if (match && match.length === 3) {
        // Obtenemos las coordenadas de la expresión regular
        const longitudeStr = match[1];
        const latitudeStr = match[2];

        // Convertimos las cadenas a números
        const longitude = parseFloat(longitudeStr);
        const latitude = parseFloat(latitudeStr);

        // Obtenemos el SRID de la cadena
        const sridMatch = /SRID=([^;]+)/.exec(geopositionStr);
        const srid = sridMatch ? sridMatch[1] : '';

        // Creamos una instancia de GeoPosition con los valores obtenidos
        const geoPosition = {
          srid,
          point: {
            longitude,
            latitude,
          },
        };

        return geoPosition;
      }
    }

    // Si la cadena no está en el formato esperado, puedes manejarlo de acuerdo a tus necesidades.
    const geoPosition = {
      srid: '',
      point: {
        longitude: 0,
        latitude: 0,
      },
    };
    return geoPosition; // O lanza una excepción, muestra un mensaje de error, etc.
  };

  const parseObservations = (jsonData: any[]) => {
    return jsonData.map(item => {
      const observation: Observation = {
        id: item.id,
        creator: item.creator,
        field_form: item.field_form,
        geoposition: parseGeoposition(item.geoposition),
        data: item.data,
        images: item.images,
      };
      return observation;
    });
  };

  /**
   * Se le pasan las coordenadas y crea una observación.
   * Tras eso, llama de nuevo para cargar las observationList
   * @param coordinates coordenadas para crear la marca
   */
  const createNewObservation = async (coordinates: number[]) => {
    // await getCreatorApi();
    // console.log(JSON.stringify(userInfo, null, 2));
    clearFormData();
    const token = await AsyncStorage.getItem('token');
    try {
      const userInfo = await citmapApi.get<User>(
        '/users/authentication/user/',
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setUserInfo(userInfo.data);

      // se crea la nueva observación sin respuestas ni nada
      const createdObservation: CreateObservation = {
        field_form: fieldForm.id,
        timestamp: currentISODateTime,
        geoposition: {
          point: `POINT(${coordinates[0]} ${coordinates[1]})`,
        },
        data: {
          subData: [],
        },
      };
      console.log(JSON.stringify(createdObservation, null, 2));

      // const marca = await citmapApi.post('/observations/', createdObservation, {
      //   headers: {
      //     Authorization: token,
      //   },
      // });
      // await setNewObservation(marca.data);
      await setNewObservationCreate(createdObservation);
      await setObservationListCreator([
        ...observationListCreator,
        createdObservation,
      ]);
    } catch (err) {
      console.log('error al coger la informacion del usuario ');
      console.log(err);
    }
  };

  /**
   *
   * @param wktString el valor del POINT dentro de la observation
   * @returns devuelve un array con la latitud y longitud
   */
  const parsePoint = (wktString: string) => {
    const match = wktString.match(/POINT\((-?\d+\.\d+) (-?\d+\.\d+)\)/);

    if (match) {
      const latitude = parseFloat(match[2]);
      const longitude = parseFloat(match[1]);

      return [latitude, longitude];
    }
  };

  const onSaveObservation = async () => {
    const token = await AsyncStorage.getItem('token');
    const createdObservation: CreateObservation = {
      field_form: fieldForm.id,
      timestamp: newObservationCreate.timestamp,
      geoposition: newObservationCreate.geoposition,
      data: form.data,
      images: form.images,
    };

    
    console.log(JSON.stringify(createdObservation, null, 2));
    try {
      const marca = await citmapApi.post('/observations/', createdObservation, {
        headers: {
          Authorization: token,
        },
      });

      console.log('si crea la marca');
    } catch (err) {
      console.log('error al crear ');
      console.log(err);
    }
  };

  //#endregion

  //#region BUTTONS
  /**
   * cuando le das al boton para añadir un marcador, se crea por debajo la nueva observation
   * además, se actualizará la lista de observaciones
   */
  const addMarkPlus = () => {
    const coords = initialPositionArray;
    // console.log(JSON.stringify(coords, null, 2));
    //TODO añadir a una nueva lista
    createNewObservation(coords);
    setShowConfirmMark(true);
  };

  const addMarkLongPress = (feature: any) => {
    const coords = feature.geometry.coordinates;
    //TODO añadir a una nueva lista
    createNewObservation(coords);
    setShowConfirmMark(true);
  };

  /**
   * si le da a cancelar, borrará la observation en cuestión
   */
  const cancelCreationObservation = async () => {
    setShowConfirmMark(false);
    const token = await AsyncStorage.getItem('token');
    try {
      const marca = await citmapApi.delete(
        `/observations/${newObservation.id}/`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      console.log('marca borrada');
      console.log(JSON.stringify(marca.data, null, 2));
    } catch (err) {
      console.log('error en borrar');
      console.log(err);
    }
  };

  /**
   * Centra la camara a la posición del usuario. Para eso, hace una llamada al useLocation para rescatar las actuales coordenadas del usuario.
   */
  const centerPosition = async () => {
    const location = await getCurrentLocation();
    // setFollowUser(true);
    // followView.current = true;
    const posi: Position = [location.longitude, location.latitude];
    cameraRef.current?.flyTo(posi, 200);
    // followView.current = false;
    cameraRef.current?.setCamera({
      centerCoordinate: posi,
      zoomLevel: 16,
    });
  };
  //#endregion

  if (!hasLocation) {
    // return <LoadingScreen />;
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text>Habilita el GPS para poder acceder al mapa</Text>
        <Button title="Recargar pantalla" onPress={getCurrentLocation} />
      </View>
    );
  }

  return (
    <>
      {chargedData ? (
        <>
          {showMap ? (
            <View style={{flex: 1}}>
              <MapView
                ref={element => (mapViewRef.current = element!)}
                style={{flex: 1}}
                logoEnabled={false}
                scaleBarEnabled={false}
                compassEnabled={false}
                collapsable={true}
                onTouchStart={() => console.log('on touch start')}
                onLongPress={data => {
                  addMarkLongPress(data);
                }}>
                <Camera
                  ref={reference => (cameraRef.current = reference!)}
                  zoomLevel={15}
                  centerCoordinate={initialPositionArray}
                  followUserLocation={followView.current}
                  followUserMode={UserTrackingMode.FollowWithHeading}
                  minZoomLevel={8}
                  animationMode="flyTo"
                  animationDuration={1000}
                  allowUpdates={true}
                />
                <Mapbox.UserLocation visible animated />
                {observationList.length > 0 &&
                  observationList.map((x, index) => {
                    if (x.geoposition.point) {
                      return (
                        <View key={index}>
                          <MarkerView
                            // coordinate={[-6.300905, 36.53777]}
                            coordinate={[
                              x.geoposition.point.latitude,
                              x.geoposition.point.longitude,
                            ]}>
                            <TouchableOpacity
                              onPress={() => console.log(x.geoposition.point)}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  width: RFPercentage(5),
                                  backgroundColor: 'transparent',
                                  height: RFPercentage(6),
                                }}>
                                <MarkEnabled
                                  height={RFPercentage(5)}
                                  width={RFPercentage(5)}
                                />
                              </View>
                            </TouchableOpacity>
                          </MarkerView>
                        </View>
                      );
                    } else {
                      return <View key={index}></View>;
                    }
                  })}
                {observationListCreator.length > 0 &&
                  observationListCreator.map((x, index) => {
                    if (x.geoposition.point) {
                      return (
                        <View key={index}>
                          <MarkerView
                            // coordinate={[-6.300905, 36.53777]}
                            coordinate={parsePoint(x.geoposition.point)}>
                            <TouchableOpacity
                              onPress={() => console.log(x.geoposition.point)}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  width: RFPercentage(5),
                                  backgroundColor: 'transparent',
                                  height: RFPercentage(6),
                                }}>
                                <MarkEnabled
                                  height={RFPercentage(5)}
                                  width={RFPercentage(5)}
                                />
                              </View>
                            </TouchableOpacity>
                          </MarkerView>
                        </View>
                      );
                    } else {
                      return <View key={index}></View>;
                    }
                  })}
              </MapView>
              {showConfirmMark && (
                <View style={styles.showConfirmMarkStyle}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginBottom: '10%',
                      marginHorizontal: RFPercentage(4),
                    }}>
                    <View>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: FontSize.fontSizeText17,
                        }}>
                        ¿Quieres confirmar el marcador?
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: '100%',
                      justifyContent: 'flex-end',
                      marginHorizontal: '4%',
                    }}>
                    <View
                      style={{
                        width: RFPercentage(12),
                        marginHorizontal: RFPercentage(1),
                        bottom: 2,
                      }}>
                      <CustomButton
                        onPress={() => {
                          setShowMap(false), setShowConfirmMark(false);
                        }}
                        label="Confirmar"
                        backgroundColor={Colors.primaryLigth}
                      />
                    </View>
                    <View
                      style={{
                        width: RFPercentage(12),
                        marginHorizontal: RFPercentage(1),
                        bottom: 2,
                      }}>
                      <CustomButton
                        onPress={() => cancelCreationObservation()}
                        label="Cancelar"
                        fontColor="black"
                        outlineColor="black"
                        backgroundColor={'white'}
                      />
                    </View>
                  </View>
                </View>
              )}
              {/* BUTTONS */}

              {/* PLUS */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: '2%',
                  bottom: '2%',
                }}
                onPress={() => addMarkPlus()}>
                <Plus height={RFPercentage(10)} />
              </TouchableOpacity>
              {/* BACK */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left: '2%',
                  top: '5%',
                }}
                onPress={() => navigation.goBack()}>
                <Back height={RFPercentage(6)} />
              </TouchableOpacity>
              {/* COMPASS */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '5%',
                }}
                onPress={() => centerPosition()}>
                <Compass height={RFPercentage(6)} />
              </TouchableOpacity>
              {/* CENTER */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: '2%',
                  top: '12%',
                }}
                onPress={() => centerPosition()}>
                <Target height={RFPercentage(6)} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <HeaderComponent
                title={'proyect name'}
                onPressLeft={() => {
                  setShowMap(true);
                }}
                rightIcon={false}
              />
              <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled">
                <View
                  style={{
                    backgroundColor: true ? 'transparent' : 'grey',
                    alignItems: 'center',
                  }}>
                  {questions.map((x, index) => {
                    return (
                      <View
                        style={{justifyContent: 'center', alignItems: 'center'}}
                        key={index}>
                        <CardAnswerMap
                          question={x}
                          index={index + 1}
                          onChangeText={value =>
                            onChangeText(value, x.id!, x.answer_type)
                          }
                          showModal={value => {
                            if (value) {
                              console.log('la imagen pesa demasiado');
                            }
                          }}
                        />
                      </View>
                    );
                  })}
                  <View
                    style={{
                      width: '70%',
                      marginHorizontal: RFPercentage(1),
                      marginBottom: '5%',
                    }}>
                    <CustomButton
                      onPress={() => onSaveObservation()}
                      label="Finalizar"
                      backgroundColor={Colors.primaryLigth}
                    />
                  </View>
                </View>
              </ScrollView>
            </>
          )}
          {/* modales */}
          <View>
            <InfoModalMap
              visible={infoModal}
              hideModal={hideModalInfo}
              onPress={hideModalInfo}
              size={RFPercentage(4)}
              color={Colors.primaryLigth}
              label="¿Como participar y añadir un marcador?"
              subLabel="Si perteneces a una organización existente en Geonity, 
              ponte en contacto con el admin de la organización para que te invite o te añada como integrante.
              "
              subLabel2="Una vez hayas aceptado la solicitud, podrás añadir la organzación a tu biografía."
              helper={false}
            />
          </View>
          <Spinner visible={waitingData} />
        </>
      ) : (
        <>
          <Spinner visible={true} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  showConfirmMarkStyle: {
    position: 'absolute',
    backgroundColor: 'white',
    height: RFPercentage(20),
    width: '100%',
    zIndex: 200,
    bottom: 0,
    alignSelf: 'center',
    // borderTopWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
    paddingVertical: '5%',
  },
});
