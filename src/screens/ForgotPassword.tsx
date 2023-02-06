import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {Button, Divider, IconButton, TextInput} from 'react-native-paper';
import { CustomAlert } from '../components/CustomAlert';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import { AuthContext } from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import {globalStyles} from '../theme/theme';

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
      errorMessage,
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
          <View style={{marginVertical: 20}}>
            {/* title */}
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: FontSize.fontSizeTextTitle,
                fontWeight: '500',
                color: '#333',
                marginVertical: '8%',
                alignSelf: 'center',
              }}>
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

            <IconButton
              style={{position: 'absolute', top: 10, left: 2}}
              icon="close-circle"
              size={iconSizeFab + 10}
              onPress={() => navigation.replace('LoginScreen')}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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