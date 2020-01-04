export enum AuthTypes {
  SESSION_REQUEST = '@auth/SESSION_REQUEST',
  SESSION_REQUEST_FAILURE = '@auth/SESSION_REQUEST_FAILURE',
  SESSION_REQUEST_SUCCEESS = '@auth/SESSION_REQUEST_SUCCESS',
}

export interface Auth {
  sessionAccessKey: string
  userAccessKey: string
}

export interface AuthState {
  data: Auth | null
  loading: boolean
  error: boolean
}