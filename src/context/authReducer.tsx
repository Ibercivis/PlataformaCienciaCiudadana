import React from 'react';
import {AuthState} from './AuthContext';

type AuthAction =
  | {
      type: 'signIn';
    }
  | {
      type: 'singOut';
    }
  | {
      type: 'changeFavIcon';
      payload: string;
    }
  | {
      type: 'changeUsername';
      payload: string;
    };

//genera estado
export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'signIn':
      return {
        ...state,
        isLoggedIn: true,
        username: 'no-username-yet',
      };
    case 'singOut':
      return {
        ...state,
        isLoggedIn: false,
        username: undefined,
        favoriteIcon: undefined,
      };
    case 'changeFavIcon':
      return {
        ...state,
        favoriteIcon: action.payload,
      };
    case 'changeUsername':
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};
