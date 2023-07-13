import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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

interface Props extends StackScreenProps<any, any> {}

export const ForgotPasswordTemplate = ({navigation}: Props) => {
  const {fontScale} = useWindowDimensions();
  const [onTouchBorderWidth, setOnTouchBorderWidth] = useState(0);
  const onTouchBack = () => {
    setOnTouchBorderWidth(1.5);
    setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 160);
  };
  return (
    // <ScrollView
    //   contentContainerStyle={{flexGrow: 1}}
    //   keyboardShouldPersistTaps="handled"
    //   disableScrollViewPanResponder={true}
    //   >
    //   <KeyboardAvoidingView
    //     style={styles.parent}
    //     onPointerLeave={() => console.log()}>
    //     {/* contenedor de formas geometricas y titulo */}
    //     <SafeAreaView style={styles.child1}>
          
    //       <View
    //         style={{
    //           position: 'absolute',
    //           zIndex: 999,
    //           bottom: -5,
    //           backgroundColor: 'white',
    //         }}>
    //         <Image
    //           style={styles.titleImage}
    //           source={require('../../../assets/backgrounds/Portada.png')}
    //         />
    //         <View
    //           style={{
    //             position: 'absolute',
    //             justifyContent: 'center',
    //             bottom: '30%',
    //             alignSelf: 'center',
    //           }}></View>

    //         <WaveBackground />
    //       </View>
          
    //     </SafeAreaView>
    //     {/* contenedor de los elementos  */}
    //     <View style={styles.child2}>
    //       <View style={styles.inputsContainer}>
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
                  fontSize: FontSize.fontSizeText18/fontScale,
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
                  fontSize: FontSize.fontSizeText14/fontScale,
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
                  borderBottomWidth: onTouchBorderWidth,
                  borderBottomColor: Colors.primaryLigth,
                }}
                onPress={() => onTouchBack()}
                onFocus={() => setOnTouchBorderWidth(0)}>
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
          {/* </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView> */}
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
    // marginBottom: '10%',
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
