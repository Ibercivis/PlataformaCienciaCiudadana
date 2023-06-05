import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {InputText} from '../../utility/InputText';
import translate from '../../../theme/es.json';
import {CustomButton} from '../../utility/CustomButton';
import WaveBackground from '../../utility/WeaveBackground';
import {FontFamily, FontSize} from '../../../theme/fonts';
import {Colors} from '../../../theme/colors';
import {StackScreenProps} from '@react-navigation/stack';
import {CustomButtonOutline} from '../../utility/CustomButtonOutline';
import {Divider} from 'react-native-paper';
import {Size} from '../../../theme/size';
import {Keyboard} from 'react-native';
import {IconBootstrap} from '../../utility/IconBootstrap';

interface Props extends StackScreenProps<any, any> {}

export const RegisterTemplate = ({navigation}: Props) => {
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
  const onTouchForgetPass = () => {
    setOnTouchBorderWidth(1.5);
    setTimeout(() => {
      navigation.replace('ForgotPassword');
    }, 160);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.parent}
        onPointerLeave={() => showHideKeyboard()}>
        {/* contenedor de formas geometricas y titulo */}
        <View style={styles.child1}>
          <View
            style={{
              position: 'absolute',
              zIndex: 999,
              bottom: -5,
              backgroundColor: 'white',
            }}>
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
                {translate.strings.register_screen[0].subtitle}
              </Text>
            </View>

            <WaveBackground />
          </View>
        </View>

        {/* <ScrollView disableScrollViewPanResponder={false}> */}
        {/* contenedor de los elementos  */}
        <View style={styles.child2}>
          <View style={styles.inputsContainer}>
            {/* contenedor de los inputs */}
            <View
              style={{
                width: '100%',
                height: 'auto',
                alignSelf: 'center',
                // backgroundColor: 'green',
              }}>
              {/* name */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View style={{left: '-6%', top:'40.4%', alignSelf:'center',justifyContent:'center', position: 'absolute'}}>
                  <IconBootstrap
                    name="circle-fill"
                    size={Size.iconSizeMin}
                    color={Colors.semanticSuccessLight}
                  />
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].user_name_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
              {/* email */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View style={{left: '-6%', top:'40.4%', alignSelf:'center',justifyContent:'center', position: 'absolute'}}>
                  <IconBootstrap
                    name="circle-fill"
                    size={Size.iconSizeMin}
                    color={'orange'}
                  />
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].email_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
              {/* password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View style={{left: '-6%', top:'40.4%', alignSelf:'center',justifyContent:'center', position: 'absolute'}}>
                  <IconBootstrap
                    name="circle-fill"
                    size={Size.iconSizeMin}
                    color={'orange'}
                  />
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].password1_input}
                  inputType={true}
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
              {/*confirm password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View style={{left: '-6%', top:'40.4%', alignSelf:'center',justifyContent:'center', position: 'absolute'}}>
                  <IconBootstrap
                    name="circle-fill"
                    size={Size.iconSizeMin}
                    color={'orange'}
                  />
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].password2_input}
                  inputType={true}
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
            </View>

            <CustomButton
              backgroundColor={Colors.secondaryDark}
              label={translate.strings.register_screen[0].title}
              onPress={() => console.log()}
            />
            {/* divider */}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10%',
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
            {/* loggin buttons */}
            <View style={styles.loginButtonsContainer}>
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="google"
                label={translate.strings.register_screen[0].register_google}
                onPress={() => console.log()}
              />
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="apple"
                label={translate.strings.register_screen[0].register_apple}
                onPress={() => console.log()}
              />
              <CustomButtonOutline
                backgroundColor="white"
                fontColor="black"
                iconLeft="microsoft"
                label={translate.strings.register_screen[0].register_microsoft}
                onPress={() => console.log()}
              />
            </View>

            <View style={{marginHorizontal: '26%', marginTop: '1%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: onTouchBorderWidth,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchForgetPass()}
                onFocus={() => setOnTouchBorderWidth(0)}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.register_screen[0].have_account}
                </Text>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.register_screen[0].enter}
                </Text>
              </TouchableOpacity>
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
