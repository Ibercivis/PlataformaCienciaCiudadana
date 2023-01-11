import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomAlert} from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';
import {UserList} from '../data/usersTemp';
import {useForm} from '../hooks/useForm';
import {globalStyles} from '../theme/theme';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {LoadingScreen} from './LoadingScreen';
import {Fab} from '../components/Fab';

const window = Dimensions.get('window');
const height = window.width > 500 ? 80 : 50;
const iconSize = window.width > 500 ? 60 : 30;
const iconSizeFab = window.width > 500 ? 50 : 20;

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const {signIn, setUsername, setPassword, authState} = useContext(AuthContext);
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  const {showAlert} = CustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  // console.log(window.width);
  // console.log(window.height);
  console.log(authState.token);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '235777853257-rnbdsrqchtl76jq0givh1h6l7u47rs4k.apps.googleusercontent.com',
    });
  }, []);

  //aquí se comprobaría si existe el usuario y en caso de que sí, se le permitiría pasar
  const loggin = () => {
    const user = UserList.find(x => x.userName === form.userName);
    if (user) {
      const pass = UserList.find(x => x.password === form.password);
      if (pass) {
        setUsername(form.userName);
        setPassword(form.password);
        if (checked) {
          signIn('true');
        } else signIn();
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

  //TODO mover todo esto a un contexto para que se pueda controlar el logout desde cualquier lado
  const logginGoogle = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUsername(userInfo.user.email);
      setPassword('');
      setIsLoading(false);
      signIn();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('SIGN IN CANCELLED');
        console.log(error.code);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('IN PROGRESS');
        console.log(error.code);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('PLAY SERVICES NOT AVAILABLE');
        console.log(error.code);
      } else {
        // some other error happened
        console.log('OTRO');
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // return (
  //   <View style={{flex: 1, backgroundColor: Colors.lightblue}}>
  //     <ImageBackground
  //       source={require('../assets/login-background.jpg')}
  //       resizeMode="cover"
  //       style={{flex: 1, alignSelf: 'stretch'}}>
  //       <View
  //         style={{
  //           flex: 1,
  //           backgroundColor: 'white',
  //           width: '60%',
  //           position: 'absolute',
  //           transform: [{rotate: '90deg'}],
  //         }}></View>
  //       <KeyboardAvoidingView style={{...style.container, flex: 1}}>
  //         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  //           <View style={{marginBottom: 20}}>
  //             <Text
  //               style={{
  //                 ...globalStyles.globalText,
  //                 textAlign: 'center',
  //                 fontSize: 40,
  //                 fontWeight: 'bold',
  //                 color: '#7D80DA',
  //                 fontStyle: 'italic',
  //                 borderColor: 'black',
  //                 fontFamily: 'gamegirl-classic',
  //                 textShadowColor: Colors.secondary,
  //                 textShadowRadius: 5,
  //               }}>
  //               Inicio de sesión
  //             </Text>
  //             <TextInput
  //               style={{marginTop: 15, paddingBottom: 5}}
  //               placeholder="Nombre de usuario"
  //               label="Nombre de usuario"
  //               mode="flat"
  //               autoCorrect={false}
  //               autoCapitalize="none"
  //               onChangeText={value => onChange(value, 'userName')}
  //               underlineColor="#B9E6FF"
  //               activeOutlineColor="#5C95FF"
  //               selectionColor="#2F3061"
  //               textColor="#2F3061"
  //               outlineColor="#5C95FF"
  //               autoFocus={true}
  //               dense={true}
  //             />
  //             <TextInput
  //               style={{marginTop: 15, paddingBottom: 5}}
  //               label="Constraseña"
  //               mode="flat"
  //               textContentType={'password'}
  //               secureTextEntry={true}
  //               placeholder="Contraseña"
  //               autoCorrect={false}
  //               autoCapitalize="none"
  //               onChangeText={value => onChange(value, 'password')}
  //               underlineColor="#B9E6FF"
  //               activeOutlineColor="#5C95FF"
  //               selectionColor="#2F3061"
  //               textColor="#2F3061"
  //               outlineColor="#5C95FF"
  //               dense={true}
  //             />
  //             {/* <TextInput
  //             style={style.input}
  //             placeholder="Nombre de usuario"
  //             autoCorrect={false}
  //             autoCapitalize="none"
  //             onChangeText={value => onChange(value, 'userName')}
  //           /> */}
  //             {/* <TextInput

  //             textContentType={'password'}
  //             secureTextEntry={true}
  //             style={style.input}
  //             placeholder="Contraseña"
  //             autoCorrect={false}
  //             autoCapitalize="none"
  //             onChangeText={value => onChange(value, 'password')}
  //           /> */}
  //           </View>
  //         </TouchableWithoutFeedback>
  //         <Button
  //           style={{marginTop: 15}}
  //           icon="send"
  //           mode="contained"
  //           buttonColor="#5C95FF"
  //           onPress={() => loggin()}>
  //           Iniciar sesion
  //         </Button>
  //         <GoogleSigninButton
  //           style={{marginTop: 15, alignSelf: 'center'}}
  //           size={GoogleSigninButton.Size.Wide}
  //           color={GoogleSigninButton.Color.Dark}
  //           onPress={() => logginGoogle()}
  //         />
  //         <View style={style.newUserContainer}>
  //           <TouchableOpacity
  //             onPress={() => navigation.replace('RegisterScreen')}
  //             activeOpacity={0.6}>
  //             <Text style={style.buttonText}>Nuevo usuario</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </KeyboardAvoidingView>
  //     </ImageBackground>
  //   </View>
  // );
  return (
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={require('../assets/login-background.jpg')}
        resizeMode="cover"
        style={{flex: 1, alignSelf: 'stretch'}}>
        <View style={{flex: 1}}>
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'grey',
              // width: 200,
              // height: 200,
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 30,
            }}>
            <Text>CITMAP</Text>
          </View>
          <ScrollView disableScrollViewPanResponder={true} style={{flex: 1}}>
            <KeyboardAvoidingView
              style={{
                ...style.container,
              }}
              focusable={false}>
              {/* data container */}
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{marginBottom: 20}}>
                  {/* title */}
                  <Text
                    style={{
                      ...globalStyles.globalText,
                      textAlign: 'center',
                      fontSize: FontSize.fontSize,
                      fontWeight: 'bold',
                      color: '#042f66',
                    }}>
                    Inicio de sesión
                  </Text>
                  {/* user name and icon */}
                  <View
                    style={{
                      flexDirection: 'row',
                      width: window.width - 25,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      style={{
                        ...style.textInput,
                      }}
                      left={
                        <TextInput.Icon
                          size={iconSize}
                          icon="account-circle"
                          style={{paddingLeft: 15}}
                        />
                      }
                      placeholder="Nombre de usuario"
                      mode="flat"
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={value => onChange(value, 'userName')}
                      underlineColor="#B9E6FF"
                      activeOutlineColor="#5C95FF"
                      selectionColor="#2F3061"
                      textColor="#2F3061"
                      outlineColor="#5C95FF"
                      autoFocus={false}
                      dense={false}
                    />
                  </View>
                  {/* password and icon */}
                  <View
                    style={{
                      flexDirection: 'row',
                      width: window.width - 25,
                      alignSelf: 'center',
                      marginVertical: 15,
                      justifyContent: 'center',
                    }}>
                    {/* <View
                  style={{
                    width: iconSize,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 15,
                    marginHorizontal: 10,
                    paddingBottom: 5,
                  }}>
                  <IconButton
                    icon="lock"
                    iconColor={'#5C95FF'}
                    size={iconSize}
                    style={{
                      width: iconSize,
                      height: iconSize,
                      alignSelf: 'center',
                      top: 4,
                    }}
                  />
                </View> */}
                    <TextInput
                      style={{...style.textInput}}
                      left={
                        <TextInput.Icon
                          size={iconSize}
                          icon="lock"
                          style={{paddingLeft: 15}}
                        />
                      }
                      textContentType={'password'}
                      secureTextEntry={true}
                      placeholder="Contraseña"
                      mode="flat"
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={value => onChange(value, 'password')}
                      underlineColor="#B9E6FF"
                      activeOutlineColor="#5C95FF"
                      selectionColor="#2F3061"
                      textColor="#2F3061"
                      outlineColor="#5C95FF"
                      autoFocus={false}
                      dense={true}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* remember me and forgot password  */}
              <View
                style={{
                  flexDirection: 'row',
                  // width: window.width > 500 ? '75%' : window.width - 25,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: window.width > 500 ? 40 : 10,
                  marginBottom: 5,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      fontSize: FontSize.fontSizeText,
                    }}>
                    Remember me
                  </Text>
                </View>
                <View
                  style={{
                    // right: window.width > 500 ? -300 : -20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{alignSelf: 'flex-end', justifyContent: 'flex-end'}}
                    onPress={() => navigation.replace('ForgotPassword')}
                    activeOpacity={0.6}>
                    <Text
                      style={{
                        color: '#F3A712',
                        fontWeight: 'bold',
                        fontSize: FontSize.fontSizeText,
                      }}>
                      He olvidado la contraseña
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* line divider */}
              <Divider
                bold={true}
                style={{marginVertical: window.height > 720 ? 40 : 10}}
              />

              {/* register and enter with google */}
              <View style={style.orContainer}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Button
                    style={{
                      // width: window.width > 500 ? '50%' : window.width -250,
                      height: window.height > 720 ? 70 : 40,
                      borderRadius: 40,
                      justifyContent: 'center',
                      marginRight: 20,
                    }}
                    labelStyle={{
                      fontSize: FontSize.fontSizeText,
                      paddingTop: window.height > 720 ? 10 : 0,
                    }}
                    mode="contained"
                    buttonColor={Colors.secondary}
                    onPress={() => navigation.replace('RegisterScreen')}>
                    Registro
                  </Button>
                </View>

                <View
                  style={{...style.verticalSlash, marginHorizontal: 20}}></View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginLeft: 10,
                  }}>
                  <Fab
                    iconName="logo-google"
                    onPress={() => logginGoogle()}
                    style={{paddingRight: 0, marginHorizontal: 10}}
                    size={iconSize}
                    iconSize={iconSizeFab}
                  />
                  <Fab
                    iconName="logo-facebook"
                    onPress={() => loggin()}
                    style={{paddingRight: 0}}
                    size={iconSize}
                    iconSize={iconSizeFab}
                  />
                </View>
              </View>

              {/* sign in button  */}
              {/* <View style={{justifyContent: 'center', marginTop: 20}}>
              <Button
                style={{
                  // marginTop: 25,
                  width: '50%',
                  height: window.height > 720 ? 70 : 40,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  backgroundColor: Colors.secondary,
                }}
                labelStyle={{
                  fontSize: FontSize.fontSizeText + 4,
                  paddingTop: window.height > 720 ? 16 : 0,
                }}
                icon="send"
                mode="contained"
                buttonColor="#5C95FF"
                onPress={() => loggin()}>
                Iniciar sesion
              </Button>
            </View> */}
            {/* sign in */}
            <View style={{justifyContent: 'center', marginHorizontal: 20}}>
              <Button
                style={{
                  // marginTop: 25,
                  width: '70%',
                  height: window.height > 720 ? 70 : 40,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  backgroundColor: Colors.secondary,
                  position: 'relative',
                  marginTop: 30
                }}
                labelStyle={{
                  fontSize: FontSize.fontSizeText + 4,
                  paddingTop: window.height > 720 ? 16 : 0,
                }}
                icon="send"
                mode="contained"
                buttonColor="#5C95FF"
                onPress={() => loggin()}>
                Iniciar sesion
              </Button>
            </View>
            </KeyboardAvoidingView>

            
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};
//
const style = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    marginHorizontal: 10,
    // justifyContent: 'center',

    backgroundColor: 'white',
    width: window.width - 25,
    height: window.height,
    alignSelf: 'center',
    padding: 15,
    top: '25%',
    bottom: 0,
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
    alignItems: 'flex-start',
    marginTop: 20,
    borderWidth: 1,
    width: '40%',
    borderRadius: 40,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#5C95FF',
    alignSelf: 'center',
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
  textInput: {
    width: window.width > 500 ? window.width - 150 : window.width - 110,
    height: height,
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: 25,
    paddingBottom: 0,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: Colors.secondary,
    fontSize: FontSize.fontSizeText,
  },
  orContainer: {
    paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'center'
    // backgroundColor: 'blue'
  },
  verticalSlash: {
    height: '100%',
    width: 2,
    backgroundColor: '#909090',
  },
});
