import Geolocation from '@react-native-community/geolocation';
import {useEffect, useRef, useState} from 'react';
import {Location} from '../interfaces/appInterfaces';

export const useLocation = () => {
  const [hasLocation, setHasLocation] = useState(false);
  const [routeLines, setRouteLines] = useState<Location[]>([]);

  const [initialPositionArray, setInitialPositionArray] = useState<number[]>(
    [],
  );
  const [initialPosition, setInitialPosition] = useState<Location>();

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
    getCurrentLocation().then(location => {
      console.log('get currentlocation usereffect');
      if (!isMounted.current) return;
      setInitialPosition(location);
      setInitialPositionArray([location.longitude, location.latitude]);
      setUserLocation(location);
      setRouteLines(routes => [...routes, location]);
      setHasLocation(true);
    });
  }, []);

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        info => {
          console.log(info);
          resolve({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          });
        },
        err => {
          console.log(err);
          reject({err}),
            {
              enableHighAccuracy: true,
            };
        },
      );
    });
  };

  const followUserLocation = () => {
    
    watchId.current = Geolocation.watchPosition(
      ({coords}) => {
        if (!isMounted.current) return;

        const location: Location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setUserLocation(location);

        setRouteLines(routes => [...routes, location]);
      },
      err => {console.log(err),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
      }},
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
