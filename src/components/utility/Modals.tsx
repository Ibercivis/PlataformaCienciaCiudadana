import React, {useState} from 'react';
import {Modal, View, StyleSheet, Text} from 'react-native';
import {Button, Divider, List, Portal, Provider} from 'react-native-paper';
import Animales from '../../assets/icons/category/Animales.svg';

interface Props {
  label?: string;
  onPress?: () => void;
  visible: boolean;
  hideModal: () => void;
  selected: string;
  setSelected: (value: any) => void;
  icon?: string;
  size?: string;
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
                    onPress={() => setSelected(gender)}
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
                    onPress={() => setSelected(visibility)}
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
