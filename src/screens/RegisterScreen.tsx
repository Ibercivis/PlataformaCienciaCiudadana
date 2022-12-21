import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm } from '../hooks/useForm';
import { globalStyles } from '../thyme/theme';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {

  // const {signUp,errorMessage, removeError} = useContext(AuthContext);

  const {name, email, password, onChange} = useForm({
    name: '',
    email: '',
    password: '',
  });

  // useEffect(() => {
  //   if (errorMessage.length === 0) return;

  //   Alert.alert('Registro incorrecto', errorMessage, [
  //     {
  //       text: 'Ok',
  //       onPress: () => removeError(),
  //     },
  //   ]);
  // }, [errorMessage]);


  // const onRegister = () => {
  //   signUp({
  //     nombre: name,
  //     password: password,
  //     correo: email
  //   });
  //   Keyboard.dismiss();
  // };

  return (
    <View style={{flex: 1, backgroundColor: '#E5FCFF'}}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={globalStyles.formContainer}>
          <Text style={globalStyles.title}>Registro</Text>
          <Text style={globalStyles.label}>Name:</Text>
          <TextInput
            placeholder="Ingrese su Nombre"
            placeholderTextColor={'#2F3061'}
            keyboardType="default"
            underlineColorAndroid={'#5C95FF'}
            style={[
              globalStyles.inputField,
              Platform.OS === 'ios' && globalStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={() => console.log('')}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <Text style={globalStyles.label}>Email:</Text>
          <TextInput
            placeholder="Ingrese su Email"
            placeholderTextColor={'#2F3061'}
            keyboardType="email-address"
            underlineColorAndroid={'#5C95FF'}
            style={[
              globalStyles.inputField,
              Platform.OS === 'ios' && globalStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={() => console.log('')}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={globalStyles.label}>Contraseña:</Text>
          <TextInput
            placeholder="******"
            placeholderTextColor={'#2F3061'}
            secureTextEntry={true}
            underlineColorAndroid={'#5C95FF'}
            style={[
              globalStyles.inputField,
              Platform.OS === 'ios' && globalStyles.inputFieldIOS,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={() => console.log('')}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={globalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => console.log('')}
              style={globalStyles.button}
              activeOpacity={0.6}>
              <Text style={globalStyles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            activeOpacity={0.6}
            style={globalStyles.buttonReturn}>
            <Icon
            style={globalStyles.icons}
            name="arrow-back"
            size={25}
            color="#5C95FF"
          />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
