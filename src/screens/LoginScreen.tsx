import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomAlert} from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';
import {UserList} from '../data/usersTemp';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoadingScreen} from './LoadingScreen';
import {Size} from '../theme/size';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import translate from '../theme/es.json';
import SplashScreen from 'react-native-splash-screen'
import citmapApi from '../api/citmapApi';
import { Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { globalStyles } from '../theme/theme';

const height = Size.globalWidth > 500 ? 80 : 50;
const iconSize = Size.globalWidth > 500 ? 70 : 40;

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const {signIn, signOut, signUp, errorMessage, removeError} = useContext(AuthContext);
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  const {showAlert} = CustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  // console.log(authState.token);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '235777853257-rnbdsrqchtl76jq0givh1h6l7u47rs4k.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    if (errorMessage.length === 0) return;
    // CustomAlert().showAlertOneButton(
    //   'Error de inicio de sesion',
    //   errorMessage,
    //   'Ok',
    //   removeError,
    //   () => console.log()
    // );
    console.log(userError)
    setUserError(true)
  }, [errorMessage]);

  //aquí se comprobaría si existe el usuario y en caso de que sí, se le permitiría pasar
  const loggin = () => {
    Keyboard.dismiss();
    signIn({correo: form.userName, password: form.password})
  }

  //TODO mover todo esto a un contexto para que se pueda controlar el logout desde cualquier lado
  const logginGoogle = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setIsLoading(false);
      // signIn();
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


  return (
    // <View style={{flex: 1, backgroundColor: 'transparent'}}>
    //   <ImageBackground
    //     source={require('../assets/backgrounds/login-background.jpg')}
    //     resizeMode="cover"
    //     style={{flex: 1, alignSelf: 'stretch', height: heightBackground}}>
    //     <View style={{flex: 1}}>
    //       <View
    //         style={{
    //           position: 'absolute',
    //           backgroundColor: 'grey',
    //           // width: 200,
    //           // height: 200,
    //           justifyContent: 'center',
    //           alignSelf: 'center',
    //           marginTop: 30,
    //         }}>
    //         <Text>CITMAP</Text>
    //       </View>
    //       <ScrollView disableScrollViewPanResponder={true} style={{flex: 1}}>
    //         <KeyboardAvoidingView
    //           style={{
    //             ...style.container,
    //           }}
    //           focusable={false}>
    //           {/* data container */}
    //           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //             <View style={{marginBottom: 20}}>
    //               {/* title */}
    //               <Text
    //                 style={{
    //                   ...globalStyles.globalText,
    //                   textAlign: 'center',
    //                   fontSize: FontSize.fontSizeTextTitle,
    //                   fontWeight: 'bold',
    //                   color: '#042f66',
    //                 }}>
    //                 Inicio de sesión
    //               </Text>
    //               {/* user name and icon */}
    //               <View
    //                 style={{
    //                   flexDirection: 'row',
    //                   width: Size.globalWidth - 25,
    //                   alignSelf: 'center',
    //                   justifyContent: 'center',
    //                 }}>
    //                 <TextInput
    //                   style={{
    //                     ...style.textInput,
    //                   }}
    //                   left={
    //                     <TextInput.Icon
    //                       size={iconSize}
    //                       icon={({size, color}) => (
    //                         <Image
    //                           source={require('../assets/icons/user.png')}
    //                           style={{
    //                             width: Size.globalWidth > 500 ? size - 10 : size,
    //                             height: Size.globalWidth > 500 ? size - 10 : size,
    //                           }}
    //                         />
    //                       )}
    //                       style={{
    //                         paddingLeft: Size.globalWidth > 500 ? 15 : 0,
    //                         backgroundColor: 'transparent',
    //                       }}
    //                     />
    //                     // <TextInputIcon icon={require('../assets/icons/user.png')} />
    //                   }
    //                   placeholder="Nombre de usuario"
    //                   allowFontScaling={true}
    //                   underlineStyle={{borderRadius: 200, marginHorizontal: 5}}
    //                   mode="flat"
    //                   autoCorrect={false}
    //                   autoCapitalize="none"
    //                   onChangeText={value => onChange(value, 'userName')}
    //                   underlineColor="#B9E6FF"
    //                   activeOutlineColor="#5C95FF"
    //                   selectionColor="#2F3061"
    //                   textColor="#2F3061"
    //                   placeholderTextColor={Colors.lightblue}
    //                   outlineColor="#5C95FF"
    //                   autoFocus={false}
    //                   dense={false}
    //                   onPressIn={() => setUserError(false)}
    //                   error={userError}
    //                 />
    //               </View>
    //               {/* password and icon */}
    //               <View
    //                 style={{
    //                   flexDirection: 'row',
    //                   width: Size.globalWidth - 25,
    //                   alignSelf: 'center',
    //                   marginVertical: 15,
    //                   justifyContent: 'center',
    //                 }}>
    //                 {/* <View
    //               style={{
    //                 width: iconSize,
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 marginTop: 15,
    //                 marginHorizontal: 10,
    //                 paddingBottom: 5,
    //               }}>
    //               <IconButton
    //                 icon="lock"
    //                 iconColor={'#5C95FF'}
    //                 size={iconSize}
    //                 style={{
    //                   width: iconSize,
    //                   height: iconSize,
    //                   alignSelf: 'center',
    //                   top: 4,
    //                 }}
    //               />
    //             </View> */}
    //                 <TextInput
    //                   style={{...style.textInput}}
    //                   left={
    //                     <TextInput.Icon
    //                       size={iconSize}
    //                       icon={({size, color}) => (
    //                         <Image
    //                           source={require('../assets/icons/password.png')}
    //                           style={{
    //                             width: Size.globalWidth > 500 ? size - 10 : size,
    //                             height: Size.globalWidth > 500 ? size - 10 : size,
    //                           }}
    //                         />
    //                       )}
    //                       style={{
    //                         paddingLeft: Size.globalWidth > 500 ? 15 : 0,
    //                         backgroundColor: 'transparent',
    //                       }}
    //                     />
    //                   }
    //                   textContentType={'password'}
    //                   secureTextEntry={true}
    //                   underlineStyle={{borderRadius: 200, marginHorizontal: 5}}
    //                   allowFontScaling={true}
    //                   placeholder="Contraseña"
    //                   mode="flat"
    //                   autoCorrect={false}
    //                   autoCapitalize="none"
    //                   onChangeText={value => onChange(value, 'password')}
    //                   underlineColor="#B9E6FF"
    //                   activeOutlineColor="#5C95FF"
    //                   selectionColor="#2F3061"
    //                   textColor="#2F3061"
    //                   placeholderTextColor={Colors.lightblue}
    //                   outlineColor="#5C95FF"
    //                   autoFocus={false}
    //                   dense={true}
    //                   onPressIn={() => setPassError(false)}
    //                   error={passError}
    //                 />
    //               </View>
    //             </View>
    //           </TouchableWithoutFeedback>

    //           {/* remember me and forgot password  */}
    //           <View
    //             style={{
    //               flexDirection: 'row',
    //               marginLeft:Size.globalWidth > 500 ? 25 : 10,
    //               marginRight:Size.globalWidth > 500 ? 35 : 20,
    //               justifyContent: 'space-between',
    //               alignItems: 'center',
    //               marginTop: Size.globalWidth > 500 ? 20 : 0,
    //               marginBottom: 5,
    //               paddingHorizontal: 10,
    //             }}>
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'flex-start',
    //               }}>
    //               <Checkbox
    //                 status={checked ? 'checked' : 'unchecked'}
    //                 onPress={() => {
    //                   setChecked(!checked);
    //                 }}
    //               />
    //               <Text
    //                 style={{
    //                   alignSelf: 'center',
    //                   justifyContent: 'center',
    //                   fontSize: FontSize.fontSizeTextMin,
    //                   fontWeight: 'bold',
    //                 }}>
    //                 Remember me
    //               </Text>
    //             </View>
    //             <View
    //               style={{
    //                 // right: window.width > 500 ? -300 : -20,
    //                 flexDirection: 'row',
    //                 justifyContent: 'flex-end',
    //               }}>
    //               <TouchableOpacity
    //                 style={{alignSelf: 'flex-end', justifyContent: 'flex-end'}}
    //                 onPress={() => navigation.replace('ForgotPassword')}
    //                 activeOpacity={0.6}>
    //                 <Text
    //                   style={{
    //                     color: '#F3A712',
    //                     fontWeight: 'bold',
    //                     fontSize: FontSize.fontSizeTextMin,
    //                   }}>
    //                   He olvidado la contraseña
    //                 </Text>
    //               </TouchableOpacity>
    //             </View>
    //           </View>

    //           {/* line divider */}
    //           <Divider
    //             bold={true}
    //             style={{marginVertical: Size.globalHeight > 720 ? 40 : 10}}
    //           />

    //           {/* register and enter with google */}
    //           <View style={style.orContainer}>
    //             <View
    //               style={{
    //                 flex: 1,
    //               }}>
    //               {/* <Button
    //                 style={{
    //                   // width: window.width > 500 ? '50%' : window.width -250,
    //                   height: window.height > 720 ? 70 : 40,
    //                   borderRadius: 40,
    //                   justifyContent: 'center',
    //                   marginRight: 20,
    //                 }}
    //                 labelStyle={{
    //                   fontSize: FontSize.fontSizeText,
    //                   paddingTop: window.height > 720 ? 10 : 0,
    //                 }}
    //                 mode="contained"
    //                 buttonColor={Colors.secondary}
    //                 onPress={() => navigation.replace('RegisterScreen')}>
    //                 Registro
    //               </Button> */}

    //               <ImageButton
    //                 uri="login-background.jpg"
    //                 text="Registro"
    //                 style={{
    //                   minWidth: 120,
    //                   height: '8%',
    //                   borderRadius: 40,
    //                   justifyContent: 'center',
    //                   marginRight: 20,
    //                   marginBottom: 10,
    //                   // alignSelf: 'center',
    //                 }}
    //                 // buttonColor="#5C95FF"
    //                 onPress={() => navigation.replace('RegisterScreen')}
    //               />
    //             </View>

    //             <View style={{...style.verticalSlash}}></View>
    //             <View
    //               style={{
    //                 flex: 1,
    //                 flexDirection: 'row',
    //                 // justifyContent: 'space-evenly',
    //                 alignItems: 'center',
    //                 marginLeft: 10,
    //               }}>
    //               <View style={{paddingRight: 0, marginHorizontal: 10}}>
    //                 <TouchableOpacity
    //                   activeOpacity={0.5}
    //                   onPress={() => logginGoogle()}>
    //                   <Image
    //                     source={require('../assets/icons/google.png')}
    //                     style={{
    //                       width: iconSize,
    //                       height: iconSize,
    //                       borderRadius: 50,
    //                     }}
    //                   />
    //                 </TouchableOpacity>
    //               </View>
    //               <View style={{paddingRight: 0, marginHorizontal: 20}}>
    //                 <TouchableOpacity
    //                   activeOpacity={0.5}
    //                   onPress={() => logginGoogle()}>
    //                   <Image
    //                     source={require('../assets/icons/facebook.png')}
    //                     style={{
    //                       width: iconSize,
    //                       height: iconSize,
    //                       borderRadius: 50,
    //                     }}
    //                   />
    //                 </TouchableOpacity>
    //               </View>
    //             </View>
    //           </View>

    //           {/* sign in button  */}
    //           {/* <View style={{justifyContent: 'center', marginTop: 20}}>
    //           <Button
    //             style={{
    //               // marginTop: 25,
    //               width: '50%',
    //               height: window.height > 720 ? 70 : 40,
    //               alignSelf: 'center',
    //               justifyContent: 'center',
    //               borderRadius: 30,
    //               backgroundColor: Colors.secondary,
    //             }}
    //             labelStyle={{
    //               fontSize: FontSize.fontSizeText + 4,
    //               paddingTop: window.height > 720 ? 16 : 0,
    //             }}
    //             icon="send"
    //             mode="contained"
    //             buttonColor="#5C95FF"
    //             onPress={() => loggin()}>
    //             Iniciar sesion
    //           </Button>
    //         </View> */}
    //           {/* sign in */}
    //           <View style={{justifyContent: 'center', marginHorizontal: 20}}>
    //             <ImageButton
    //               uri="login-background.jpg"
    //               text="Iniciar sesion"
    //               style={{
    //                 marginTop: '15%',
    //                 // width: '70%',
    //                 // height: window.height > 720 ? 70 : 40,
    //                 // alignSelf: 'center',
    //                 // justifyContent: 'center',
    //                 // borderRadius: 30,
    //                 // backgroundColor: Colors.secondary,
    //                 // position: 'relative',
    //                 // marginTop: 30,
    //               }}
    //               // labelStyle={{
    //               //   fontSize: FontSize.fontSizeText + 4,
    //               //   paddingTop: window.height > 720 ? 16 : 0,
    //               // }}
    //               // icon="send"
    //               // mode="contained"
    //               // buttonColor="#5C95FF"
    //               onPress={() => loggin()}
    //             />
    //           </View>
    //         </KeyboardAvoidingView>
    //       </ScrollView>
    //     </View>
    //   </ImageBackground>
    // </View>
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: '8%'}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/backgrounds/login-background.jpg')}
            style={{
              width: '70%',
              height: '30%',
              borderRadius: 50,
              transform: [{rotate: '-5deg'}],
            }}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: FontSize.fontSizeTextTitle,
            fontWeight: '500',
            color: '#333',
            marginBottom: '8%',
            alignSelf: 'center',
          }}>
          {translate.strings.login_screen[0].title}
        </Text>

        <InputField
          label={translate.strings.login_screen[0].mail_input}
          icon="email-outline"
          keyboardType="email-address"
          multiline={false}
          numOfLines={1}
          onChangeText={value => onChange(value, 'userName')}
        />
        <InputField
          label={translate.strings.login_screen[0].password_input}
          icon="lock-outline"
          inputType="password"
          multiline={false}
          numOfLines={1}
          onChangeText={value => onChange(value, 'password')}
        />


        <CustomButton label={translate.strings.login_screen[0].login_button} onPress={() => loggin()} />
          <TouchableOpacity style={{alignItems: 'flex-end', marginBottom: '8%'}}
            onPress={() => navigation.replace('ForgotPassword')}>
            <Text
              style={{
                color: Colors.darkorange,
                fontWeight: '700',
                fontFamily: 'roboto',
                fontSize: FontSize.fontSizeText,
              }}>
              {' '}
              {translate.strings.login_screen[0].recovery_password}
            </Text>
          </TouchableOpacity>

        <Text
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '5%',
            fontFamily: 'roboto',
            fontSize: FontSize.fontSizeText,
          }}>
          {translate.strings.login_screen[0].or_login}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: '10%',
          }}>
          <TouchableOpacity
            onPress={() => {
              logginGoogle();
            }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <Image
              source={require('../assets/icons/google.png')}
              style={{
                width: iconSize,
                height: iconSize,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{fontFamily: 'roboto', fontSize: FontSize.fontSizeText}}>
          {translate.strings.login_screen[0].new_in_app}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace('RegisterScreen')}>
            <Text
              style={{
                color: Colors.darkorange,
                fontWeight: '700',
                fontFamily: 'roboto',
                fontSize: FontSize.fontSizeText,
              }}>
              {' '}
              {translate.strings.login_screen[0].register}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        style={{alignItems: 'center'}}
        onBackdropPress={() => {setUserError(false), removeError()}}
        isVisible={userError}
        animationIn="shake"
        animationInTiming={300}
        animationOut="zoomOut"
        animationOutTiming={300}
        // backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View
          style={globalStyles.viewModal}>
          <Text style={{justifyContent: 'center', fontSize: FontSize.fontSizeTextTitle}}>ERROR</Text>
          <Text style={{justifyContent: 'center', fontSize: FontSize.fontSizeText}}>{errorMessage}</Text>
        </View>
      </Modal>
    </SafeAreaView>
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
    width: Size.globalWidth - 25,
    height: Size.globalHeight,
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
    fontSize: FontSize.fontSizeText,
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
    width: '80%',
    height: height,
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: '5%',
    paddingBottom: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
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
    alignSelf: 'center',
  },
  verticalSlash: {
    height: '100%',
    width: 2,
    backgroundColor: '#909090',
  },
});
