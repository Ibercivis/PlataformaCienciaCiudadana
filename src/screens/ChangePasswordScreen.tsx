import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
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
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import {globalStyles} from '../theme/theme';

const window = Dimensions.get('window');
const iconSize = window.width > 500 ? 60 : 45;
const iconSizeFab = window.width > 500 ? 50 : 20;
const height = window.width > 500 ? 80 : 50;

interface Props extends StackScreenProps<any, any> {}

export const ChangePasswordScreen = ({navigation}: Props) => {
  const {email, onChange} = useForm({
    email: '',
  });

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
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  ...globalStyles.globalText,
                  textAlign: 'center',
                  fontSize: FontSize.fontSize,
                  fontWeight: 'bold',
                  color: '#042f66',
                  width: '60%',
                }}>
                Cambiar contraseña
              </Text>
            </View>

            <Divider
              bold={true}
              style={{
                marginVertical: window.height > 720 ? 40 : 10,
                width: '50%',
                borderWidth: 1,
                alignSelf: 'center',
                borderColor: 'black',
              }}
            />
            {/* pass and icon */}
            <View
              style={{
                flexDirection: 'row',
                width: window.width - 25,
                alignSelf: 'center',
                marginVertical: 15,
                justifyContent: 'center',
              }}>
              <TextInput
                style={{...style.textInput}}
                left={
                  <TextInput.Icon
                    size={iconSize}
                    icon="email"
                    style={{paddingLeft: 15}}
                  />
                }
                textContentType={'newPassword'}
                secureTextEntry={true}
                placeholder="New Password"
                mode="flat"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'email')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                autoFocus={false}
                dense={true}
              />
            </View>
            {/* pass and icon */}
            <View
              style={{
                flexDirection: 'row',
                width: window.width - 25,
                alignSelf: 'center',
                marginVertical: 15,
                justifyContent: 'center',
              }}>
              <TextInput
                style={{...style.textInput}}
                left={
                  <TextInput.Icon
                    size={iconSize}
                    icon="email"
                    style={{paddingLeft: 15}}
                  />
                }
                textContentType={'newPassword'}
                secureTextEntry={true}
                placeholder="Repeat new Password"
                mode="flat"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={value => onChange(value, 'email')}
                underlineColor="#B9E6FF"
                activeOutlineColor="#5C95FF"
                selectionColor="#2F3061"
                textColor="#2F3061"
                outlineColor="#5C95FF"
                autoFocus={false}
                dense={true}
              />
            </View>
            <View style={{justifyContent: 'center', marginTop: 20}}>
              <Button
                style={{
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
                mode="contained"
                buttonColor="#5C95FF"
                onPress={() => console.log('')}>
                Enviar
              </Button>
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
