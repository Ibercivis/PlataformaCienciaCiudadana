import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PermissionsContext} from '../context/PermissionsContext';
import {LoginScreen} from '../screens/LoginScreen';
import {AuthContext} from '../context/AuthContext';
import {DrawerNavigation} from './DrawerNavigation';
import {RegisterScreen} from '../screens/RegisterScreen';
import {ForgotPassword} from '../screens/ForgotPassword';
import {LoadingScreen} from '../screens/LoadingScreen';
import { BottomTabNavigation } from './BottomTabNavigation';
import { BackgroundLayerStyle } from '@rnmapbox/maps';

const Stack = createStackNavigator();

export const Navigator = () => {
  //permite conocer por medio del contexto si se han garantizado los permisos que elijamos
  const {permissions} = useContext(PermissionsContext);

  //si no está logged, se le redirigirá hasta la pantalla de login
  const {status} = useContext(AuthContext);

  if (status === 'checking') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'transparent',
        },
        headerTransparent: true
      }}>
      {status !== 'authenticated' ? (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              // transitionSpec: {
              //   open: config,
              //   close: config,
              // },
              cardStyleInterpolator: ({ current, next, layouts }) => {
                return {
                  cardStyle:{
                    transform:[
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-layouts.screen.width, 0],
                        }),
                      },
                      {
                        scale: 1
                      }
                    ]
                  }
                }
              }
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              // transitionSpec: {
              //   open: config,
              //   close: config,
              // },
              cardStyleInterpolator: ({ current, next, layouts }) => {
                return {
                  cardStyle:{
                    transform:[
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      },
                      {
                        scale: 1
                      }
                    ]
                  }
                }
              }
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              // transitionSpec: {
              //   open: config,
              //   close: config,
              // },
              cardStyleInterpolator: ({ current, next, layouts }) => {
                return {
                  cardStyle:{
                    transform:[
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0],
                        }),
                      }
                    ]
                  }
                }
              }
            }}
          />
        </>
      ) : (
        // <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      )}

      {/* {permissions.locationStatus === 'granted' ? (
        <Stack.Screen name="MapScreen" component={MapScreen} />
      ) : (
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
      )} */}
    </Stack.Navigator>
  );
};

const config = {
  // animation: 'timing',
  config: {
    stiffness: 1000,
    damping: 10000,
    mass: 12,
    overshootClamping: true,
    restDisplacementThreshold: 1.01,
    restSpeedThreshold: 1.01,
    
  },
};
