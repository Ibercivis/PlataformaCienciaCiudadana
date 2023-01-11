import React from 'react';
import {View} from 'react-native';
import { globalStyles } from '../theme/theme';
import {
  Text,
  TextInput,
  Divider,
  Button,
  Chip,
  Snackbar,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from 'react-native-paper';

export const PaperScreen = () => {
  /**
   * seccion dialog
   */
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <View style={globalStyles.globalMargin}>
      <Text>Paper screem</Text>
      <Button onPress={() => console.log('pressed paper')}>Press me</Button>
      <View>
        <View>
          <Text variant="headlineSmall">Sign up to our newsletter!</Text>
          <Text variant="labelLarge">
            Get a monthly dose of fresh React Native Paper news straight to your
            mailbox. Just sign up to our newsletter and enjoy!
          </Text>
          <Divider />
          <View>
            <Chip
              onPress={() => console.log('pressed paper')}
              style={{marginRight: 8, marginVertical: 5}}>
              Dark theme
            </Chip>
            <Chip
              onPress={() => console.log('pressed paper')}
              style={{marginRight: 8, marginVertical: 5}}>
              Material You
            </Chip>
          </View>
          <Divider />
          <TextInput
            style={{marginTop: 15}}
            label="Outlined input"
            mode="outlined"
          />
          <TextInput style={{marginTop: 15}} label="Flat input" mode="flat" />
          <Button
            style={{marginTop: 15}}
            icon="send"
            mode="contained"
            onPress={() => console.log('pressed paper')}>
            Sign me up
          </Button>
        </View>
      </View>
        <View>
          <Button onPress={showDialog}>Show Dialog</Button>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
                <Paragraph>This is simple dialog</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
    </View>
  );
};
