import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '../../hooks/useLocation';
import {LoadingScreen} from '../../screens/LoadingScreen';
import {Fab} from './../Fab';
// import MapboxGL from '@react-native-mapbox-gl/maps';
import MapboxGL from '@rnmapbox/maps';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import {UserTrackingMode} from '@rnmapbox/maps/javascript/components/Camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalStyles} from '../../theme/theme';
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  Paragraph,
  Portal,
  TextInput,
} from 'react-native-paper';
import {Colors} from '../../theme/colors';
import {ImageButton} from './../ImageButton';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsYWt1NHYwNjBxMXYzbnBqN2luamV2ajQifQ.XJQH9SnPmCxVPoDnU0P2KQ',
);
MapboxGL.setConnected(true);
const {MapView, Camera, PointAnnotation, MarkerView} = MapboxGL;

type Position = number[];

const window = Dimensions.get('window');
const height = window.width > 500 ? 80 : 50;
const heightBackground = window.height > 720 ? 600 : 400;
const iconSize = window.width > 500 ? 70 : 50;
const iconSizeFab = window.width > 500 ? 50 : 20;

export const MapBox = () => {
  const navigation = useNavigation();
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    folloowUserLocation,
    userLocation,
    stopFollowUserLocation,
    routeLines,
  } = useLocation();
  const [marks, setMarks] = useState<Position[]>([]);
  const mapViewRef = useRef<MapboxGL.MapView>();
  const cameraRef = useRef<MapboxGL.Camera>();
  const followView = useRef<boolean>(false);
  const [initialPositionArray, setInitialPositionArray] = useState<number[]>(
    [],
  );
  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const UserLocation = [2.374400000000037, 48.9052];
  const featureRef = useRef<any>([]);

  //seccion useEffect

  useEffect(() => {
    if (followView.current) return;

    const {latitude, longitude} = userLocation;
    getCurrentLocation().then(res => {
      setInitialPositionArray([res.longitude, res.latitude]);
    });
  }, [userLocation]);

  useEffect(() => {
    folloowUserLocation();

    return () => {
      //cancelar el seguimiento
      stopFollowUserLocation();
    };
  }, []);

  //seccion metodos

  const showDialog = (feature: any) => {
    featureRef.current = feature;
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);
  const hideDialogInfo = () => setVisibleInfo(false);

  const showMark = () => {
    setVisibleInfo(true);
  };

  const addMarkFeature = () => {
    const coords = featureRef.current.geometry.coordinates;
    setMarks([...marks, coords]);
    setVisible(false);
  };

  const addMarkPlus = () => {
    const coords = initialPositionArray;
    setMarks([...marks, coords]);
  };

  const centerPosition = async () => {
    const location = await getCurrentLocation();
    followView.current = true;
    const posi: Position = [location.longitude, location.latitude];
    cameraRef.current?.flyTo(posi, 200);
  };

  const onUserLocationUpdate = (location: any) => {};

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        enabled={false}
        style={styles.page}>
        <View style={styles.container}>
          <MapView
            ref={element => (mapViewRef.current = element!)}
            style={styles.map}
            logoEnabled={true}
            localizeLabels={true}
            collapsable={true}
            onLongPress={data => {
              showDialog(data);
            }}>
            <Camera
              ref={reference => (cameraRef.current = reference!)}
              zoomLevel={14}
              centerCoordinate={initialPositionArray}
              followUserLocation={false}
              followUserMode={UserTrackingMode.FollowWithCourse}
              animationMode="flyTo"
              animationDuration={1000}
              allowUpdates={true}
            />
            {/* <PointAnnotation id="point" coordinate={initialPositionArray} /> */}
            <MapboxGL.UserLocation
              visible={true}
              onUpdate={location => onUserLocationUpdate(location)}
            />
            {marks.length > 0 &&
              marks.map(x => {
                return (
                  <MarkerView coordinate={x}>
                    <TouchableOpacity onPress={() => showMark()}>
                      <View style={styles.markerContainer}>
                        {/* <Icon
                          style={globalStyles.icons}
                          name="star"
                          size={35}
                          color={Colors.darkorange}
                        /> */}
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
                          )}>
                        </Button>
                        {/* <IconButton
                          icon="map-marker"
                          iconColor="black"
                          style={{
                            alignSelf: 'center',
                            backgroundColor: 'transparent',
                            width: 50,
                            height: 50,
                          }}
                          size={50}
                        /> */}
                      </View>
                    </TouchableOpacity>
                  </MarkerView>
                );
              })}
          </MapView>
        </View>

        {/* dialogo creacion */}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Crear marca</Dialog.Title>
            <Dialog.Content>
              <Text
                style={{
                  ...globalStyles.globalText,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1C2321',
                }}>
                Nombre marca
              </Text>
              <TextInput
                style={{marginVertical: 15}}
                label="Nombre de la marca"
                autoCorrect={false}
                autoCapitalize="none"
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                autoFocus={true}
                dense={true}
              />
              {featureRef.current.geometry && (
                <Text
                  style={{
                    ...globalStyles.globalText,
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1C2321',
                  }}>
                  {featureRef.current.geometry.coordinates}
                </Text>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>cancel</Button>
              <Button onPress={() => addMarkFeature()}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* dialogo con datos */}
        <Dialog visible={visibleInfo} onDismiss={hideDialogInfo}>
          <Dialog.Title>Datos de la marca</Dialog.Title>
          <Dialog.Content>
            {featureRef.current.geometry && (
              <Text
                style={{
                  ...globalStyles.globalText,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1C2321',
                }}>
                {featureRef.current.geometry.coordinates[0]}
                {featureRef.current.geometry.coordinates[1]}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialogInfo}>cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </KeyboardAvoidingView>
      {/* <Fab
        iconName="compass-outline"
        onPress={() => centerPosition()}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />
      <Fab
        iconName="add-outline"
        onPress={() => addMarkPlus()}
        style={{position: 'absolute', bottom: 80, right: 20}}
      />
      <Fab
        iconName="arrow-back-outline"
        onPress={() => navigation.navigate('HomeScreen' as never)}
        style={{position: 'absolute', top: 40, left: 20}}
      /> */}

      {/* buttons */}
      <View
        style={{...styles.button, position: 'absolute', bottom: 20, right: 20}}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => centerPosition()}>
          <Image
            source={require('../../assets/icons/center-position.png')}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: 50,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{...styles.button, position: 'absolute', bottom: 80, right: 20}}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => addMarkPlus()}>
          <Image
            source={require('../../assets/icons/add.png')}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: 50,
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.button,
          position: 'absolute',
          top: 40,
          left: 20,
          transform: [{rotate: '180deg'}],
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
        </TouchableOpacity>
      </View>
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
