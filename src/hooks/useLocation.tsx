import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import {useEffect, useRef, useState} from 'react';
import {Location} from '../interfaces/appInterfaces';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [routeLines, setRouteLines] = useState<Location[]>([]);

  const [initialPositionArray, setInitialPositionArray] = useState<number[]>(
    [],
  );
  const [initialPosition, setInitialPosition] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const watchId = useRef<number>();
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLocation) {
      // getCurrLocation();
      getCurrentLocation().then(location => {
        if (!isMounted.current) return;
        setInitialPosition(location);
        setInitialPositionArray([location.longitude, location.latitude]);
        setUserLocation(location);
        setRouteLines(routes => [...routes, location]);
        setHasLocation(true);
      });
    }
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        info => {
          resolve({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          });
        },
        err => {
          if (err.code === 1) {
            console.log("Permiso denegado");
          } else if (err.code === 2) {
            console.log("Ubicación no disponible");
          } else if (err.code === 3) {
            console.log("Tiempo de espera agotado");
          }
          reject({err}),
            {
              enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
            };
        },
      );
    });
  };

  const followUserLocation = () => {
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        // console.log('entrado en watch position')
        if (!isMounted.current) return;
        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        // console.log('entra en watchPosition');
        setUserLocation(location);
        setRouteLines(routes => [...routes, location]);
      },
      err => console.log(err),
      {
        enableHighAccuracy: true,
        distanceFilter: 5, //metros para que te notifique
        timeout: 20000, maximumAge: 1000 
      },
    );
  };

  const stopFollowUserLocation = () => {
    if (watchId.current) Geolocation.clearWatch(watchId.current);
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    followUserLocation,
    userLocation,
    stopFollowUserLocation,
    routeLines,
    initialPositionArray,
    setInitialPositionArray,
  };
};
