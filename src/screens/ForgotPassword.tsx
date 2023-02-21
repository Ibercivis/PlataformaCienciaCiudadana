import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import { CustomAlert } from '../components/CustomAlert';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import { AuthContext } from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {fonts, FontSize} from '../theme/fonts';
import { Size } from '../theme/size';

const window = Dimensions.get('window');
const iconSize = window.width > 500 ? 60 : 45;
const iconSizeFab = window.width > 500 ? 50 : 20;
const height = window.width > 500 ? 80 : 50;

interface Props extends StackScreenProps<any, any> {}

export const ForgotPassword = ({navigation}: Props) => {
  const {message, removeError, errorMessage, recoveryPass} = useContext(AuthContext)
  const {email, onChange} = useForm({
    email: '',
  });

  useEffect(() => {
    if (message.length === 0) return;
    CustomAlert().showAlertOneButton(
      'Correo enviado',
      message,
      'Ok',
      removeError,
    );
    navigation.replace('LoginScreen')
  }, [message]);

  useEffect(() => {
    if (errorMessage.length === 0) return;
    CustomAlert().showAlertOneButton(
      'Error al recuperar la contraseña',
      // errorMessage,
      "Enter a valid email address.",
      'Ok',
      removeError,
    );
  }, [errorMessage]);
  
  const sendEmail = () => {
    Keyboard.dismiss();
    recoveryPass(email)
  }
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{marginVertical: '4%'}}>
            {/* title */}
            <Text
              style={fonts.title}>
              Recuperar contraseña
            </Text>

            {/* mail and icon */}
            <View
              style={{
                paddingHorizontal: '8%',
              }}>
              <InputField
                label={'Correo'}
                icon="email-outline"
                keyboardType="email-address"
                onChangeText={value => onChange(value, 'email')}
                multiline={false}
                numOfLines={1}
              />
              <CustomButton label={'Enviar'} onPress={() => sendEmail()} />
            </View>

            
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <IconButton
              style={{left: '1%',
              top: window.height * 0.02,
              position: 'absolute',}}
              icon="chevron-left"
              size={Size.iconSizeLarge}
              onPress={() => navigation.replace('LoginScreen')}
            />
    </View>
  );
};

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
  buttonText: {
    fontSize: 18,
    color: '#5C95FF',
    alignSelf: 'center',
  },
  textInput: {
    width: window.width > 500 ? window.width - 150 : window.width - 110,
    height: height,
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: 25,
    paddingBottom: 0,
    borderBottomLeftRadius: 10,
    borderTopEndRadius: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: Colors.secondary,
    fontSize: FontSize.fontSizeText,
  },
});
