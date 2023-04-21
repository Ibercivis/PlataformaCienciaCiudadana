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
  changePass: (pass1: string, pass2: string) => void;
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
    let keyToken;
    try {
      const resp = await citmapApi.get('/authentication/user/', {
        headers: {
          Authorization: token,
        },
      });
      keyToken = JSON.stringify(resp.config.headers.Authorization, null, 1);
      if (resp.status !== 200) {
        await AsyncStorage.removeItem('token');
        return action({type: 'notAuthenticated'});
      }
    } catch (err) {
      await AsyncStorage.removeItem('token');
      return action({type: 'notAuthenticated'});
    }

    // await AsyncStorage.setItem('token', keyToken);

    action({
      type: 'signIn',
      payload: {
        token: token,
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
      if (resp.data) {
        action({
          type: 'signIn',
          payload: {
            token: resp.data.key,
          },
        });

        let key = 'Token ' + resp.data.key;
        //cuando se loggea, hay que cuardar el token como "Token (token)"
        await AsyncStorage.setItem('token', key);
      }else{
        action({
          type: 'addError',
          payload: 'No se pudo iniciar sesión debido a un problema en el servidor',
        });
      }
    } catch (err) {
      console.log(err);
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
        email: email,
      });
      action({
        type: 'recoveryPass',
        payload: resp.data.detail,
      });
    } catch (err) {
      action({
        type: 'addError',
        payload: err.message,
      });
    }
  };
  const changePass = async (pass1: string, pass2: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const resp = await citmapApi.post(
        '/authentication/password/change/',
        {
          new_password1: pass1,
          new_password2: pass2,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      action({
        type: 'changePass',
        payload: resp.data.detail,
      });
    } catch (err) {
      action({
        type: 'addError',
        payload: err.message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        signUp,
        removeError,
        recoveryPass,
        changePass,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
