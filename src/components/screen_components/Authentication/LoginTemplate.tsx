import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  useWindowDimensions,
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
import {Divider, HelperText} from 'react-native-paper';
import {Size} from '../../../theme/size';
import {Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useForm} from '../../../hooks/useForm';
import {AuthContext} from '../../../context/AuthContext';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoadingScreen} from '../../../screens/LoadingScreen';
import Wave from 'react-native-waveview';
import {RFPercentage} from 'react-native-responsive-fontsize';

interface Props extends StackScreenProps<any, any> {}

export const LoginTemplate = ({navigation}: Props) => {
  const {fontScale} = useWindowDimensions();
  // si hay errores, el scroll se habilitará para que los elementos puedan ser visualizados
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const {top} = useSafeAreaInsets();
  const {signIn, signOut, signUp, errorMessage, removeError} =
    useContext(AuthContext);
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  /**
   * Variable para saber el estado del teclado
   */
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [onTouchBorderWidth, setOnTouchBorderWidth] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;

  const [marginHorizontal, setMarginHorizontal] = useState(-28); //-28 el estable

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

  useEffect(() => {
    if (isAnimated) {
      setTimeout(() => {
        navigation.replace('ForgotPassword');
      }, 160);
    }
  }, [isAnimated]);

  useEffect(() => {
    console.log(marginHorizontal);
  }, [marginHorizontal]);

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
    setUserError(true);
    console.log(errorMessage);
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

  const showHideKeyboard = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    }
  };

  const onTouchForgetPass = () => {
    setOnTouchBorderWidth(1.5);

    setIsAnimated(true);
    Animated.timing(spinValue, {
      toValue: 10,
      duration: 850,
      useNativeDriver: true,
    }).start();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        style={styles.parent}
        onPointerLeave={() => showHideKeyboard()}>
        {/* contenedor de formas geometricas y titulo */}
        <SafeAreaView style={styles.child1}>
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
                  fontSize: FontSize.fontSizeText18 / fontScale,
                  color: 'white',
                }}>
                {translate.strings.login_screen[0].subtitle}
              </Text>
            </View>

            {/* <WaveBackground isAnimated={isAnimated} /> */}
            <Animated.View
              style={{
                flex: 1,
                marginVertical: 0,
                marginHorizontal: RFPercentage(marginHorizontal), //-88
                backgroundColor: 'transparent',
                transform: [{translateX: spinValue.interpolate({
                  inputRange:[0,1],
                  outputRange:[0,-50]
                })}],
              }}>
              <Wave
                style={{flex: 1}}
                H={RFPercentage(6)}
                waveParams={[
                  {A: RFPercentage(9), T: RFPercentage(60), fill: '#FFF'},
                ]}
                animated={false}
              />
            </Animated.View>
          </View>
        </SafeAreaView>

        <ScrollView
          scrollEnabled={scrollEnabled}
          disableScrollViewPanResponder={true}
          showsVerticalScrollIndicator={false}>
          {/* contenedor de los elementos  */}
          <View style={styles.child2}>
            <View style={styles.inputsContainer}>
              {/* inputs */}
              <View>
                {/* email */}
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.login_screen[0].mail_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChange(value, 'userName')}
                />
                {false ? (
                  <HelperText
                    type="error"
                    visible={true}
                    style={{
                      fontSize: FontSize.fontSizeText13,
                      fontFamily: FontFamily.NotoSansDisplayLight,
                      color: Colors.semanticWarningDark,
                      right: '3%',
                      fontWeight: '600',
                    }}>
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
                  </HelperText>
                ) : (
                  <></>
                )}
                {/* password */}
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.login_screen[0].password_input}
                  inputType={true}
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChange(value, 'password')}
                />
                {false ? (
                  <HelperText
                    type="error"
                    visible={true}
                    style={{
                      fontSize: FontSize.fontSizeText13,
                      fontFamily: FontFamily.NotoSansDisplayLight,
                      color: Colors.semanticWarningDark,
                      right: '3%',
                      fontWeight: '600',
                    }}>
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
                  </HelperText>
                ) : (
                  <></>
                )}
              </View>

              <CustomButton
                backgroundColor={Colors.secondaryDark}
                label={translate.strings.login_screen[0].login_button}
                onPress={() => loggin()}
              />

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'flex-end',
                  marginTop: '5%',
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
                    fontSize: FontSize.fontSizeText13 / fontScale,
                  }}>
                  {translate.strings.login_screen[0].recovery_password}
                </Text>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13 / fontScale,
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
                  onPress={() => logginGoogle()}
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
              <View
                style={{
                  marginHorizontal: '26%',
                  marginTop: '14%',
                  marginBottom: '10%',
                }}>
                <CustomButton
                  backgroundColor={Colors.primaryDark}
                  fontFamily={FontFamily.NotoSansDisplayRegular}
                  label={translate.strings.login_screen[0].register}
                  onPress={() => navigation.replace('RegisterScreen')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
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
    marginBottom: '17%',
  },
  loginButtonsContainer: {
    marginHorizontal: '17%',
    marginTop: '10%',
    marginBottom: '10%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '30%',
  },
  child1: {
    height: '28%',
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
