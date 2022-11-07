import 'react-native-gesture-handler';

import React from 'react';
import {PermissionsProvider} from './src/context/PermissionsContext';
import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigation/Navigator';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  return (
    <AppAuth>
      <AppState>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
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
