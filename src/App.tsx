import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

import { store, persistor } from './store';

import GlobalStyle from './styles/global';

import Routes from './routes/index'

import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store} >
      <PersistGate persistor={persistor} >
        <Routes />
        <GlobalStyle />
        <ToastContainer autoClose={3000} />
      </PersistGate>
    </Provider>
  )
}

export default App;
