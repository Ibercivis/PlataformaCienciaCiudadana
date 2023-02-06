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
import {CustomAlert} from '../components/CustomAlert';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import {AuthContext} from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import translate from '../theme/es.json';

const window = Dimensions.get('window');
const iconSize = window.width > 500 ? 60 : 45;
const iconSizeFab = window.width > 500 ? 50 : 20;
const height = window.width > 500 ? 80 : 50;

interface Props extends StackScreenProps<any, any> {}

export const SettingsScreen = ({navigation}: Props) => {
  const {message, removeError, errorMessage, changePass} = useContext(AuthContext)
  const {pass1, pass2, onChange} = useForm({
    pass1: '',
    pass2: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;
    CustomAlert().showAlertOneButton(
      'Error al cambiar la contraseña',
      errorMessage,
      'Ok',
      removeError,
      () => console.log()
    );
  }, [errorMessage]);

  useEffect(() => {
    if (message.length === 0) return;
    CustomAlert().showAlertOneButton(
      translate.ES.change_password_screen[0].modal_message,
      message,
      'Ok',
      () => okAlert(),
      // removeError,
      () => navigation.navigate('HomeScreen')
    );
    
  }, [message]);

  const okAlert = () => {
    removeError();
    navigation.navigate('HomeScreen');
  }

  const changePassword = () => {
    Keyboard.dismiss();
    changePass(pass1,pass2)
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
              {translate.ES.change_password_screen[0].title}
            </Text>

            {/* mail and icon */}
            <View
              style={{
                paddingHorizontal: '8%'
              }}>
              <InputField
                label={translate.ES.change_password_screen[0].new_pass_1}
                icon="lock-outline"
                inputType="password"
                onChangeText={value => onChange(value, 'pass1')}
                multiline={false}
                numOfLines={1}
              />
              <InputField
                label={translate.ES.change_password_screen[0].new_pass_2}
                icon="lock-reset"
                inputType="password"
                onChangeText={value => onChange(value, 'pass2')}
                multiline={false}
                numOfLines={1}
              />
              <CustomButton label={'Enviar'} onPress={() => changePassword()} />
            </View>

            <IconButton
              style={{position: 'absolute', top: 10, left: 2}}
              icon="close-circle"
              size={iconSizeFab + 10}
              onPress={() => navigation.navigate('HomeScreen')}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};
