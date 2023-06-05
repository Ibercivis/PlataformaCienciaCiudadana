import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView} from 'react-native';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import SplashScreen from 'react-native-splash-screen';

import {Keyboard} from 'react-native';
import Modal from 'react-native-modal';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { LoadingScreen } from '../../screens/LoadingScreen';
import { FontSize } from '../../theme/fonts';
import { Size } from '../../theme/size';
import { globalStyles } from '../../theme/theme';
import { CustomAlert } from '../CustomAlert';
import { CustomButton } from '../utility/CustomButton';
import { InputField } from '../InputField';
import { Colors } from '../../theme/colors';
import translate from '../../theme/es.json';

const height = Size.globalWidth > 500 ? 80 : 50;
const iconSize = Size.globalWidth > 500 ? 70 : 40;

interface Props extends StackScreenProps<any, any> {}

export const LoginComponent = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const {signIn, signOut, signUp, errorMessage, removeError} =
    useContext(AuthContext);
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  const {showAlert} = CustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  console.log("entra en loginComponent");

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: true,
      iosClientId:
        '235777853257-djkpgca69noinapgft2ua7vgq2bcieg3.apps.googleusercontent.com',
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
    // console.log(userError);
    setUserError(true);
  }, [errorMessage]);

  //aquí se comprobaría si existe el usuario y en caso de que sí, se le permitiría pasar
  const loggin = () => {
    Keyboard.dismiss();
    signIn({correo: form.userName, password: form.password});
  };

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
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: '8%', flex: 1}}>
        <Image
          source={require('../../assets/icons/appicon.png')}
          style={{
            alignSelf: 'center',
            width: '50%',
            height: '20%',
            borderRadius: 0,
            marginTop: '5%',
            aspectRatio: 1,
          }}
        />

        <Text
          style={{
            // fontFamily: 'Roboto-Medium',
            fontSize: FontSize.fontSizeTextTitle,
            fontWeight: '500',
            color: '#333',
            marginBottom: '8%',
            marginTop: '8%',
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

        <CustomButton
          label={translate.strings.login_screen[0].login_button}
          onPress={() => loggin()}
        />
        <TouchableOpacity
          style={{alignItems: 'flex-end', marginBottom: '8%'}}
          onPress={() => navigation.replace('ForgotPassword')}>
          <Text
            style={{
              color: Colors.darkorange,
              fontWeight: '700',
              // fontFamily: 'roboto',
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
            // fontFamily: 'roboto',
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
              source={require('../../assets/icons/google.png')}
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
          <Text
            style={{
              // fontFamily: 'roboto',
              fontSize: FontSize.fontSizeText,
            }}>
            {translate.strings.login_screen[0].new_in_app}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace('RegisterScreen')}>
            <Text
              style={{
                color: Colors.darkorange,
                fontWeight: '700',
                // fontFamily: 'roboto',
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
        onBackdropPress={() => {
          setUserError(false), removeError();
        }}
        isVisible={userError}
        animationIn="shake"
        animationInTiming={300}
        animationOut="zoomOut"
        animationOutTiming={300}
        // backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={globalStyles.viewModal}>
          <Text
            style={{
              justifyContent: 'center',
              fontSize: FontSize.fontSizeTextTitle,
            }}>
            ERROR
          </Text>
          <Text
            style={{justifyContent: 'center', fontSize: FontSize.fontSizeText}}>
            {errorMessage}
          </Text>
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
