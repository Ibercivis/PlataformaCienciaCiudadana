import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Question} from '../../interfaces/interfaces';
import {InputText} from './InputText';
import {IconButton, TextInput} from 'react-native-paper';
import {FontSize, FontFamily} from '../../theme/fonts';
import ImagePicker from 'react-native-image-crop-picker';
import PlusImg from '../../assets/icons/general/Plus-img.svg';
import Person from '../../assets/icons/general/person.svg';
import FrontPage from '../../assets/icons/project/image.svg';
import {Size} from '../../theme/size';
import {Colors} from '../../theme/colors';
import { useDateTime } from '../../hooks/useDateTime';

interface Props {
  //   onChangeText?: (fieldName: string, value: any) => void;
  onChangeText: (value: any) => void;
  question: Question;
  index: number;
  showModal: (value: boolean) => void;
}

export const CardAnswerMap = ({question, index, onChangeText, showModal}: Props) => {
  // useEffect(() => {
  //     card(question, index)
  //   }, []);

  const [images, setImages] = useState<any>();
  const [imageBlob, setImageBlob] = useState<any>();

  const {getFormattedDateTime} = useDateTime();

  const selectImage = () => {
    setImageBlob({});
    setImages({});
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    }).then(response => {
      //   console.log(JSON.stringify(response[0].sourceURL));
      if (response && response.data) {
        if (response.size < 4 * 1024 * 1024) {
          const newImage = response;
          setImages(newImage);
          const texto: string = getFormattedDateTime();
          onChangeText({
            image: {
              uri: newImage.path, // Debes ajustar esto según la estructura de response
              type: newImage.mime, // Tipo MIME de la imagen
              name: texto +'cover.jpg', // Nombre de archivo de la imagen (puedes cambiarlo)
            },
          });
        } else {
          showModal(true)
          setImages(undefined);
        }
      }
    });
  };

  //#region SECCIÓN RENDERS
  /**
   * TODO ESTO HAY QUE SACARLO A UN COMPONENTE DIFERENTE
   * Metodo que devuelve el tipo de card
   * en el componente, cada respuesta será de un tipo u otro, así solo se permite en el input
   * poner ese tipo de dato
   * la imagen será un cuadradito selector
   * @param item el tipo de dato, que es de tipo Question; dentro el type puede ser IMG = 3, STR = 2, NUM = 1
   */
  const card = (item: Question, num: number) => {
    switch (item.answer_type) {
      case 'STR':
        return (
          <>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginHorizontal: '2%'}}>
                  <Text>{num}</Text>
                </View>
                <View>
                  <Text>{item.question_text}</Text>
                </View>
              </View>
              <View style={{}}>
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  {/* <InputText
                    // isInputText={() => setIsInputText(!isInputText)}
                    label={item.question_text}
                    keyboardType="default"
                    multiline={false}
                    numOfLines={1}
                    onChangeText={(value) => onChangeText(value)}
                    // value={user.username}
                  /> */}
                  <View style={styles.container}>
                    <TextInput
                      style={[styles.input, {borderBottomColor: '#bab9b9'}]}
                      placeholder={item.question_text}
                      placeholderTextColor={'#bab9b9'}
                      onChangeText={value => onChangeText(value)}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </View>
            </View>
          </>
        );
      case 'NUM':
        return (
          <>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginHorizontal: '2%'}}>
                  <Text>{num}</Text>
                </View>
                <View>
                  <Text>{item.question_text}</Text>
                </View>
              </View>
              <View style={{}}>
                <View
                  style={{
                    width: '100%',
                    marginVertical: RFPercentage(1),
                  }}>
                  <View style={styles.container}>
                    <TextInput
                      style={[styles.input, {borderBottomColor: '#bab9b9'}]}
                      keyboardType="number-pad"
                      placeholder={item.question_text}
                      placeholderTextColor={'#bab9b9'}
                      onChangeText={value => onChangeText(value)}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </View>
            </View>
          </>
        );
      case 'IMG':
        return (
          <>
            <View style={{flexDirection: 'column', height: RFPercentage(20)}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginHorizontal: '2%'}}>
                  <Text>{num}</Text>
                </View>
                <View>
                  <Text>{item.question_text}</Text>
                </View>
              </View>
              <View style={{alignItems: 'center',}}>
                <View
                  style={{
                    // marginVertical: RFPercentage(1),
                    alignItems: 'center',
                    marginTop: '5%',
                    width: '60%',
                    height:'80%'
                  }}>
                  {!images && (
                    <View
                      style={{
                        width: '80%',
                        height: '100%',
                        // marginTop: '4%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.secondaryBackground,
                        borderRadius: 10,
                        padding: '2%',
                        //   paddingBottom: '2%'
                      }}>
                      <TouchableOpacity onPress={() => selectImage()}>
                        <FrontPage
                          fill={'#000'}
                          width={RFPercentage(7)}
                          height={RFPercentage(7)}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: RFPercentage(4),
                          position: 'absolute',
                          bottom: RFPercentage(-1),
                          left: RFPercentage(17),
                          zIndex: 999,
                        }}>
                        <PlusImg
                          width={RFPercentage(4)}
                          height={RFPercentage(4)}
                          fill={'#0059ff'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {images && (
                    <View
                      style={{
                        width: '80%',
                        height: '100%',
                        // marginTop: '3.5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: images ? 'transparent': Colors.secondaryBackground,
                        borderRadius: 10,
                        padding: '2%',
                      }}>
                      <Image
                        source={{
                          uri:
                            'data:image/jpeg;base64,' + images.data,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 10,
                          resizeMode: 'cover',
                        }}
                      />

                      <TouchableOpacity
                        onPress={selectImage}
                        style={{
                          width: RFPercentage(4),
                          position: 'absolute',
                          bottom: RFPercentage(-1),
                          left: RFPercentage(17),
                          zIndex: 999,
                        }}>
                        <PlusImg
                          width={RFPercentage(4)}
                          height={RFPercentage(4)}
                          fill={'#0059ff'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </>
        );
      default:
        return <></>;
    }
  };
  //#endregion

  return <View style={styles.card}>{card(question, index)}</View>;
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: RFPercentage(2),
    marginVertical: RFPercentage(1),
    alignSelf: 'center',
    width: RFPercentage(45),
    backgroundColor: 'white',
    //   borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1.1,
    },
    shadowOpacity: 6.2,
    shadowRadius: 10.41,
    elevation: 4,
  },
  container: {
    marginBottom: 8, // Ajusta el margen inferior según tus preferencias
    width: '100%', // Opcional: establece el ancho completo
  },
  input: {
    width: '90%',
    fontSize: FontSize.fontSizeText13,
    fontFamily: FontFamily.NotoSansDisplayLight,
    fontWeight: '300',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});
