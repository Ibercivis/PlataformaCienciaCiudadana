import React, {createContext, useEffect, useReducer} from 'react';
import {authReducer} from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  User,
} from '../interfaces/appInterfaces';
import citmapApi from '../api/citmapApi';

//definir la información que habrá aquí
export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  token: string | null;
  errorMessage: string;
  message: string;
  user: User | null;
}

//estado inicial
const authInitialState: AuthState = {
  user: null,
  token: null,
  errorMessage: '',
  message: '',
  status: 'checking',
};

//definir todo lo que el contexto va a pasarle a los hijos. Le dice a react como luce y que expone el context
type AuthContextProps = {
  errorMessage: string;
  message: string;
  token: string | null;
  user: User | null;
  signIn: (loginData: LoginData) => void;
  signUp: (data: RegisterData) => void;
  signOut: () => void;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  removeError: () => void;
  recoveryPass: (email: string) => void;
  // setUsername: (userName: string) => void;
  // setPassword: (password: string) => void;
};

//crea el contexto
export const AuthContext = createContext({} as AuthContextProps);

//componente proveedor del estado
export const AuthProvider = ({children}: any) => {
  const [authState, action] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return action({type: 'notAuthenticated'});
    const key = 'Token ' + token;
    console.log('CHECK TOKEN');
    console.log(token);
    // const resp = await citmapApi.post('/authentication/login/', );
    let keyToken;
    try {
      const resp = await citmapApi.get('/authentication/user/', {
        headers: {
          Authorization: key,
        },
      });
      keyToken = JSON.stringify(resp.config.headers.Authorization, null, 1);
      if (resp.status !== 200) {
        return action({type: 'notAuthenticated'});
      }
    } catch (err) {
      return action({type: 'notAuthenticated'});
    }

    await AsyncStorage.setItem('token', keyToken);
    action({
      type: 'signIn',
      payload: {
        token: keyToken,
        // user: resp.data.usuario,
      },
    });
  };

  const signIn = async (loginData: LoginData) => {
    try {
      const resp = await citmapApi.post('/authentication/login/', {
        username: loginData.correo,
        password: loginData.password,
      });
      action({
        type: 'signIn',
        payload: {
          token: resp.data.key,
        },
      });
      console.log('LOGIN');
      console.log(resp.data.key);
      let key = 'Token ' + resp.data.key;
      await AsyncStorage.setItem('token', resp.data.key);
    } catch (err) {
      let textError = '';
      const dataError = JSON.stringify(err.response.data, null);
      const dataErrorObj = JSON.parse(dataError);
      for (const x in dataErrorObj) {
        textError += dataErrorObj[x] + '\n';
      }
      action({
        type: 'addError',
        payload: textError,
      });
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      const resp = await citmapApi.post<LoginResponse>('/registration/', {
        username: data.username,
        email: data.email,
        password1: data.password1,
        password2: data.password2,
      });
      console.log(JSON.stringify(resp, null, 1))
      action({
        type: 'signUp',
        payload: {user: resp.data.user, token: resp.data.token},
      });
      await AsyncStorage.setItem('token', resp.data.token);
    } catch (err) {
      let textError = '';
      const dataError = JSON.stringify(err.response.data, null);
      const dataErrorObj = JSON.parse(dataError);
      for (const x in dataErrorObj) {
        textError += dataErrorObj[x] + '\n';
      }
      action({
        type: 'addError',
        payload: textError,
      });
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    action({type: 'singOut'});
  };

  const removeError = () => {
    action({type: 'removeError'});
  };

  const recoveryPass = async (email: string) => {
    try {
      const resp = await citmapApi.post('/authentication/password/reset/', {
        email: email
      });
      console.log(JSON.stringify(resp.data.detail, null, 1));
      action({
        type: 'recoveryPass',
        payload: resp.data.detail,
      });
      console.log('RECOVERY SUCCESFULL');
    } catch (err) {
      console.log(JSON.stringify(err, null, 1))
      action({
        type: 'addError',
        payload: err.message,
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        signUp,
        removeError,
        recoveryPass
      }}>
      {children}
    </AuthContext.Provider>
  );
};
