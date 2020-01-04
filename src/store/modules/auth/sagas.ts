import { takeLatest, call, put, all } from 'redux-saga/effects';
import api from '../../../services/api';
import { toast } from 'react-toastify';

import { AuthTypes } from './types';
import { sessionRequestSuccess, sessionRequestFailure } from './actions'

export function* sessionRequest({ payload }: { type: AuthTypes.SESSION_REQUEST, payload: { data: { user: string, password: string}} }) {
  try {
    const { user } = payload.data;
    const { password } = payload.data; 

    const { data } = yield call(api.post, '/auth/session-request', {
      "system_api_key": '505763d6-4202-4b05-9efc-93b366939bcf'
    });

    if (data.status !== 200) {
      throw new Error(data.message);
    }

    const sessionAccessKey = data.data.access_key;

    var config = {
      headers: { "Authorization": `Bearer ${sessionAccessKey}` }
    }

    const sessionRegisterResponse = yield call(api.post, '/auth/session-register', {
      "organization_user": { "email": user, "password": password }
    },
      config
    )

    if (sessionRegisterResponse.data.status !== 200) {
      throw new Error(data.message);
    }

    const userAccessKey = sessionRegisterResponse.data.data.access_key;

    api.defaults.headers.Authorization = `Bearer ${userAccessKey}`;

    const auth = { sessionAccessKey, userAccessKey };

    yield put(sessionRequestSuccess(auth));

  }
  catch (err) {
    toast.error(err.message)
    yield put(sessionRequestFailure());
  }

}

export function setToken({ payload } : { type: AuthTypes.SESSION_REQUEST, payload: any }) {
  if (!payload) return;

  const { userAccessKey } = payload.auth.data;

  if (userAccessKey) {
    api.defaults.headers.Authorization = `Bearer ${userAccessKey}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest(AuthTypes.SESSION_REQUEST, sessionRequest)
])
