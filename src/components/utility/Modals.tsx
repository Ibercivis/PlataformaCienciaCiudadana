import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Divider, List, Portal, Provider} from 'react-native-paper';
import Animales from '../../assets/icons/category/Animales.svg';
import CheckCircle from '../../assets/icons/general/check-circle-fill.svg';
import {useModal} from '../../context/ModalContext';
import {FontSize, FontWeight} from '../../theme/fonts';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Colors} from '../../theme/colors';

interface Props {
  label?: string;
  subLabel?: string;
  onPress?: () => void;
  visible: boolean;
  helper?: boolean;
  hideModal: () => void;
  selected?: string;
  setSelected?: (value: any) => void;
  icon?: string;
  size?: number;
  color?: string;
}

export const GenderSelectorModal = ({
  onPress,
  visible,
  hideModal,
  selected,
  setSelected,
}: Props) => {
  // const [selectedGender, setSelectedGender] = useState('');

  const genders = [
    'Masculino',
    'Femenino',
    'No binario',
    'Prefiero no decirlo',
  ];

  //TODO hacer que cuando se selecciona de este modal, se pase a la pantalla y  tal

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onRequestClose={hideModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <List.Section>
                <List.Subheader>Selecciona tu género</List.Subheader>
                {genders.map((gender, index) => (
                  <List.Item
                    key={index}
                    title={gender}
                    onPress={() => setSelected!(gender)}
                    left={() => (
                      <List.Icon
                        icon={
                          selected === gender
                            ? 'check'
                            : 'checkbox-blank-outline'
                        }
                      />
                    )}
                  />
                ))}
              </List.Section>
              <Divider />
              <Button
                mode="outlined"
                onPress={onPress}
                style={styles.acceptButton}
                labelStyle={styles.buttonLabel}>
                Aceptar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export const VisibilityOrganizationModal = ({
  onPress,
  visible,
  hideModal,
  selected,
  setSelected,
  label,
}: Props) => {
  const visibility = ['Solo tú', 'Solo tú y proyectos', 'Público'];
  //TODO esto cambiarlo por un objeto que tenga clave valor

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onRequestClose={hideModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <List.Section>
                <List.Subheader>{label}</List.Subheader>
                {visibility.map((visibility, index) => (
                  <List.Item
                    key={index}
                    title={visibility}
                    onPress={() => setSelected!(visibility)}
                    left={() => (
                      <List.Icon
                        icon={
                          selected === visibility
                            ? 'check'
                            : 'checkbox-blank-outline'
                        }
                      />
                    )}
                  />
                ))}
              </List.Section>
              <Divider />
              <Button
                mode="outlined"
                onPress={onPress}
                style={styles.acceptButton}
                labelStyle={styles.buttonLabel}>
                Aceptar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export const SaveModal = ({
  onPress,
  visible,
  hideModal,
  selected,
  setSelected,
  label,
  icon,
  size,
  color,
}: Props) => {
  const visibility = ['Solo tú', 'Solo tú y proyectos', 'Público'];
  //TODO esto cambiarlo por un objeto que tenga clave valor

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onRequestClose={hideModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{label}</Text>
              <Animales width={size} height={size} fill={color} />
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export const SaveProyectModal = ({
  onPress,
  visible,
  hideModal,
  label,
  subLabel,
  icon,
  size,
  color,
  helper = true,
}: Props) => {
  // const { modalVisible, setModalVisible, changeVisibility } = useModal();
  //TODO pasar esto a una screen y llamarla desde el navigator para hacer como si fuera un modal global en la app
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} transparent>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={{...styles.modalContainer}}>
              <View
                style={{
                  ...styles.modalContent,
                  alignItems: 'center',
                  height: '35%',
                  width: '60%',
                  justifyContent: 'center',
                  paddingHorizontal: '11%',
                }}>
                {helper === true ? (
                  <>
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText20,
                        color: 'black',
                        marginVertical: '4%',
                        fontWeight: '600',
                      }}>
                      {label}
                    </Text>
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText14,
                        color: 'black',
                        textAlign: 'center',
                        marginTop: '5%',
                      }}>
                      {subLabel}
                    </Text>
                    <View style={{marginTop: RFPercentage(4)}}>
                      <CheckCircle width={size} height={size} fill={color} />
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText20,
                        color: 'black',
                        marginVertical: '4%',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {label}
                    </Text>

                    <View style={{marginTop: RFPercentage(4)}}>
                      <CheckCircle width={size} height={size} fill={color} />
                    </View>
                  </>
                )}

                {/* <TouchableOpacity
                  activeOpacity={0.9}
                  style={{backgroundColor: 'transparent', marginTop: 10}}
                  onPress={() => hideModal()}>
                  <Text>Cerrar</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </Provider>
  );
};
export const InfoModal = ({
  onPress,
  visible,
  hideModal,
  label,
  subLabel,
  icon,
  size,
  color,
  helper = true,
}: Props) => {
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} transparent>
          <TouchableWithoutFeedback onPress={hideModal}>
            <View style={{...styles.modalContainer}}>
              <View
                style={{
                  ...styles.modalContent,
                  alignItems: 'center',
                  height: '40%',
                  width: '70%',
                  // justifyContent: 'center',
                  // paddingHorizontal: '11%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '60%',
                    height: '20%',
                    alignItems: 'center',
                    // justifyContent: 'center',
                  }}>
                  <View style={{marginRight: '4%'}}>
                    <CheckCircle width={size} height={size} fill={color} />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: Colors.primaryDark,
                        textAlign: 'center',
                        fontSize: FontSize.fontSizeText18 - 1,
                      }}>
                      {label}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '80%',
                    height: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{marginTop: '10%'}}>{subLabel}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{backgroundColor: 'transparent', marginTop: '20%'}}
                  onPress={() => hideModal()}>
                  <Text
                    style={{color: 'black', fontSize: FontSize.fontSizeText18}}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  acceptButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
});
