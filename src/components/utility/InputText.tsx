import React, {useState} from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {FontFamily, FontSize} from '../../theme/fonts';
import {Size} from '../../theme/size';
import {useTogglePasswordVisibility} from '../../hooks/useTogglePasswordVisibility';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconBootstrap} from './IconBootstrap';
import {TextInput} from 'react-native-paper';

/**
 * @label nombre visible
 * @icon [opcional] string nombre icon
 * @inputType [opcional] tipo de campo ['','password']
 * @keyboardType [opcional] opciones de tipo de teclado
 * @fieldButtonLabel [opcional] string nombre botón dentro del input
 * @fieldButtonFunction [opcional] funcion botón opcional
 * @onChangeText funcion del input; requiere valor any
 * @multiline boolean para saber si tiene o no varias lineas
 * @numOfLines numero de lineas [minima 1]
 */
interface Props {
  label: string;
  icon?: string;
  inputType?: boolean;
  keyboardType?: KeyboardTypeOptions;
  fieldButtonLabel?: string;
  fieldButtonFunction?: () => void;
  onChangeText: (value: any) => void;
  multiline: boolean;
  numOfLines: number;
  iconColor?: string;
  value?: string;
  marginBottom?: string | number;
  maxLength?: number;
}
export const InputText = ({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  onChangeText,
  multiline,
  numOfLines,
  iconColor = '#666',
  value,
  marginBottom = '6%',
  maxLength = 100,
}: Props) => {
  // variable que establece por defecto el color del input cuando no es presionado y que al ser presionado, cambiará
  const [onBlurInput, setOnBlurInput] = useState('transparent');
  const [onBlurTextInput, setOnBlurTextInput] = useState('#c9c4c4');
  const [iconColorFocus, setIconColorFocus] = useState('#c9c4c4');
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    useTogglePasswordVisibility();

  /**
   * Establece el color del borde del input y del placeholder a negro cuando el focus está en el
   */
  const customFocus = () => {
    setOnBlurInput('black');
    // setOnBlurTextInput('#000000');
    setIconColorFocus('#000000');
  };
  /**
   * Establece el color del borde del input y del placeholder a gris cuando se sale del focus
   */
  const customBlurColor = () => {
    setOnBlurInput('transparent');
    setOnBlurTextInput('#c9c4c4');
    setIconColorFocus('#c9c4c4');
    
  };

  return (
    // <View style={styles.container}>
      <View style={{...styles.inputContainer, borderColor: onBlurInput}}>
        <TextInput
          style={{
            width: '80%',
            marginLeft: '1%',
            fontSize: FontSize.fontSizeText13,
            fontFamily: FontFamily.NotoSansDisplayLight,
            fontWeight: '300',
            color: 'black',
            alignSelf: 'center',
            backgroundColor: 'white',
            height: 35,
          }}
          placeholderTextColor={onBlurTextInput}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textAlignVertical="center"
          autoCapitalize="none"
          outlineStyle={{borderWidth: 0}}
          secureTextEntry={passwordVisibility}
          placeholder={label}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numOfLines}
          selectionColor={Colors.primary}
          value={value}
          maxLength={maxLength}
          onChangeText={value => onChangeText(value)}
          onBlur={customBlurColor}
          onFocus={customFocus}
        />
        {inputType && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePasswordVisibility}
            style={{
              // ...styles.touchable,
              // maxHeight: 35,
              marginRight: '1%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              top:'1%',
              // backgroundColor: 'red',
            }}>
            {/* <MaterialCommunityIcons
              name={rightIcon}
              size={15}
              color="#232323"
            /> */}
            <IconBootstrap
              name={rightIcon}
              size={20}
              color={iconColorFocus}
            />
          </TouchableOpacity>
        )}
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    // alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    height: 'auto',
    // backgroundColor: 'cyan',
    // backgroundColor: 'transparent',
    flexDirection: 'row',
    // alignItems: 'center',
    alignContent: 'center',
    // justifyContent: 'center',
    // textAlignVertical:'center',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1.2,
    marginTop: '2.5%',
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,

    elevation: 1.25,
  },
});
