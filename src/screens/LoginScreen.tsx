import {StackScreenProps} from '@react-navigation/stack';
import {LoginComponent} from '../components/screen_components/LoginComponent';
import {LoginTemplate} from '../components/screen_components/Authentication/LoginTemplate';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Size} from '../theme/size';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useState, useContext, useRef, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {AuthContext} from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {LoadingScreen} from './LoadingScreen';
import Wave from 'react-native-waveview';
import {FontFamily, FontSize} from '../theme/fonts';
import translate from '../theme/es.json';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {InputText} from '../components/utility/InputText';
import {Divider, HelperText} from 'react-native-paper';
import {Colors} from '../theme/colors';
import {CustomButton} from '../components/utility/CustomButton';
import {CustomButtonOutline} from '../components/utility/CustomButtonOutline';
import {GeometryForms} from '../components/utility/GeometryForms';
import {ForgotPasswordTemplate} from '../components/screen_components/Authentication/ForgotPasswordTemplate';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation, route}: Props) => {
  //#region VARIABLES

  /** COMÚN */
  const [nameScreen, setNameScreen] = useState('register');
  const {signIn, signOut, signUp, errorMessage, removeError} =
    useContext(AuthContext);

  //#region LOGIN VARIABLES
  const {fontScale} = useWindowDimensions();
  // si hay errores, el scroll se habilitará para que los elementos puedan ser visualizados
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const {top} = useSafeAreaInsets();
  const {onChange, form} = useForm({
    userName: '',
    password: '',
  });
  //#endregion

  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);

  //#region COMUNES
  const [onTouchBorderWidth, setOnTouchBorderWidth] = useState(0);
  const [onTouchBorderWidth2, setOnTouchBorderWidth2] = useState(0);
  const [onTouchBorderWidth3, setOnTouchBorderWidth3] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  const transitionSpinValue = useRef(new Animated.Value(0)).current;
  const horizontalAnimation = useRef(new Animated.Value(0)).current;
  const [marginHorizontal, setMarginHorizontal] = useState(-28); //-28 el estable
  //#endregion

  //#region REGISTER VARIABLES

  const {
    username,
    email,
    password1,
    password2,
    onChange: onChangeRegister,
    form: formRegister,
  } = useForm({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  //#endregion

  //#endregion

  //#region USE EFFECTS
  /**
   * Termina la pantalla de carga
   */
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    // if (onTouchBorderWidth > 0) {
    setTimeout(() => {
      // navigation.replace('ForgotPassword');
      // setNameScreen('register')
      setOnTouchBorderWidth(0);
      setOnTouchBorderWidth2(0);
      setOnTouchBorderWidth3(0);
    }, 160);
    // }
  }, [onTouchBorderWidth, onTouchBorderWidth2, onTouchBorderWidth3]);

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

  //#endregion

  //#region METHODS/LOGIN

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

  //#endregion

  //#region METHODS/REGISTER
  const onRegister = async () => {
    Keyboard.dismiss();
    signUp({
      username: username,
      email: email,
      password1: password1,
      password2: password2,
    });
  };
  //#endregion

  //#region METHODS/ANIMATED-TIMMING
  const onTouchForgetPass = () => {
    setOnTouchBorderWidth(1.5);
    setTimeout(() => {
      // navigation.replace('ForgotPassword');
      setNameScreen('forgot');
    }, 160);
    // setIsAnimated(true);
    Animated.timing(spinValue, {
      toValue: 10,
      duration: 850,
      useNativeDriver: true,
    }).start();
    Animated.timing(transitionSpinValue, {
      toValue: 10,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  };

  const onTouchRegister = () => {
    setOnTouchBorderWidth2(1.5);
    setTimeout(() => {
      // navigation.replace('ForgotPassword');
      setNameScreen('register');
    }, 160);
    Animated.timing(spinValue, {
      toValue: 10,
      duration: 850,
      useNativeDriver: true,
    }).start();
    Animated.timing(transitionSpinValue, {
      toValue: 10,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  };

  const onTouchLogin = () => {
    setOnTouchBorderWidth3(1.5);
    setTimeout(() => {
      // setNameScreen('login');
    }, 160);
    Animated.timing(spinValue, {
      toValue: 0,
      duration: 850,
      useNativeDriver: true,
    }).start();
    Animated.timing(transitionSpinValue, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  };

  //#endregion

  if (isLoading) {
    return <LoadingScreen />;
  }

  const screen = () => {
    switch (nameScreen) {
      case 'login':
        return (
          <>
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
                  {translate.strings.new_project_screen[0].project_name_helper}
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
                  {translate.strings.new_project_screen[0].project_name_helper}
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
                onPress={() =>
                  // navigation.replace('RegisterScreen')
                  onTouchRegister()
                }
              />
            </View>
          </>
        );
      case 'register':
        return (
          <>
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
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {/* primero si se ve o si no ( si el usuario ha pinchado en el input ) y luego si está bien o mal  */}
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  label={translate.strings.register_screen[0].user_name_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}

              {/* email */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  label={translate.strings.register_screen[0].email_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => console.log(value)}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
              {/* password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
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
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
              {/*confirm password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
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
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
            </View>

            {/* register button */}
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

            {/* back */}
            <View style={{marginHorizontal: '26%', marginTop: '1%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: onTouchBorderWidth2,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchLogin()}
                onFocus={() => setOnTouchBorderWidth2(0)}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontSize: FontSize.fontSizeText13 / fontScale,
                  }}>
                  {translate.strings.register_screen[0].have_account}
                </Text>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13 / fontScale,
                  }}>
                  {translate.strings.register_screen[0].enter}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 'forgot':
        return (
          <>
            {/* info */}
            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: '7%',
                marginBottom: '8%',
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.NotoSansDisplayMedium,
                  fontSize: FontSize.fontSizeText18 / fontScale,
                  color: 'black',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  marginBottom: '1%',
                }}>
                {translate.strings.recovery_screen[0].title_info}
              </Text>
              <Text
                style={{
                  fontFamily: FontFamily.NotoSansDisplayLight,
                  fontSize: FontSize.fontSizeText14 / fontScale,
                  color: 'black',
                  marginHorizontal: '13%',
                  marginTop: '7%',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}>
                {translate.strings.recovery_screen[0].content_info}
              </Text>
            </View>
            <View>
              {/* email */}
              <InputText
                // isInputText={() => setIsInputText(!isInputText)}
                label={translate.strings.login_screen[0].mail_input}
                keyboardType="email-address"
                multiline={false}
                numOfLines={1}
                onChangeText={value => console.log()}
              />
            </View>
            {true ? (
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
                {translate.strings.new_project_screen[0].project_name_helper}
              </HelperText>
            ) : (
              <></>
            )}
            <View
              style={{
                marginBottom: '15.5%',
              }}>
              <CustomButton
                backgroundColor={Colors.secondaryDark}
                label={translate.strings.recovery_screen[0].send_email}
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
                // marginTop: '10%',
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
            {/* button create */}
            <View
              style={{
                marginHorizontal: '26%',
                marginTop: '13%',
                marginBottom: '10%',
              }}>
              <CustomButton
                backgroundColor={Colors.primaryDark}
                fontFamily={FontFamily.NotoSansDisplayRegular}
                label={translate.strings.recovery_screen[0].create_account}
                onPress={() => navigation.replace('LoginScreen')}
              />
            </View>

            {/* back */}
            <View style={{marginHorizontal: '26%', marginBottom: '10%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: onTouchBorderWidth3,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchLogin()}
                onFocus={() => setOnTouchBorderWidth3(0)}>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.recovery_screen[0].back}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.recovery_screen[0].session}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return <h1>No project match</h1>;
    }
  };

  const screenHorizontal = () => {
    switch (nameScreen) {
      case 'register':
        return (
          <View style={{marginHorizontal: '9%', left: '0.7%'}}>
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
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {/* primero si se ve o si no ( si el usuario ha pinchado en el input ) y luego si está bien o mal  */}
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  label={translate.strings.register_screen[0].user_name_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChangeRegister(value, 'username')}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}

              {/* email */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  label={translate.strings.register_screen[0].email_input}
                  keyboardType="email-address"
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChangeRegister(value, 'email')}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
              {/* password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].password1_input}
                  inputType={true}
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChangeRegister(value, 'password1')}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
              {/*confirm password */}
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    left: '-5%',
                    top: '50%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  {false ? (
                    <GeometryForms
                      name="circle-fill"
                      size={Size.iconSizeExtraMin}
                      color={Colors.semanticSuccessLight}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <InputText
                  // isInputText={() => setIsInputText(!isInputText)}
                  label={translate.strings.register_screen[0].password2_input}
                  inputType={true}
                  multiline={false}
                  numOfLines={1}
                  onChangeText={value => onChangeRegister(value, 'password2')}
                />
              </View>
              {false ? (
                <HelperText
                  type="error"
                  visible={true}
                  style={{
                    fontSize: FontSize.fontSizeText13 / fontScale,
                    fontFamily: FontFamily.NotoSansDisplayLight,
                    color: Colors.semanticWarningDark,
                    right: '3%',
                    fontWeight: '600',
                  }}>
                  {translate.strings.new_project_screen[0].project_name_helper}
                </HelperText>
              ) : (
                <></>
              )}
            </View>

            {/* register button */}
            <CustomButton
              backgroundColor={Colors.secondaryDark}
              label={translate.strings.register_screen[0].title}
              onPress={() => onRegister()}
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

            {/* back */}
            <View style={{marginHorizontal: '26%', marginTop: '1%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: onTouchBorderWidth2,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchLogin()}
                onFocus={() => setOnTouchBorderWidth2(0)}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontSize: FontSize.fontSizeText13 / fontScale,
                  }}>
                  {translate.strings.register_screen[0].have_account}
                </Text>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13 / fontScale,
                  }}>
                  {translate.strings.register_screen[0].enter}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'forgot':
        return (
          <View style={{marginHorizontal: '9%', left: '0.7%'}}>
            {/* info */}
            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: '7%',
                marginBottom: '8%',
              }}>
              <Text
                style={{
                  fontFamily: FontFamily.NotoSansDisplayMedium,
                  fontSize: FontSize.fontSizeText18 / fontScale,
                  color: 'black',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                  marginBottom: '1%',
                }}>
                {translate.strings.recovery_screen[0].title_info}
              </Text>
              <Text
                style={{
                  fontFamily: FontFamily.NotoSansDisplayLight,
                  fontSize: FontSize.fontSizeText14 / fontScale,
                  color: 'black',
                  marginHorizontal: '13%',
                  marginTop: '7%',
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}>
                {translate.strings.recovery_screen[0].content_info}
              </Text>
            </View>
            <View>
              {/* email */}
              <InputText
                // isInputText={() => setIsInputText(!isInputText)}
                label={translate.strings.login_screen[0].mail_input}
                keyboardType="email-address"
                multiline={false}
                numOfLines={1}
                onChangeText={value => console.log()}
              />
            </View>
            {true ? (
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
                {translate.strings.new_project_screen[0].project_name_helper}
              </HelperText>
            ) : (
              <></>
            )}
            <View
              style={{
                marginBottom: '15.5%',
              }}>
              <CustomButton
                backgroundColor={Colors.secondaryDark}
                label={translate.strings.recovery_screen[0].send_email}
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
                // marginTop: '10%',
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
            {/* button create */}
            <View
              style={{
                marginHorizontal: '26%',
                marginTop: '13%',
                marginBottom: '10%',
              }}>
              <CustomButton
                backgroundColor={Colors.primaryDark}
                fontFamily={FontFamily.NotoSansDisplayRegular}
                label={translate.strings.recovery_screen[0].create_account}
                onPress={() => navigation.replace('LoginScreen')}
              />
            </View>

            {/* back */}
            <View style={{marginHorizontal: '26%', marginBottom: '10%'}}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderBottomWidth: onTouchBorderWidth3,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchLogin()}
                onFocus={() => setOnTouchBorderWidth3(0)}>
                <Text
                  style={{
                    color: Colors.primaryLigth,
                    fontWeight: '600',
                    fontFamily: FontFamily.NotoSansDisplaySemiBold,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.recovery_screen[0].back}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: FontFamily.NotoSansDisplayRegular,
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {translate.strings.recovery_screen[0].session}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return <h1>No project match</h1>;
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView style={styles.parent}>
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
                source={require('../assets/backgrounds/Portada.png')}
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
              <Animated.View
                style={{
                  flex: 1,
                  marginVertical: 0,
                  marginHorizontal: RFPercentage(marginHorizontal), //-88
                  backgroundColor: 'transparent',
                  transform: [
                    {
                      translateX: spinValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, RFPercentage(-5.3)],
                      }),
                    },
                  ],
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
                {/* aquí va el contenido */}
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    transform: [
                      {
                        translateX: transitionSpinValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, RFPercentage(-5.3)],
                        }),
                      },
                    ],
                  }}>
                  <View style={{marginHorizontal: '9%'}}>
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
                        label={
                          translate.strings.login_screen[0].loggin_microsoft
                        }
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
                        onPress={() =>
                          // navigation.replace('RegisterScreen')
                          onTouchRegister()
                        }
                      />
                    </View>
                  </View>
                  {/* <View style={{width: '25.4%', backgroundColor: 'blue'}}></View> */}
                  {screenHorizontal()}
                </Animated.View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
      {/* <LoginTemplate navigation={navigation} route={route} /> */}
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
    // marginHorizontal: '9%',
    marginTop: '5%',
    marginBottom: '17%',
    right: '1.7%',
  },
  loginButtonsContainer: {
    marginHorizontal: '17%',
    marginTop: '10%',
    marginBottom: '10%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '28%',
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
