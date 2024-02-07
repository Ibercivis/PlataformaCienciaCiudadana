import {createContext, useEffect, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  request,
  check,
  openSettings,
} from 'react-native-permissions';

// aquí se pondría el permiso
export interface PermissionsState {
  locationStatus: PermissionStatus;
  camera: PermissionStatus;
  storage: PermissionStatus;
}

export const permissionInitState: PermissionsState = {
  locationStatus: 'unavailable',
  camera: 'unavailable',
  storage: 'unavailable',
};

type PermissionsContextProps = {
  permissions: PermissionsState;
  askLocationPermission: () => void;
  checkLocationPErmission: () => void;
};

// qué exporta
export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ({children}: any) => {
  const [permissions, setPermissions] = useState(permissionInitState);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkLocationPErmission();
      }
    });
  }, []);

  const askLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    let permissionStatusCamera: PermissionStatus;
    let permissionStatusStorage: PermissionStatus = 'unavailable';

    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissionStatusCamera = await request(PERMISSIONS.IOS.CAMERA);
      permissionStatusStorage = await request(PERMISSIONS.IOS.STOREKIT);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Get your location to post request',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      permissionStatusCamera = await request(PERMISSIONS.ANDROID.CAMERA, {
        title: 'Camera Permission',
        // message: 'Get your location to post request',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      const temp = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      console.log(temp)
      if (temp === 'granted') {
        permissionStatusStorage = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            // message: 'Get your location to post request',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      } else {
        openSettings();
      }
    }

    if (permissionStatus === 'blocked') {
      openSettings();
    }
    if (permissionStatusCamera === 'blocked') {
      openSettings();
    }
    if (permissionStatusStorage === 'blocked') {
      openSettings();
    }
    console.log(permissionStatus);
    console.log(permissionStatusStorage);
    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
      camera: permissionStatusCamera,
      storage: permissionStatusStorage,
    });
  };

  const checkLocationPErmission = async () => {
    let permissionStatus: PermissionStatus;
    let permissionStatusCamera: PermissionStatus;
    let permissionStatusStorage: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissionStatusCamera = await check(PERMISSIONS.IOS.CAMERA);
      permissionStatusStorage = await check(PERMISSIONS.IOS.STOREKIT);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatusCamera = await check(PERMISSIONS.ANDROID.CAMERA);
      permissionStatusStorage = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
    }
    setPermissions({
      ...permissions,
      locationStatus: permissionStatus,
      camera: permissionStatusCamera,
      storage: permissionStatusStorage,
    });
  };

  const checkCameraPermission = async () => {
    let permissionStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.CAMERA);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);
    }
    console.log('camera permission ' + permissionStatus);
    setPermissions({...permissions, camera: permissionStatus});
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPErmission,
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
