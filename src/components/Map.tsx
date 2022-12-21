import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useLocation} from '../hooks/useLocation';
import {LoadingScreen} from '../screens/LoadingScreen';
import {Fab} from './Fab';


// interface Props extends StackScreenProps<any, any>{};


export const Map = () => {
  const {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    folloowUserLocation,
    userLocation,
    stopFollowUserLocation,
    routeLines,
  } = useLocation();
  const mapViewRef = useRef<MapView>();
  const followView = useRef<boolean>(false);

  const [showPolyline, setShowPolyline] = useState<boolean>();
  const navigation = useNavigation();

  useEffect(() => {
    folloowUserLocation();

    return () => {
      //cancelar el seguimiento
      stopFollowUserLocation();
    };
  }, []);

  useEffect(() => {
    if (followView.current) return;

    const {latitude, longitude} = userLocation;

    mapViewRef.current?.animateCamera({
      center: {
        latitude: latitude,
        longitude: longitude,
      },
    });
  }, [userLocation]);

  const centerPosition = async () => {
    const location = await getCurrentLocation();

    followView.current = true;

    mapViewRef.current?.animateCamera({
      center: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  };

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        onLongPress={info => console.log(info.nativeEvent.coordinate)}
        onTouchStart={() => (followView.current = false)}
        ref={element => (mapViewRef.current = element!)}
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: initialPosition!.latitude,
          longitude: initialPosition!.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {showPolyline && (
          <Polyline
            coordinates={routeLines}
            strokeColor="black"
            strokeWidth={3}
          />
        )}
  {/* mapbox */}
        {/* <Marker
          image={require('../assets/custom-marker.png')}
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="titulo del marcador"
          description="prueba del marcador"
        /> */}
      </MapView>
      <Fab
        iconName="compass-outline"
        onPress={() => centerPosition()}
        style={{position: 'absolute', bottom: 20, right: 20}}
      />

      <Fab
        iconName="brush-outline"
        onPress={() => setShowPolyline(!showPolyline)}
        style={{position: 'absolute', bottom: 80, right: 20}}
      />
      <Fab
        iconName="arrow-back-outline"
        onPress={() => navigation.navigate('HomeScreen' as never)}
        style={{position: 'absolute', top: 40, left: 20}}
      />
    </>
  );
};
