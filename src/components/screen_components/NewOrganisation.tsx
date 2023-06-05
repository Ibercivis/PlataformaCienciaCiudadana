import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm} from '../../hooks/useForm';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '../../navigation/ProjectNavigator';

import {
  Button,
  Dialog,
  HelperText,
  IconButton,
  Paragraph,
  Portal,
  Text,
} from 'react-native-paper';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {launchImageLibrary} from 'react-native-image-picker';

import {globalStyles} from '../../theme/theme';
import {fonts, FontSize} from '../../theme/fonts';
import {Colors} from '../../theme/colors';
import {Size} from '../../theme/size';

import translate from '../../theme/es.json';
import Modal from 'react-native-modal';

import {InputField} from '../InputField';
import {BackButton} from '../BackButton';
import {InfoButton} from '../InfoButton';
import {MultiSelect} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomButton} from '../utility/CustomButton';
import {Picker} from '@react-native-picker/picker';
import {Header} from '@rneui/base';
import {IconTemp} from '../IconTemp';
import { HeaderComponent } from '../HeaderComponent';

interface Props extends StackScreenProps<StackParams, 'OrganisationScreen'> {}

// carousel data
const dataCarousel = [
  {
    title: 'Creación del proyecto',
    numPantalla: 'Primera',
    body: 'En estos campos es obligatorio el nombre, descripción y añadir mínimo un hastag y topic ',
  },
  {
    title: 'Añadir marcas',
    numPantalla: 'Segunda',
    body: 'En la parte inferior derecha, tenemos 3 botones que añadirán una marca de tipo imagen, número o campo de texto',
  },
  {
    title: 'Fase final',
    numPantalla: 'Tercera',
    body: 'En esta pantalla habrá que rellenar los campos que has creado a modo de ejemplo',
  },
];

const SLIDER_WIDTH = Dimensions.get('window').width * 0.8;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const SLIDER_HEIGHT = Dimensions.get('window').height * 0.5;
const ITEM_HEIGHT = Math.round(SLIDER_WIDTH * 0.9);

