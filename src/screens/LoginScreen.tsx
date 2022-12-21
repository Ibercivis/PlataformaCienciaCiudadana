import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomAlert} from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';
import {UserList} from '../data/usersTemp';
import {useForm} from '../hooks/useForm';
import {globalStyles} from '../thyme/theme';
import {Colors} from '../thyme/colors';

const window = Dimensions.get('window');

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
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
    if (user) {
      const pass = UserList.find(x => x.password === form.password);
      if (pass) {
        setUsername(form.userName);
        setPassword(form.password);
        signIn();
      } else {
        showAlert(
          'Error contraseña',
          'Constraseña incorrecta, intentelo de nuevo',
          'Cancelar',
          'Aceptar',
        );
      }
    } else {
      showAlert(
        'Error inicio sesion',
        'Usuario incorrecto o no existe',
        'Cancelar',
        'Aceptar',
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.lightblue}}>
      <View style={{flex: 1, backgroundColor: 'white', width: '60%', position: 'absolute', transform:[{rotate:'90deg'}]}} ></View>
        <KeyboardAvoidingView style={{...style.container, flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{marginBottom: 20}}>
              <Text
                style={{
                  ...globalStyles.globalText,
                  textAlign: 'center',
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}>
                Inicio de sesión
              </Text>
              <TextInput
                style={{marginTop: 15}}
                label="Nombre de usuario"
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'userName')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                autoFocus={true}
                dense={true}
              />
              <TextInput
                style={{marginTop: 15}}
                label="Constraseña"
                mode="outlined"
                textContentType={'password'}
                secureTextEntry={true}
                placeholder="Contraseña"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'password')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                dense={true}
              />
              {/* <TextInput
              style={style.input}
              placeholder="Nombre de usuario"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => onChange(value, 'userName')}
            /> */}
              {/* <TextInput
            
              textContentType={'password'}
              secureTextEntry={true}
              style={style.input}
              placeholder="Contraseña"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => onChange(value, 'password')}
            /> */}
            </View>
          </TouchableWithoutFeedback>
          <Button
            style={{marginTop: 15}}
            icon="send"
            mode="contained"
            buttonColor="#5C95FF"
            onPress={() => loggin()}>
            Iniciar sesion
          </Button>
          {/* <TouchableOpacity
          style={style.touchable}
          onPress={() => loggin()}
          activeOpacity={0.6}>
          <Text style={globalStyles.globalText}>Iniciar sesión</Text>
        </TouchableOpacity> */}
          <View style={style.newUserContainer}>
            <TouchableOpacity
              onPress={() => navigation.replace('RegisterScreen')}
              activeOpacity={0.6}>
              <Text style={style.buttonText}>Nuevo usuario</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      
    </View>
    // <View style={style.parent}>
    // <View style={style.child}>
    //     </View>
    //   </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    marginHorizontal: 10,
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
    borderColor: 'black',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  newUserContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#5C95FF',
  },
  parent: {
    height: '60%',
    width: '100%',
    transform: [{scaleX: 2}, {scaleY: 1}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
  },
  child: {
    flex: 1,
    transform: [{scaleX: 0.5}],

    backgroundColor: Colors.lightblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
