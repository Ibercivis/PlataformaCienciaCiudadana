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
  Dimensions,
  Image,
  Platform,
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
import Mapbox, {UserTrackingMode} from '@rnmapbox/maps';

Mapbox.setWellKnownTileServer('mapbox');
Mapbox.setAccessToken(
  'pk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsYWt1NHYwNjBxMXYzbnBqN2luamV2ajQifQ.XJQH9SnPmCxVPoDnU0P2KQ',
);
// Mapbox.setAccessToken(
//   'sk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsZnFqbDhjbDAwMTIzcGxnZ2RvaTFjanEifQ.A_Zi_uoS-0D0Vm0kh9ECDA',
// );

const {MapView, Camera, PointAnnotation, MarkerView} = Mapbox;

type Position = number[];

export const MapBox = () => {
  const navigation = useNavigation();
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    routeLines,
  } = useLocation();
  const [marks, setMarks] = useState<Position[]>([]);
  const mapViewRef = useRef<Mapbox.MapView>();
  const cameraRef = useRef<Mapbox.Camera>();
  const followView = useRef<boolean>(true);
  const [initialPositionArray, setInitialPositionArray] = useState<number[]>(
    [],
  );
  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [followUser, setFollowUser] = useState(false);
  const featureRef = useRef<any>([]);
  const [lastCoordinate, setLastCoordinate] = useState<Position>([]);
  const [timer, setTimer] = useState(0);

  const {form, onChange} = useForm({});

  //seccion useEffect

  useEffect(() => {
    if (!followView.current) return;
    const {latitude, longitude} = userLocation;
    getCurrentLocation().then(res => {
      setInitialPositionArray([res.longitude, res.latitude]);
    });
  }, [userLocation]);

  useEffect(() => {
    followUserLocation();
    return () => {
      //cancelar el seguimiento
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    if (!hasLocation) {
      setTimeout(() => {
        console.log('1 sec.');
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [hasLocation]);

  //seccion metodos

  const showDialog = (feature: any) => {
    featureRef.current = feature;
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);
  const hideDialogInfo = () => setVisibleInfo(false);

  const showMark = (x: Position) => {
    setVisibleInfo(true);
    setLastCoordinate(x);
  };

  const addMarkFeature = () => {
    const coords = featureRef.current.geometry.coordinates;
    setMarks([...marks, coords]);
    setVisible(false);
    centerToMark(coords);
  };

  const addMarkPlus = () => {
    const coords = initialPositionArray;
    if (marks.length <= 0) {
      setMarks([coords]);
    } else {
      setMarks([...marks, coords]);
    }
  };

  //TODO comprobar si la posicion del usuario y la de la camara son las mismas, sino, es que el usuario ha movido el mapa
  const centerPosition = async () => {
    console.log('entra en center position');
    const location = await getCurrentLocation();
    // console.log(location)
    followView.current = !followView.current;
    const posi: Position = [location.longitude, location.latitude];
    cameraRef.current?.flyTo(posi, 200);
    console.log(' en center position');
  };

  const centerToMark = async (coords: Position) => {
    cameraRef.current?.flyTo(coords, 200);
    followView.current = false;
  };

  const userDirecction = () => {
    followView.current = followView.current!;
  };

  const onUserLocationUpdate = (location: any) => {};

  // if (!hasLocation) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      {!hasLocation ? (
        <LoadingScreen />
      ) : (
        <>
          <KeyboardAvoidingView
            behavior="padding"
            enabled={false}
            style={styles.page}>
            <View style={styles.container}>
              <MapView
                ref={element => (mapViewRef.current = element!)}
                style={styles.map}
                logoEnabled={false}
                localizeLabels={true}
                collapsable={true}
                onTouchStart={() => (followView.current = false)}
                onLongPress={data => {
                  showDialog(data);
                }}>
                <Camera
                  ref={reference => (cameraRef.current = reference!)}
                  zoomLevel={14}
                  centerCoordinate={initialPositionArray}
                  followUserLocation={followUser}
                  followUserMode={UserTrackingMode.FollowWithHeading}
                  minZoomLevel={15}
                  animationMode="flyTo"
                  animationDuration={1000}
                  allowUpdates={true}
                />
                {/* <PointAnnotation id="point" coordinate={initialPositionArray} /> */}
                <Mapbox.UserLocation
                  visible={true}
                  onUpdate={location => onUserLocationUpdate(location)}
                />
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
            </View>

            {/* dialogo creacion */}
            {/* <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Crear marca</Dialog.Title>
            <Dialog.Content>
              <View>
                {featureRef.current.geometry && (
                  <InputField
                    label={'coordenadas'}
                    icon="format-title"
                    keyboardType="email-address"
                    multiline={false}
                    numOfLines={1}
                    value={featureRef.current.geometry.coordinates.toString()}
                    onChangeText={value =>
                      console.log(featureRef.current.geometry.coordinates)
                    }
                    iconColor={Colors.lightorange}
                  />
                )}
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>cancel</Button>
              <Button onPress={() => addMarkFeature()}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal> */}
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
                      width: '100%',
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
          </KeyboardAvoidingView>

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
              {/* <Image
            source={require('../../assets/icons/center-position.png')}
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
                {followView.current ? (
                  <IconTemp name="compass" size={Size.iconSizeExtraLarge} />
                ) : (
                  <IconTemp
                    name="crosshairs-gps"
                    size={Size.iconSizeExtraLarge}
                  />
                )}
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
