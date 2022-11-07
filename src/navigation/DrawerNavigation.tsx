import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {SettingsScreen} from '../screens/SettingsScreen';
import {HomeScreen} from '../screens/HomeScreen';
import React, { useContext } from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {globalStyles} from '../thyme/theme';
import {NavigatorMap} from './NavigatorMap';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {



  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <MenuInterno {...props} />}>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="NavigatorMap" component={NavigatorMap} />
      <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
      <Drawer.Screen name="LoginScreen" component={LoginScreen} />
    </Drawer.Navigator>
  );
};

const MenuInterno = ({navigation}: DrawerContentComponentProps) => {

  const {signOut} = useContext(AuthContext);

  return (
    <DrawerContentScrollView>
      <View style={globalStyles.avatarContainer}>
        <Image
          source={{
            uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
          }}
          style={globalStyles.avatar}
        />
      </View>
      <View style={globalStyles.drawerItems}>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('HomeScreen')}>
          <Icon
            style={globalStyles.icons}
            name="home-outline"
            size={25}
            color="black"
          />
          <Text style={globalStyles.menuText}> Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('NavigatorMap')}>
          <Icon
            style={globalStyles.icons}
            name="map-outline"
            size={25}
            color="black"
          />
          <Text style={globalStyles.menuText}> Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => navigation.navigate('SettingsScreen')}>
          <Icon  style={globalStyles.icons} name="settings-outline" size={25} color="black" />
          <Text style={globalStyles.menuText}> Ajustes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...globalStyles.menuButton, flexDirection: 'row'}}
          onPress={() => signOut()}>
          <Icon  style={globalStyles.icons} name="log-out-outline" size={25} color="black" />
          <Text style={globalStyles.menuText}> Cerrar sesion</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};
