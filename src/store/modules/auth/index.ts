import { Reducer } from 'redux';
import { AuthState, AuthTypes } from './types';

const INITIAL_STATE: AuthState = {
  data: null,
  loading: false,
  error: false
}

const reducer: Reducer<AuthState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthTypes.SESSION_REQUEST:
      return { ...state, loading: true };
    case AuthTypes.SESSION_REQUEST_SUCCEESS:
      return { ...state, loading: false,  data: action.payload.auth };
    case AuthTypes.SESSION_REQUEST_FAILURE:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

export default reducer;