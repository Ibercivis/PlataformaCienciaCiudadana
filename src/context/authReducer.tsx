import React from 'react';
import {AuthState} from './AuthContext';

type AuthAction =
  | {
      type: 'signIn';
      payload?: {token: string};
    }
  | {
      type: 'singOut';
    }
  | {
      type: 'setUsername';
      payload: string;
    }
  | {
      type: 'setPassword';
      payload: string;
    };

//genera estado
export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signIn':
      if(action.payload){
        return {
          ...state,
          isLoggedIn: true,
          token: action.payload.token
        };
      }else{
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    case 'singOut':
      return {
        ...state,
        isLoggedIn: false,
        username: undefined,
        password: undefined,
        token: undefined
      };
    case 'setUsername':
      return {
        ...state,
        username: action.payload,
      };
    case 'setPassword':
      return {
        ...state,
        password: action.payload,
      };
    default:
      return state;
  }
};
