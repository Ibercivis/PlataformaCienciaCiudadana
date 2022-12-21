import 'react-native-gesture-handler';

import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {PermissionsProvider} from './src/context/PermissionsContext';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Navigator} from './src/navigation/Navigator';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  const tema = DefaultTheme;
  tema.colors.background = 'white';
  return (
    <AppAuth>
      <AppState>
        <PaperProvider>
          <NavigationContainer theme={tema}>
            <Navigator />
          </NavigationContainer>
        </PaperProvider>
      </AppState>
    </AppAuth>
  );
};

const AppState = ({children}: any) => {
  return <PermissionsProvider>{children}</PermissionsProvider>;
};
const AppAuth = ({children}: any) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default App;
