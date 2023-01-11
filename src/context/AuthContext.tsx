import React, {createContext, useEffect, useReducer} from 'react';
import {authReducer} from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

//definir la información que habrá aquí
export interface AuthState {
  isLoggedIn: boolean;
  username?: string;
  password?: string;
  token?: string;
}

//estado inicial
export const authInitialState: AuthState = {
  isLoggedIn: false,
  username: undefined,
  password: undefined,
  token: undefined,
};

//definir todo lo que el contexto va a pasarle a los hijos. Le dice a react como luce y que expone el context
export interface AuthContextProps {
  authState: AuthState;
  signIn: (remember?: string) => void;
  signOut: () => void;
  setUsername: (userName: string) => void;
  setPassword: (password: string) => void;
}

//crea el contexto
export const AuthContext = createContext({} as AuthContextProps);

//componente proveedor del estado
export const AuthProvider = ({children}: any) => {
  const [authState, action] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('rememberme');
    if (token){
      await AsyncStorage.setItem('rememberme', token);
      action({
        type: 'signIn',
        payload: {
          token: token,
        },
      });
    } 
  };

  const signIn = async (remember?: string) => {
    if (remember) {
      await AsyncStorage.setItem('rememberme', remember);
      action({type: 'signIn', payload: {token: remember}});
    }
    action({type: 'signIn'});
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('rememberme');
    action({type: 'singOut'});
  };

  const setUsername = (username: string) => {
    action({type: 'setUsername', payload: username});
  };

  const setPassword = (password: string) => {
    action({type: 'setPassword', payload: password});
  };

  return (
    <AuthContext.Provider
      value={{
        authState: authState,
        signIn: signIn,
        signOut,
        setUsername,
        setPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
