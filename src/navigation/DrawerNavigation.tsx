import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {SettingsScreen} from '../screens/SettingsScreen';
import {HomeScreen} from '../screens/HomeScreen';
import React, {useContext, useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from '../theme/theme';
import {LoginScreen} from '../screens/LoginScreen';
import {AuthContext} from '../context/AuthContext';
import {NavigatorMapBox} from './NavigatorMapBox';
import {HomeNavigator} from './HomeNavigator';
import {Colors} from '../theme/colors';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import { Size } from '../theme/size';
import { Divider } from 'react-native-paper';

export type StackParams = {
  // HomeScreen: {projects?: Project[]};
  // HomeScreen: undefined;
  // NewProjectScreen: undefined;
  // Marcador: {projectName: string,description: string, photo?: string, marks?: Mark[], onBack?: boolean };
  // MarcadorExample: {projectName: string,description: string, photo?: string, marks: Mark[]};
  PaperScreen: undefined;
  NavigatorMap: undefined;
  NavigatorMapBox: undefined;
  SettingsScreen: undefined;
  LoginScreen: undefined;
  ProjectNavigator: undefined;
};

const Drawer = createDrawerNavigator<StackParams>();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <MenuInterno {...props} />}
      // drawerContent={props => <DrawerPaperNavigation/>}
      // drawerContent={props => <DrawerPaperCollapsedNavigation/>}
    >
      {/* <Drawer.Screen name="HomeScreen" component={HomeScreen} /> */}
      <Drawer.Screen name="ProjectNavigator" component={HomeNavigator} />
      {/* <Drawer.Screen name="NewProjectScreen" component={NewProjectScreen} />
      <Drawer.Screen name="Marcador" component={Marcador} />
      <Drawer.Screen name="MarcadorExample" component={MarcadorExample} /> */}
      <Drawer.Screen name="NavigatorMapBox" component={NavigatorMapBox} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
    </Drawer.Navigator>
  );
};

const MenuInterno = ({navigation}: DrawerContentComponentProps) => {
  const {signOut} = useContext(AuthContext);
  const [userLogged, setUserLogged] = useState<User>(); //usuario logged

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '235777853257-rnbdsrqchtl76jq0givh1h6l7u47rs4k.apps.googleusercontent.com',
    });
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setUserLogged(currentUser);
    }
    console.log(currentUser?.user.givenName);
  };

  //TODO quitar cuando se reciban tokens y la base de datos esté bien
  const signOutApp = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log(isSignedIn);
      //si ha loggeado por google
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      signOut();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  return (
    <DrawerContentScrollView style={{backgroundColor: 'white'}}>
      <View style={globalStyles.avatarContainer}>
        <Image
          source={{
            uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
          }}
          style={globalStyles.avatar}
        />
        {userLogged && <Text>{userLogged!.user.givenName}</Text>}
      </View>
      <Divider
                style={{
                  borderWidth: 0.8,
                  borderColor: 'grey',
                  width: '95%',
                  marginTop: '2%',
                  alignSelf: 'center',
                }}
              />
      <View style={globalStyles.drawerItems}>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('ProjectNavigator', {screen: 'HomeScreen',params: {dashboard: true}})}>
          <Icon
            style={globalStyles.icons}
            name="home"
            size={Size.iconSizeMedium}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}>Inicio</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('PaperScreen')}>
          <Icon
            style={globalStyles.icons}
            name="eye"
            size={25}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}> Paper</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('ProjectNavigator', {screen: 'HomeScreen',params: {dashboard: false}})}>
          <Icon
            style={globalStyles.icons}
            name="file-multiple"
            size={Size.iconSizeMin+(Size.window.width*0.02)}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}>Mis proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('NavigatorMapBox')}>
          <Icon
            style={globalStyles.icons}
            name="map"
            size={Size.iconSizeMedium}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('SettingsScreen')}>
          <Icon
            style={globalStyles.icons}
            name="cog"
            size={Size.iconSizeMedium}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}> Ajustes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => signOutApp()}>
          <Icon
            style={globalStyles.icons}
            name="logout-variant"
            size={Size.iconSizeMedium}
            color={Colors.primary}
          />
          <Text style={globalStyles.menuText}> Cerrar sesion</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};
