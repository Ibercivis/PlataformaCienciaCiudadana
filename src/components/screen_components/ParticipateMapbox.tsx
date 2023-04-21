import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '../../hooks/useLocation';
import {LoadingScreen} from '../../screens/LoadingScreen';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {globalStyles} from '../../theme/theme';
import {Button, Dialog, Portal, TextInput} from 'react-native-paper';
import {InputField} from '../InputField';
import {Colors} from '../../theme/colors';
import {useForm} from '../../hooks/useForm';
import translate from '../../theme/es.json';
import {IconTemp} from '../IconTemp';
import {Size} from '../../theme/size';
import {BackButton} from '../BackButton';
import Modal from 'react-native-modal';
import {FontSize} from '../../theme/fonts';
import Mapbox from '@rnmapbox/maps';

Mapbox.setWellKnownTileServer('mapbox');
Mapbox.setAccessToken(
  'pk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsYWt1NHYwNjBxMXYzbnBqN2luamV2ajQifQ.XJQH9SnPmCxVPoDnU0P2KQ',
);
// Mapbox.setConnected(true);
// Mapbox.setAccessToken(
//   'sk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsZnFqbDhjbDAwMTIzcGxnZ2RvaTFjanEifQ.A_Zi_uoS-0D0Vm0kh9ECDA',
// );

const {
  MapView,
  Camera,
  PointAnnotation,
  MarkerView,
  UserLocation,
  UserTrackingMode,
} = Mapbox;

type Position = number[];

