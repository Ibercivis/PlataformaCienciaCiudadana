import React from 'react';
import {User} from '../interfaces/appInterfaces';
import {AuthState} from './AuthContext';

type AuthAction =
  | {
      type: 'signIn';
      payload: {token: string};
    }
  | {
      type: 'signUp';
      payload: {token: string; user: User};
    }
  | {
      type: 'singOut';
    }
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'notAuthenticated'}
  | {type: 'recoveryPass'; payload: string}
  | {type: 'changePass'; payload: string};

//genera estado
export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signUp':
      return {
        ...state,
        errorMessage: '',
        status: 'authenticated',
        token: action.payload.token,
        user: action.payload.user,
      };

    case 'signIn':
      return {
        ...state,
        errorMessage: '',
        status: 'authenticated',
        token: action.payload.token,
        // user: action.payload.user,
      };

    case 'singOut':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
      };

    case 'addError':
      return {
        ...state,
        user: null,
        status: 'not-authenticated',
        token: null,
        errorMessage: action.payload,
      };

    case 'removeError':
      return {
        ...state,
        errorMessage: '',
        message: '',
      };

    case 'notAuthenticated':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
      };

    case 'recoveryPass':
      return {
        ...state,
        message: action.payload,
      };
    case 'changePass':
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};
