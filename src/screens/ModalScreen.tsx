import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import CheckCircle from '../assets/icons/general/check-circle-fill.svg';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface Props extends StackScreenProps<any, any> {}

export const ModalScreen = ({navigation}: Props) => {
  return (
    <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>txto de prueba</Text>
              <CheckCircle width={RFPercentage(4)} height={RFPercentage(4)} fill={'green'} />
              <TouchableOpacity
                activeOpacity={0.9}
                style={{backgroundColor: 'transparent', marginTop: 10}}
                onPress={() => navigation.goBack()}>
                <Text>press out</Text>
              </TouchableOpacity>
            </View>
          </View>
  )
}
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