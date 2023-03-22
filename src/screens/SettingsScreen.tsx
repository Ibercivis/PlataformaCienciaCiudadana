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
import {HelperText, IconButton} from 'react-native-paper';
import {CustomAlert} from '../components/CustomAlert';
import {CustomButton} from '../components/CustomButton';
import {InputField} from '../components/InputField';
import {AuthContext} from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {Colors} from '../theme/colors';
import {FontSize} from '../theme/fonts';
import translate from '../theme/es.json';
import {Size} from '../theme/size';
import {globalStyles} from '../theme/theme';
import {HeaderComponent} from '../components/HeaderComponent';
import { ScrollView } from 'react-native';

const window = Dimensions.get('window');
const iconSize = window.width > 500 ? 60 : 45;
const iconSizeFab = window.width > 500 ? 50 : 20;
const height = window.width > 500 ? 80 : 50;

interface Props extends StackScreenProps<any, any> {}

export const SettingsScreen = ({navigation}: Props) => {
  const {message, removeError, errorMessage, changePass} =
    useContext(AuthContext);
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
      () => console.log(),
    );
  }, [errorMessage]);

  useEffect(() => {
    if (message.length === 0) return;
    CustomAlert().showAlertOneButton(
      translate.strings.settings_screen[0].change_password_screen[0].modal_message,
      message,
      'Ok',
      () => okAlert(),
      // removeError,
      () => navigation.navigate('HomeScreen'),
    );
  }, [message]);

  const okAlert = () => {
    removeError();
    navigation.navigate('HomeScreen');
  };

  const changePassword = () => {
    Keyboard.dismiss();
    changePass(pass1, pass2);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderComponent
        title={translate.strings.settings_screen[0].title}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log()}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{...styles.container}}>
            {/* mail and icon */}

            <View>
              <View>
                <Text style={styles.title}>
                  {
                    translate.strings.settings_screen[0].change_password_screen[0].title
                  }
                </Text>
              </View>

              {/* contact name input */}
              <View style={{marginBottom: '8%'}}>
                <InputField
                  label={translate.strings.settings_screen[0].change_password_screen[0].new_pass_1}
                  icon="lock-outline"
                  inputType="password"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChange(value, 'pass1')}
                  iconColor={Colors.lightorange}
                  marginBottom={'2%'}
                />
                <HelperText
                  type="info"
                  visible={true}
                  style={styles.helperText}>
                  {
                    translate.strings.settings_screen[0].change_password_screen[0].new_pass_1_helper
                  }
                </HelperText>
              </View>

              {/* contact mail input */}
              <View style={{marginBottom: '8%'}}>
                <InputField
                  label={translate.strings.settings_screen[0].change_password_screen[0].new_pass_2}
                  icon="lock-reset"
                  inputType="password"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChange(value, 'pass2')}
                  iconColor={Colors.lightorange}
                  marginBottom={'2%'}
                />
                <HelperText
                  type="info"
                  visible={true}
                  style={styles.helperText}>
                  {
                    translate.strings.settings_screen[0].change_password_screen[0].new_pass_2_helper
                  }
                </HelperText>
              </View>
            </View>

            {/* <View
              style={{
                paddingHorizontal: '8%',
              }}>
              <InputField
                label={translate.strings.change_password_screen[0].new_pass_1}
                icon="lock-outline"
                inputType="password"
                onChangeText={value => onChange(value, 'pass1')}
                multiline={false}
                numOfLines={1}
              />
              <InputField
                label={translate.strings.change_password_screen[0].new_pass_2}
                icon="lock-reset"
                inputType="password"
                onChangeText={value => onChange(value, 'pass2')}
                multiline={false}
                numOfLines={1}
              />
              <CustomButton label={'Enviar'} onPress={() => changePassword()} />
            </View> */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* <IconButton
        style={globalStyles.viewButtonBack}
        icon="arrow-left"
        size={Size.iconSizeMedium}
        onPress={() => navigation.navigate('HomeScreen')}
      /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: '2%',
    marginHorizontal: '6%',
  },
  title: {
    fontSize: FontSize.fontSizeTextSubTitle,
    paddingVertical: FontSize.fontSizeText,
    alignItems: 'baseline',
    marginTop: '2%',
    marginBottom: '3%',
  },
  helperText: {
    fontSize: FontSize.fontSizeTextMin,
  },
  divider: {
    borderColor: 'black',
    borderWidth: 1,
    marginTop: '5%',
    marginBottom: '3%',
  },
});
