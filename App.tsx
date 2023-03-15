import 'react-native-gesture-handler';

import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {PermissionsProvider} from './src/context/PermissionsContext';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Navigator} from './src/navigation/Navigator';
import {AuthProvider} from './src/context/AuthContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const tema = DefaultTheme;
  tema.colors.background = 'white';
  return (
    <AppAuth>
      <AppState>
        <PaperProvider>
          <SafeAreaProvider>
            <NavigationContainer theme={tema}>
              <Navigator />
            </NavigationContainer>
          </SafeAreaProvider>
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
