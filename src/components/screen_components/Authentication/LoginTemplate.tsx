import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {InputText} from '../../utility/InputText';
import translate from '../../../theme/es.json';
import {CustomButton} from '../../utility/CustomButton';
import WaveBackground from '../../utility/WeaveBackground';
import {FontFamily, FontSize, FontWeight} from '../../../theme/fonts';
import {Colors} from '../../../theme/colors';
import {StackScreenProps} from '@react-navigation/stack';
import {CustomButtonOutline} from '../../utility/CustomButtonOutline';
import {Divider} from 'react-native-paper';
import {Size} from '../../../theme/size';
import {Keyboard} from 'react-native';

interface Props extends StackScreenProps<any, any> {}

export const LoginTemplate = ({navigation}: Props) => {
  /**
   * Variable para saber el estado del teclado
   */
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [onTouchBorderWidth, setOnTouchBorderWidth] = useState(0);

  /**
   * Termina la pantalla de carga
   */
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  /**
   * Determina el estado del teclado
   */
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const showHideKeyboard = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    }
  };
  const onTouchForgetPass = ()=> {
    setOnTouchBorderWidth(1.5)
    setTimeout(() => {
      navigation.replace('ForgotPassword')
      
  }, 160);
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.parent}
        onPointerLeave={() => showHideKeyboard()}>
        {/* contenedor de formas geometricas y titulo */}
        <SafeAreaView style={styles.child1}>
          <View style={{position: 'absolute', zIndex: 999, bottom: -5, backgroundColor: 'white',}}>
            <Image
              style={styles.titleImage}
              source={require('../../../assets/backgrounds/Portada.png')}
            />
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                bottom: '30%',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.NotoSansDisplayMedium,
                  fontSize: FontSize.fontSizeTextSubTitle,
                  color: 'white',
                }}>
                {translate.strings.login_screen[0].subtitle}
              </Text>
            </View>

            <WaveBackground />
          </View>
        </SafeAreaView>

        {/* <ScrollView disableScrollViewPanResponder={false}> */}
        {/* contenedor de los elementos  */}
        <View style={styles.child2}>
          <View style={styles.inputsContainer}>
            <View onTouchCancel={() => console.log('he presionao fuera')}>
            {/* email */}
              <InputText
              // isInputText={() => setIsInputText(!isInputText)}
              label={translate.strings.login_screen[0].mail_input}
              keyboardType="email-address"
              multiline={false}
              numOfLines={1}
              onChangeText={value => console.log(value)}
            />
            {/* password */}
            <InputText
              // isInputText={() => setIsInputText(!isInputText)}
              label={translate.strings.login_screen[0].password_input}
              inputType={true}
              multiline={false}
              numOfLines={1}
              onChangeText={value => console.log(value)}
            />
            </View>
            
            <CustomButton
              backgroundColor={Colors.secondaryDark}
              label={translate.strings.login_screen[0].login_button}
              onPress={() => console.log()}
            />

            <TouchableOpacity
              activeOpacity={1}
              style={{
                alignSelf: 'flex-end',
                marginTop: '5%',
                flexDirection: 'row',
                borderBottomWidth: onTouchBorderWidth,
                borderBottomColor: Colors.primaryLigth
              }}
              onPress={() => onTouchForgetPass()}
              onFocus={() => setOnTouchBorderWidth(0)}
            >
              <Text
                style={{
                  color: 'black',
                  fontWeight: '400',
                  fontFamily: FontFamily.NotoSansDisplayRegular,
                  fontSize: FontSize.fontSizeText13,
                }}>
                {translate.strings.login_screen[0].recovery_password}
              </Text>
              <Text
                style={{
                  color: Colors.primaryLigth,
                  fontWeight: '600',
                  fontFamily: FontFamily.NotoSansDisplaySemiBold,
                  fontSize: FontSize.fontSizeText13,
                }}>
                {'contraseña?'}
              </Text>
            </TouchableOpacity>

            {/* loggin buttons */}
            <View style={styles.loginButtonsContainer}>
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="google"
                label={translate.strings.login_screen[0].loggin_google}
                onPress={() => console.log()}
              />
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="apple"
                label={translate.strings.login_screen[0].loggin_apple}
                onPress={() => console.log()}
              />
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="microsoft"
                label={translate.strings.login_screen[0].loggin_microsoft}
                onPress={() => console.log()}
              />
            </View>

            {/* divider */}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Divider style={{borderWidth: 0.6, width: '45%'}} />
              <Text
                style={{
                  alignItems: 'center',
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                o
              </Text>
              <Divider style={{borderWidth: 0.6, width: '45%'}} />
            </View>
            <View style={{marginHorizontal: '26%', marginTop: '14%'}}>
              <CustomButton
                backgroundColor={Colors.primaryDark}
                fontFamily={FontFamily.NotoSansDisplayRegular}
                label={translate.strings.login_screen[0].register}
                onPress={() => navigation.replace('RegisterScreen')}
              />
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputsContainer: {
    height: '100%',
    backgroundColor: 'white',
    marginHorizontal: 46,
    marginTop: '5%',
    marginBottom: 73,
  },
  loginButtonsContainer: {
    marginHorizontal: '17%',
    marginTop: '13%',
    marginBottom: '16%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  child1: {
    height: '30%',
    backgroundColor: 'white',
  },
  child2: {
    height: '70%',
    backgroundColor: 'white',
  },
  titleImage: {
    alignSelf: 'center',
    height: Size.globalHeight / 2.6,
    width: Size.globalWidth,
    left: 0,
    bottom: 4,
  },
});