export const ParticipateMapbox = () => {
  const navigation = useNavigation();

  const {
    hasLocation,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
  } = useLocation();
  
  const [marks, setMarks] = useState<Position[]>([]);
  const [initialPositionArray, setInitialPositionArray] = useState<number[]>([]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>([]);

  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [followUser, setFollowUser] = useState(false);

  const mapViewRef = useRef<Mapbox.MapView>();
  const cameraRef = useRef<Mapbox.Camera>();
  const followView = useRef<boolean>(false);
  const featureRef = useRef<any>([]);

  const {form, onChange} = useForm({});

  /**
   * Activa el seguimiento por geolocalización
   */
  useEffect(() => {
    followUserLocation();
    return () => {
      //cancelar el seguimiento
      stopFollowUserLocation();
    };
  }, []);

  /**
   * asigna la posición inicial cuando el usuario se mueve
   */
  useEffect(() => {
    if (followView.current) return;
    const {latitude, longitude} = userLocation;
    setInitialPositionArray([longitude, latitude]);
    // getCurrentLocation().then(res => {
    //   setInitialPositionArray([res.longitude, res.latitude]);
    // });
  }, [userLocation]);

  /**
   * Abre el modal para crear una marca
   * @param feature contiene la referencia
   */
  const showDialog = (feature: any) => {
    featureRef.current = feature;
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);
  const hideDialogInfo = () => setVisibleInfo(false);

  /**
   * Establece la coordenada para mostrarla en la marca dentro del modal
   * @param x coordenada a mostrar en el modal
   */
  const showMark = (x: Position) => {
    setVisibleInfo(true);
    setLastCoordinate(x);
  };

  /**
   * Metodo que añade una marca rescatando la coordenada de la referencia al mapa.
   * Centra la camara a esta marca
   */
  const addMarkFeature = () => {
    const coords = featureRef.current.geometry.coordinates;
    console.log(coords);
    setMarks([...marks, coords]);
    setVisible(false);
    centerToMark(coords);
  };

  /**
   * Añade una marca en la posición del usuario.
   */
  const addMarkPlus = () => {
    const coords = initialPositionArray;
    if (marks.length <= 0) {
      setMarks([coords]);
    } else {
      setMarks([...marks, coords]);
    }
  };

  /**
   * Centra la camara a la posición del usuario. Para eso, hace una llamada al useLocation para rescatar las actuales coordenadas del usuario.
   */
  const centerPosition = async () => {
    const location = await getCurrentLocation();
    setFollowUser(true);
    followView.current = true;
    const posi: Position = [location.longitude, location.latitude];
    cameraRef.current?.flyTo(posi, 200);
  };

  /**
   * Centra la camara a la posición de una nueva marca
   * @param coords coordenadas de la posicion
   */
  const centerToMark = async (coords: Position) => {
    cameraRef.current?.flyTo(coords, 200);
    followView.current = false;
  };

  /**
   * Cuando alejas la camara de la posición del usuario, establece el seguimiento a false
   */
  const onTouchStart = () => {
    followView.current = false;
    setFollowUser(false);
  };

  return (
    <>
      {!hasLocation ? (
        <LoadingScreen />
      ) : (
        <>
          <MapView
            ref={element => (mapViewRef.current = element!)}
            style={styles.map}
            logoEnabled={false}
            scaleBarEnabled={false}
            compassEnabled={true}
            collapsable={true}
            onTouchStart={() => onTouchStart()}
            onLongPress={data => {
              showDialog(data);
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
            <PointAnnotation
              id="point"
              coordinate={[userLocation.longitude, userLocation.latitude]}
              anchor={{x: 0.5, y: 0.5}}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  backgroundColor: '#B9E6FF',
                  borderColor: '#5C95FF',
                  borderWidth: 1,
                }}
              />
            </PointAnnotation>
            {/* <Mapbox.UserLocation visible /> */}

            {marks.length > 0 &&
              marks.map((x, index) => {
                return (
                  <View key={index}>
                    <MarkerView coordinate={x}>
                      <TouchableOpacity onPress={() => showMark(x)}>
                        <View style={styles.markerContainer}>
                          <Button
                            icon={({size, color}) => (
                              <Image
                                source={require('../../assets/icons/mark.png')}
                                style={{
                                  alignSelf: 'center',
                                  backgroundColor: 'transparent',
                                  width: 50,
                                  height: 50,
                                }}
                              />
                            )}
                            children={undefined}></Button>
                        </View>
                      </TouchableOpacity>
                    </MarkerView>
                  </View>
                );
              })}
          </MapView>
          {/* </View> */}

          <Modal
            style={{alignItems: 'center'}}
            onBackdropPress={() => setVisible(false)}
            isVisible={visible}
            animationIn="zoomIn"
            animationInTiming={300}
            animationOut="zoomOut"
            animationOutTiming={300}
            // backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
            <View
              style={{
                borderRadius: 40,
                width: '100%',
                height: Size.window.height * 0.3,
                paddingVertical: 10,
                alignItems: 'center',
                // justifyContent: 'center',
                marginHorizontal: '5%',
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  top: '1%',
                  fontSize: FontSize.fontSizeTextTitle,
                  color: Colors.primary,
                }}>
                Nueva marca
              </Text>
              {featureRef.current.geometry && (
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: '5%',
                    width: '80%',
                    alignContent: 'center',
                  }}>
                  <InputField
                    label={'coordenadas'}
                    icon="format-title"
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    value={featureRef.current.geometry.coordinates[0].toString()}
                    onChangeText={value =>
                      console.log(featureRef.current.geometry.coordinates)
                    }
                    iconColor={Colors.lightorange}
                  />
                  <InputField
                    label={'coordenadas'}
                    icon="format-title"
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    value={featureRef.current.geometry.coordinates[1].toString()}
                    onChangeText={value =>
                      console.log(featureRef.current.geometry.coordinates)
                    }
                    iconColor={Colors.lightorange}
                  />
                </View>
              )}
              <Button
                style={{position: 'absolute', bottom: '4%'}}
                onPress={() => addMarkFeature()}>
                Crear
              </Button>
            </View>
          </Modal>

          {/* dialogo con datos */}
          <Dialog visible={visibleInfo} onDismiss={hideDialogInfo}>
            <Dialog.Title>Datos de la marca</Dialog.Title>
            <Dialog.Content>
              {lastCoordinate && (
                <Text
                  style={{
                    ...globalStyles.globalText,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1C2321',
                  }}>
                  {lastCoordinate[0]}
                  {lastCoordinate[1]}
                </Text>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogInfo}>cancel</Button>
            </Dialog.Actions>
          </Dialog>

          {/* buttons */}

          <View
            style={{
              ...styles.button,
              position: 'absolute',
              bottom: Size.window.height * 0.1,
              right: '2%',
            }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => addMarkPlus()}>
              {/* <Image
            source={require('../../assets/icons/add.png')}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: 50,
            }}
          /> */}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconTemp name="plus-circle" size={Size.iconSizeExtraLarge} />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.button,
              position: 'absolute',
              bottom: Size.window.height * 0.02,
              right: '2%',
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => centerPosition()}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconTemp
                  name={followView.current ? 'compass' : 'crosshairs-gps'}
                  size={Size.iconSizeExtraLarge}
                />
                {/* {followView.current ? (
                  <IconTemp name={followView.current ? "compass" : "crosshairs-gps"} size={Size.iconSizeExtraLarge} />
                ) : (
                  <IconTemp
                    name="crosshairs-gps"
                    size={Size.iconSizeExtraLarge}
                  />
                )} */}
              </View>
            </TouchableOpacity>
          </View>

          {/* back button */}
          <BackButton onPress={() => navigation.goBack()} />
          {/* <View
        style={{
          ...styles.button,
          left: '2%',
          top: window.height * 0.02,
          position: 'absolute',
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('HomeScreen' as never)}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconTemp name="chevron-left" size={Size.iconSizeExtraLarge} />
          </View>
        </TouchableOpacity>
      </View> */}
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    width: 60,
    backgroundColor: 'transparent',
    height: 100,
  },
  textContainer: {
    backgroundColor: 'grey',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 5,
    flex: 1,
    color: 'white',
  },
  markerPoint: {
    height: 30,
    width: 30,
    backgroundColor: '#00cccc',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
