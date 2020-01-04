import { action } from 'typesafe-actions';
import { AuthTypes, Auth } from './types'

export const sessionRequest = (data: { user: string, password: string }) => action(AuthTypes.SESSION_REQUEST, {data});

export const sessionRequestFailure = () => action(AuthTypes.SESSION_REQUEST_FAILURE);

export const sessionRequestSuccess = (auth: Auth) => action(AuthTypes.SESSION_REQUEST_SUCCEESS, { auth });
