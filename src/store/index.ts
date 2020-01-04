import { createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';
import { AuthState } from './modules/auth/types';
import persistReducers from './persistReducers';

export interface ApplicationState {
  auth: AuthState
}

const sagaMiddleware = createSagaMiddleware();

const store: any = createStore(persistReducers(rootReducer), applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };