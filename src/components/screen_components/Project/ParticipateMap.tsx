import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '../../../hooks/useLocation';
import {LoadingScreen} from '../../../screens/LoadingScreen';
import Mapbox from '@rnmapbox/maps';
import {useForm} from '../../../hooks/useForm';
import {StyleSheet} from 'react-native';
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

Mapbox.setWellKnownTileServer('mapbox');
Mapbox.setAccessToken(
  'pk.eyJ1IjoiYXBlbmE3IiwiYSI6ImNsYWt1NHYwNjBxMXYzbnBqN2luamV2ajQifQ.XJQH9SnPmCxVPoDnU0P2KQ',
);

const {
  MapView,
  Camera,
  PointAnnotation,
  MarkerView,
  UserLocation,
  UserTrackingMode,
} = Mapbox;

export const ParticipateMap = () => {
  const {
    hasLocation,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    initialPositionArray,
  } = useLocation();

  //   map variables
  const mapViewRef = useRef<Mapbox.MapView>();
  const cameraRef = useRef<Mapbox.Camera>();
  const followView = useRef<boolean>(false);
  const featureRef = useRef<any>([]);

  //   modal variables
  const [infoModal, setInfoModal] = useState(false);
  const showModalInfo = () => setInfoModal(true);
  const hideModalInfo = () => setInfoModal(false);

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

  useEffect(() => {
    console.log(hasLocation);
    if (hasLocation) {
      showModalInfo();
    }
  }, []);

  if (!hasLocation) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MapView
        ref={element => (mapViewRef.current = element!)}
        style={{flex: 1}}
        logoEnabled={false}
        scaleBarEnabled={false}
        compassEnabled={true}
        collapsable={true}
        onTouchStart={() => console.log('on touch start')}
        onLongPress={data => {
          console.log(JSON.stringify(data, null, 2));
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
        <Mapbox.UserLocation visible />
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
        
      </MapView>
    </>
  );
};

const styles = StyleSheet.create({});
