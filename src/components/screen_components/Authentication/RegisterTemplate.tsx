import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
import {Divider, HelperText} from 'react-native-paper';
import {Size} from '../../../theme/size';
import {Keyboard} from 'react-native';
import {GeometryForms} from '../../utility/GeometryForms';

interface Props extends StackScreenProps<any, any> {}

export const RegisterTemplate = ({navigation}: Props) => {
  const {fontScale} = useWindowDimensions();
  /**
   * Variable para saber el estado del teclado
   */
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [onTouchBorderWidth, setOnTouchBorderWidth] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true);
  /**
   * Termina la pantalla de carga
   */
  useEffect(() => {
    SplashScreen.hide(); 
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(false)
    }, 160);
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
  const onTouchEnter = () => {
    setOnTouchBorderWidth(1.5);
    setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 160);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
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

            <WaveBackground isAnimated={isAnimated} />
          </View>
        </View>

        <ScrollView
          scrollEnabled={scrollEnabled}
          disableScrollViewPanResponder={true}
          showsVerticalScrollIndicator={false}>
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
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
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
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
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
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
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
                    {
                      translate.strings.new_project_screen[0]
                        .project_name_helper
                    }
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
                  label={
                    translate.strings.register_screen[0].register_microsoft
                  }
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
                    borderBottomWidth: onTouchBorderWidth,
                    borderBottomColor: Colors.primaryLigth,
                  }}
                  onPress={() => onTouchEnter()}
                  onFocus={() => setOnTouchBorderWidth(0)}>
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
