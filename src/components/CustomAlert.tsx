import { Alert } from 'react-native';

export const CustomAlert = () => {
    const showAlert = (title: string, body:string, cancelText: string, okText: string) => {
        Alert.alert(
          title,
          body,
          [
            {
              text: cancelText,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: okText, onPress: () => console.log('OK Pressed')},
          ],
          {
            cancelable: true
          },
        );
      };

      return {
        showAlert
      }
}
