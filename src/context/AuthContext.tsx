import React, {createContext, useReducer} from 'react';
import { authReducer } from './authReducer';

//definir la información que habrá aquí
export interface AuthState {
  isLoggedIn: boolean;
  username?: string;
  favoriteIcon?: string;
}

//estado inicial
export const authInitialState: AuthState = {
  isLoggedIn: false,
  username: undefined,
  favoriteIcon: undefined,
};

//definir todo lo que el contexto va a pasarle a los hijos. Le dice a react como luce y que expone el context
export interface AuthContextProps {
  authState: AuthState;
  signIn: () => void;
  signOut: () => void;
  changeFavoriteIcon: (iconName: string) => void;
  changeUsername: (userName: string) => void;
}

//crea el contexto
export const AuthContext = createContext({} as AuthContextProps);

//componente proveedor del estado
export const AuthProvider = ({children}: any) => {

    const [authState, action] = useReducer(authReducer, authInitialState);
    const signIn = () => {
        action({type: 'signIn'})
    }

    const signOut = () => {
        action({type: 'singOut'})
    }

    const changeFavoriteIcon = (iconName: string) => {
        action({type: 'changeFavIcon', payload: iconName});
    }

    const changeUsername = (userName: string) => {
        action({type: 'changeUsername', payload: userName});
    }

  return (
    <AuthContext.Provider
      value={{
        authState: authState,
        signIn: signIn,
        signOut,
        changeFavoriteIcon,
        changeUsername
        
      }}>
      {children}
    </AuthContext.Provider>
  );
};
