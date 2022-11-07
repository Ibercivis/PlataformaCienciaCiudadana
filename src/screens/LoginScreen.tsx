import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { CustomAlert } from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';
import { UserList } from '../data/usersTemp';
import {useForm} from '../hooks/useForm';

export const LoginScreen = () => {
  const {top} = useSafeAreaInsets();
  const {signIn, setUsername, setPassword} = useContext(AuthContext);
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  const {showAlert} = CustomAlert();

  //aquí se comprobaría si existe el usuario y en caso de que sí, se le permitiría pasar
  const loggin = () => {

    const user = UserList.find(x => x.userName === form.userName);
    if(user){
      const pass = UserList.find(x => x.password === form.password);
      if(pass){
        setUsername(form.userName);
        setPassword(form.password);
        signIn();
      }else{
        showAlert('Error contraseña', 'Constraseña incorrecta, intentelo de nuevo', 'Cancelar', 'Aceptar');
      }
    }else{
      showAlert('Error inicio sesion', 'Usuario incorrecto o no existe', 'Cancelar', 'Aceptar');
    }

 
  }

  return (
    <View style={{...style.container, marginTop: top + 20}}>
      <KeyboardAvoidingView style={{...style.container,flex: 1,}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{marginBottom: 20}}>
              <Text>Inicio de sesión</Text>
              <TextInput
                style={style.input}
                placeholder="Nombre de usuario"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'userName')}
              />
              <TextInput
                textContentType={'password'}
                secureTextEntry={true}
                style={style.input}
                placeholder="Contraseña"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'password')}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            style={style.touchable}
            onPress={() => loggin() }
            activeOpacity={0.6}>
            <Text>Iniciar sesión</Text>
          </TouchableOpacity>
        
      </KeyboardAvoidingView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    borderWidth: 1,
    borderRadius: 25,
    borderColor: 'black',
    margin: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.4)',
    marginVertical: 10,
  },
});
