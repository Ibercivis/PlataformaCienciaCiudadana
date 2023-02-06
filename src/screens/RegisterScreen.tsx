import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
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
import {IconButton} from 'react-native-paper';
import citmapApi from '../api/citmapApi';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import translate from '../theme/es.json';
import {CustomAlert} from '../components/CustomAlert';
import {AuthContext} from '../context/AuthContext';

const window = Dimensions.get('window');
const iconSize = window.width > 500 ? 60 : 45;
const iconSizeFab = window.width > 500 ? 50 : 20;
const height = window.width > 500 ? 80 : 50;

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {signUp, errorMessage, removeError} = useContext(AuthContext);

  const {name, email, password, password2, onChange, form} = useForm({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;
    CustomAlert().showAlertOneButton(
      'Error al registrar un nuevo usuario',
      errorMessage,
      'Ok',
      removeError,
    );
  }, [errorMessage]);

  const onRegister = async () => {
    Keyboard.dismiss();
    signUp({
      username: name,
      email: email,
      password1: password,
      password2: password2,
    });
  };

  return (
    // <View style={{flex: 1, backgroundColor: 'white'}}>
    //   <KeyboardAvoidingView
    //     style={{
    //       flex: 1,
    //     }}
    //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    //     {/* <View style={globalStyles.formContainer}>
    //       <Text style={{...globalStyles.title, alignSelf: 'center'}}>Registro</Text>
    //       <Text style={globalStyles.label}>Name:</Text>
    //       <TextInput
    //         placeholder="Ingrese su Nombre"
    //         placeholderTextColor={'#2F3061'}
    //         keyboardType="default"
    //         underlineColorAndroid={'#5C95FF'}
    //         style={[
    //           globalStyles.inputField,
    //           Platform.OS === 'ios' && globalStyles.inputFieldIOS,
    //         ]}
    //         selectionColor="white"
    //         onChangeText={value => onChange(value, 'name')}
    //         value={name}
    //         onSubmitEditing={() => console.log('')}
    //         autoCapitalize="words"
    //         autoCorrect={false}
    //       />

    //       <Text style={globalStyles.label}>Email:</Text>
    //       <TextInput
    //         placeholder="Ingrese su Email"
    //         placeholderTextColor={'#2F3061'}
    //         keyboardType="email-address"
    //         underlineColorAndroid={'#5C95FF'}
    //         style={[
    //           globalStyles.inputField,
    //           Platform.OS === 'ios' && globalStyles.inputFieldIOS,
    //         ]}
    //         selectionColor="white"
    //         onChangeText={value => onChange(value, 'email')}
    //         value={email}
    //         onSubmitEditing={() => console.log('')}
    //         autoCapitalize="none"
    //         autoCorrect={false}
    //       />

    //       <Text style={globalStyles.label}>Contraseña:</Text>
    //       <TextInput
    //         placeholder="******"
    //         placeholderTextColor={'#2F3061'}
    //         secureTextEntry={true}
    //         underlineColorAndroid={'#5C95FF'}
    //         style={[
    //           globalStyles.inputField,
    //           Platform.OS === 'ios' && globalStyles.inputFieldIOS,
    //         ]}
    //         selectionColor="white"
    //         onChangeText={value => onChange(value, 'password')}
    //         value={password}
    //         onSubmitEditing={() => console.log('')}
    //         autoCapitalize="none"
    //         autoCorrect={false}
    //       />

    //       <View style={globalStyles.buttonContainer}>
    //         <TouchableOpacity
    //           onPress={() => console.log('')}
    //           style={globalStyles.button}
    //           activeOpacity={0.6}>
    //           <Text style={globalStyles.buttonText}>Crear cuenta</Text>
    //         </TouchableOpacity>
    //       </View>

    //       <TouchableOpacity
    //         onPress={() => navigation.replace('LoginScreen')}
    //         activeOpacity={0.6}
    //         style={globalStyles.buttonReturn}>
    //         <Icon
    //         style={globalStyles.icons}
    //         name="arrow-back"
    //         size={25}
    //         color="#5C95FF"
    //       />
    //       </TouchableOpacity>
    //     </View> */}
    //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //       <View style={{marginVertical: 20}}>
    //         {/* title */}
    //         <Text
    //           style={{
    //             ...globalStyles.globalText,
    //             textAlign: 'center',
    //             fontSize: FontSize.fontSize,
    //             fontWeight: 'bold',
    //             color: '#042f66',
    //           }}>
    //           Registro
    //         </Text>
    //         <Divider
    //           bold={true}
    //           style={{
    //             marginVertical: window.height > 720 ? 40 : 10,
    //             width: '50%',
    //             borderWidth: 1,
    //             alignSelf: 'center',
    //             borderColor: 'black',
    //           }}
    //         />
    //         {/* user name and icon */}
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             width: window.width - 25,
    //             alignSelf: 'center',
    //             justifyContent: 'center',
    //           }}>
    //           <TextInput
    //             style={{
    //               ...style.textInput,
    //             }}
    //             left={
    //               <TextInput.Icon
    //                 size={iconSize}
    //                 icon="account-circle"
    //                 style={{paddingLeft: 15}}
    //               />
    //             }
    //             placeholder="Nombre"
    //             mode="flat"
    //             autoCorrect={false}
    //             autoCapitalize="none"
    //             onChangeText={value => onChange(value, 'name')}
    //             underlineColor="#B9E6FF"
    //             activeOutlineColor="#5C95FF"
    //             selectionColor="#2F3061"
    //             textColor="#2F3061"
    //             outlineColor="#5C95FF"
    //             autoFocus={false}
    //             dense={false}
    //           />
    //         </View>
    //         {/* mail and icon */}
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             width: window.width - 25,
    //             alignSelf: 'center',
    //             marginVertical: 15,
    //             justifyContent: 'center',
    //           }}>
    //           <TextInput
    //             style={{...style.textInput}}
    //             left={
    //               <TextInput.Icon
    //                 size={iconSize}
    //                 icon="email"
    //                 style={{paddingLeft: 15}}
    //               />
    //             }
    //             textContentType={'emailAddress'}
    //             placeholder="Email"
    //             mode="flat"
    //             autoCorrect={false}
    //             autoCapitalize="none"
    //             onChangeText={value => onChange(value, 'email')}
    //             underlineColor="#B9E6FF"
    //             activeOutlineColor="#5C95FF"
    //             selectionColor="#2F3061"
    //             textColor="#2F3061"
    //             outlineColor="#5C95FF"
    //             autoFocus={false}
    //             dense={true}
    //           />
    //         </View>
    //         {/* password and icon */}
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             width: window.width - 25,
    //             alignSelf: 'center',
    //             justifyContent: 'center',
    //           }}>
    //           <TextInput
    //             style={{...style.textInput}}
    //             left={
    //               <TextInput.Icon
    //                 size={iconSize}
    //                 icon="lock"
    //                 style={{paddingLeft: 15}}
    //               />
    //             }
    //             right={<TextInput.Icon onTouchStart={() => setPass(false)} onTouchEnd={() => setPass(true)} icon="eye" />}
    //             textContentType={'password'}
    //             secureTextEntry={pass}
    //             placeholder="Contraseña"
    //             mode="flat"
    //             autoCorrect={false}
    //             autoCapitalize="none"
    //             onChangeText={value => onChange(value, 'password')}
    //             underlineColor="#B9E6FF"
    //             activeOutlineColor="#5C95FF"
    //             selectionColor="#2F3061"
    //             textColor="#2F3061"
    //             outlineColor="#5C95FF"
    //             autoFocus={false}
    //             dense={true}
    //           />
    //         </View>
    //         {/* password and icon */}
    //         <View
    //           style={{
    //             flexDirection: 'row',
    //             width: window.width - 25,
    //             alignSelf: 'center',
    //             marginVertical: 15,
    //             justifyContent: 'center',
    //           }}>
    //           <TextInput
    //             style={{...style.textInput}}
    //             left={
    //               <TextInput.Icon
    //                 size={iconSize}
    //                 icon="lock"
    //                 style={{paddingLeft: 15}}
    //               />
    //             }
    //             right={<TextInput.Icon onTouchStart={() => setPassRepeat(false)} onTouchEnd={() => setPassRepeat(true)} icon="eye" />}
    //             textContentType={'password'}
    //             secureTextEntry={passRepeat}
    //             placeholder="Repetir contraseña"
    //             mode="flat"
    //             autoCorrect={false}
    //             autoCapitalize="none"
    //             onChangeText={value => onChange(value, 'password2')}
    //             underlineColor="#B9E6FF"
    //             activeOutlineColor="#5C95FF"
    //             selectionColor="#2F3061"
    //             textColor="#2F3061"
    //             outlineColor="#5C95FF"
    //             autoFocus={false}
    //             dense={true}
    //           />
    //         </View>
    //         {/* <View style={globalStyles.buttonContainer}>
    //           <TouchableOpacity
    //             onPress={() => console.log('')}
    //             style={globalStyles.button}
    //             activeOpacity={0.6}>
    //             <Text style={globalStyles.buttonText}>Crear cuenta</Text>
    //           </TouchableOpacity>
    //         </View> */}
    //         <View style={{justifyContent: 'center', marginTop: 20}}>
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
    //             mode="contained"
    //             buttonColor="#5C95FF"
    //             onPress={() => onRegister()}>
    //             Registrar
    //           </Button>
    //         </View>
    //         <IconButton
    //           style={{position: 'absolute', top: 10, left: 2}}
    //           icon="close-circle"
    //           size={iconSizeFab + 10}
    //           onPress={() => navigation.replace('LoginScreen')}
    //         />
    //       </View>
    //     </TouchableWithoutFeedback>
    //   </KeyboardAvoidingView>
    // </View>

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
              {translate.ES.register_screen[0].title}
            </Text>

            {/* mail and icon */}
            <View
              style={{
                paddingHorizontal: '8%',
              }}>
              <InputField
                label={translate.ES.register_screen[0].user_name_input}
                icon="account"
                keyboardType="email-address"
                onChangeText={value => onChange(value, 'name')}
                multiline={false}
                numOfLines={1}
              />
              <InputField
                label={translate.ES.register_screen[0].email_input}
                icon="email-outline"
                keyboardType="email-address"
                onChangeText={value => onChange(value, 'email')}
                multiline={false}
                numOfLines={1}
              />
              <InputField
                label={translate.ES.register_screen[0].password1_input}
                icon="lock-outline"
                inputType="password"
                onChangeText={value => onChange(value, 'password')}
                multiline={false}
                numOfLines={1}
              />
              <InputField
                label={translate.ES.register_screen[0].password2_input}
                icon="lock-outline"
                inputType="password"
                onChangeText={value => onChange(value, 'password2')}
                multiline={false}
                numOfLines={1}
              />
              <CustomButton label={'Registrar'} onPress={() => onRegister()} />
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
