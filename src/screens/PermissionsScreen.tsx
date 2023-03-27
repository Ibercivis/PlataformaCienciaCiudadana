import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Platform,  } from 'react-native';
import { PermissionsContext } from '../context/PermissionsContext';

export const PermissionsScreen = () => {
    const [state, setState] = useState(0);
    const {permissions, checkLocationPErmission, askLocationPermission} = useContext(PermissionsContext)

    useEffect(() => {
        checkLocationPermission()
    }, [])
    

    const checkLocationPermission = async () => {
        askLocationPermission();
    }

  return (
    <View style={styles.container}>
        {/* <Text>Permiso de ubicación requerido</Text>
        <TouchableOpacity style={styles.touchable} onPress={checkLocationPermission} activeOpacity={0.6} >
            <Text style={styles.touchableText}>Dar permisos</Text>
        </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchable:{
        borderWidth: 1,
        borderRadius: 25,
        borderColor:'grey',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
    },
    touchableText:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    }
})