export const NewOrganisation = ({navigation, route}: Props) => {
  // carousel
  const carousel = useRef(null);
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  // image
  const [tempUri, setTempUri] = useState<string>();
  //modales
  const [visible, setVisible] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  // hooks
  const {
    principalName,
    url,
    description,
    type,
    contactName,
    contactMail,
    logo,
    creditLogo,
    onChange,
    form,
  } = useForm({
    principalName: '',
    url: '',
    description: '',
    type: '',
    contactName: '',
    contactMail: '',
    logo: '',
    creditLogo: '',
  });

  //useEffects

  //methods
  const galeria = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) return;
        if (response.assets) {
          setTempUri(response.assets![0].uri);
        }
      },
    );
  };

  const deleteImage = () => {
    if (tempUri) {
      setTempUri(undefined);
    }
  };

  /**
   * Cambia el tipo
   * @param value Valor del dato pickeado
   */
  const onSelectType = (value: string = '') => {
    onChange(value, 'type');
  };

  /**
   *
   * @param item cada elemento del carousel
   * @returns cada vista del carousel
   */
  const renderCarouselItem = (
    item:
      | ListRenderItemInfo<{title: string; body: string; numPantalla: string}>
      | {
          item: {title: string; body: string; numPantalla: string};
          index: number;
        },
  ) => {
    return (
      <View style={carouselStyles.container}>
        <Text
          style={{
            fontSize: FontSize.fontSizeTextTitle,
            marginVertical: '5%',
            alignSelf: 'center',
            fontWeight: 'bold',
          }}>
          {item.item.title}
        </Text>
        <Text style={{fontSize: FontSize.fontSizeTextMin}}>
          {item.item.numPantalla}
        </Text>
        <Text style={{fontSize: FontSize.fontSizeText}}>{item.item.body}</Text>
      </View>
    );
  };

  // dialogs
  const showDialog = () => {
    setVisible(true);
  };

  const showHelpModal = () => {
    setHelpModal(true);
  };

  const hideDialog = () => setVisible(false);

  return (
    <>
      <KeyboardAvoidingView style={{flex: 1}}>
        <HeaderComponent title={translate.strings.new_organisation_screen[0].title} onPressLeft={() => navigation.goBack()} onPressRight={() => showHelpModal()}/>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          disableScrollViewPanResponder={true}>
          {/* {name ? (
            <Text style={fonts.title}>
              {translate.strings.new_project_screen[0].title_edit}
            </Text>
          ) :
           (
               )} */}

          {/* <Text
            style={{...fonts.title, fontSize: FontSize.fontSizeTextSubTitle}}>
            {translate.strings.new_organisation_screen[0].title}
          </Text> */}
          {/* informacion principal */}
          <View>
            <View>
              <Text style={styles.title}>
                {
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_title
                }
              </Text>
            </View>

            {/* principal name input */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_name_input
                }
                icon="border-color"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'principalName')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_name_placeholder
                }
              </HelperText>
            </View>

            {/* principal url input  */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_enlace_input
                }
                icon="web"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'url')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_enlace_placeholder
                }
              </HelperText>
            </View>

            {/* principal description input */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_description_input
                }
                icon="text"
                keyboardType="default"
                multiline={true}
                numOfLines={6}
                onChangeText={value => onChange(value, 'description')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
                maxLength={300}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_description_placeholder
                }
              </HelperText>
            </View>

            {/* principal type input */}
            <View style={{marginBottom: '8%'}}>
              <View>
                <Text style={{...styles.title, marginBottom: '-3%'}}>
                  {
                    translate.strings.new_organisation_screen[0]
                      .principal_information[0].principal_type_input
                  }
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name={'hoop-house'}
                  size={Size.iconSizeMedium}
                  color={Colors.lightorange}
                  style={{alignSelf: 'center'}}
                />
                <Picker
                  style={{
                    flex: 1,
                    // width: Size.globalWidth * 0.8,
                    borderColor: Colors.lightorange,
                  }}
                  selectedValue={form.type}
                  placeholder="Tipo de dato"
                  onValueChange={(itemValue, itemIndex) =>
                    onSelectType(itemValue)
                  }>
                  <Picker.Item label="Governmental" value="governmental" />
                  <Picker.Item
                    label="Non-Governmental"
                    value="nonGovernmental"
                  />
                  <Picker.Item label="Academic" value="academic" />
                  <Picker.Item label="Private Sector" value="privateSector" />
                  <Picker.Item label="Community-led" value="communityLed" />
                  <Picker.Item label="Consortium" value="consortium" />
                </Picker>
              </View>
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .principal_information[0].principal_type_placeholder
                }
              </HelperText>
            </View>
          </View>
          {/* informacion de contacto */}
          <View>
            <View>
              <Text style={styles.title}>
                {
                  translate.strings.new_organisation_screen[0]
                    .contact_information[0].contact_title
                }
              </Text>
            </View>

            {/* contact name input */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0]
                    .contact_information[0].contact_name_input
                }
                icon="border-color"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'contactName')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .contact_information[0].contact_name_placeholder
                }
              </HelperText>
            </View>

            {/* contact mail input */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0]
                    .contact_information[0].contact_mail_input
                }
                icon="email-edit-outline"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'contactMail')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0]
                    .contact_information[0].contact_mail_placeholder
                }
              </HelperText>
            </View>
          </View>
          {/* informacion del logo */}
          <View>
            <View>
              <Text style={styles.title}>
                {
                  translate.strings.new_organisation_screen[0].logo[0]
                    .logo_title
                }
              </Text>
            </View>

            {/* image picker */}
            <View style={styles.photoContainer}>
              {!tempUri && (
                <View style={styles.photo}>
                  <IconButton
                    icon="image-album"
                    iconColor="#5F4B66"
                    size={Size.iconSizeLarge}
                    onPress={() => galeria()}
                  />
                </View>
              )}
              {tempUri && (
                <>
                  <Image
                    source={{
                      uri: tempUri,
                    }}
                    style={{
                      width: '90%',
                      height: 350,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                  />
                  <Button
                    style={{margin: 15, width: 150, alignSelf: 'center'}}
                    icon="delete"
                    mode="elevated"
                    buttonColor="white"
                    onPress={() => deleteImage()}>
                    Borrar imagen
                  </Button>
                </>
              )}
            </View>
            {/* credit input */}
            <View style={{marginBottom: '8%'}}>
              <InputField
                label={
                  translate.strings.new_organisation_screen[0].logo[0]
                    .logo_credit_input
                }
                icon="image-outline"
                keyboardType="default"
                multiline={false}
                numOfLines={1}
                onChangeText={value => onChange(value, 'creditLogo')}
                iconColor={Colors.lightorange}
                marginBottom={'2%'}
              />
              <HelperText type="info" visible={true} style={styles.helperText}>
                {
                  translate.strings.new_organisation_screen[0].logo[0]
                    .logo_placeholder
                }
              </HelperText>
            </View>
          </View>

          {/* SAVE */}
          <View>
            <CustomButton
              label={'Guardar'}
              onPress={() => console.log(JSON.stringify(form, null, 2))}
              backgroundColor={Colors.primary}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* back button */}
      {/* <BackButton onPress={() => navigation.goBack()} /> */}

      {/* info button */}
      {/* <InfoButton onPress={() => showHelpModal()} /> */}

      {/* err modal */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{alignSelf: 'center'}}>
            Error de creación
          </Dialog.Title>
          <Dialog.Content style={{top: '4%', paddingVertical: 10}}>
            <Paragraph style={styles.modalText}>
              Es necesario establecer un nombre y una descripción válidos.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity activeOpacity={0.5} onPress={hideDialog}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: '5%',
                }}>
                <Text style={{fontSize: FontSize.fontSizeText, color: 'black'}}>
                  Cerrar
                </Text>
              </View>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* info modal */}
      <Modal
        style={{alignItems: 'center'}}
        onBackdropPress={() => setHelpModal(false)}
        isVisible={helpModal}
        animationIn="zoomIn"
        animationInTiming={300}
        animationOut="zoomOut"
        animationOutTiming={300}
        backdropOpacity={0.8}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={globalStyles.viewModal}>
          <Carousel
            layout="default"
            layoutCardOffset={9}
            useScrollView={true}
            ref={carousel}
            data={dataCarousel}
            renderItem={item => renderCarouselItem(item)}
            sliderWidth={SLIDER_WIDTH}
            sliderHeight={SLIDER_HEIGHT}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            onSnapToItem={index => setIndex(index)}
          />
          <Pagination
            dotsLength={dataCarousel.length}
            activeDotIndex={index}
            ref={isCarousel}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      </Modal>
    </>
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
  photoContainer: {
    marginBottom: '10%',
  },
  photo: {
    alignItems: 'center',
    flex: 1,
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.lightorange,
    justifyContent: 'center',
    backgroundColor: '#EADEDA',
  },
  modalText: {
    fontSize: FontSize.fontSizeText,
    textAlign: 'center',
    paddingVertical: FontSize.fontSizeText,
    alignItems: 'baseline',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    marginTop: 8,
    marginRight: '3%',
    paddingHorizontal: '4%',
    marginVertical: '4%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    paddingVertical: '2%',
    fontSize: FontSize.fontSizeTextMin,
    color: Colors.lightorange,
  },
});

const carouselStyles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: '100%',
    height: SLIDER_HEIGHT,
    paddingBottom: 0,
    marginVertical: '2%',
  },
});
