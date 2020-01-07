import React, { useState, useEffect } from 'react';
import { Dispatch } from 'redux';
import { TypedUseSelectorHook, useDispatch as useDispatchGeneric, useSelector as useSelectorGeneric } from 'react-redux';
import { Action } from 'typesafe-actions';
import { Input, Button } from 'antd';

import { sessionRequest as sessionRequestAction } from '../../store/modules/auth/actions';
import history from '../../services/history';

import { ApplicationState } from '../../store';
import { Container, Content } from './styles';

export const useSelector: TypedUseSelectorHook<ApplicationState> = useSelectorGeneric;
export const useDispatch: () => Dispatch<Action> = useDispatchGeneric;

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const loading = useSelector(state => state.auth.loading);

  const userAccessKey = useSelector(state => {
    if (state.auth.data) {
      return state.auth.data.userAccessKey
    }
  });

  const [user, setUser] = useState<string>('usuario-test@adopets.com');
  const [password, setPassword] = useState<string>('123123');

  useEffect(() => {
    if (userAccessKey) {
      history.push('/search');
    }
  }, [userAccessKey])

  function handleLogin() {
    const data = { user, password };
    dispatch(sessionRequestAction(data));
  }

  function handleUserChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser(e.target.value)
  }


  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <Container>
      <Content>
        <Input placeholder="User" onChange={handleUserChange} value={user} />
        <Input placeholder="Password" onChange={handlePasswordChange} value={password} />

        <Button onClick={handleLogin}>{loading ? 'Validando...' : 'Login'}</Button>

      </Content>
    </Container>
  );
}

export default Login;