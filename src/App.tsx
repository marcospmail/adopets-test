import React, { useEffect } from 'react';

import api from './services/api';

const App: React.FC = () => {
  let sessionRequestAccessKey: string;
  let sessionRegisterAccessKey: string;


  useEffect(() => {
    async function sessionRequest(): Promise<string> {
      const { data } = await api.post('/auth/session-request', {
        "system_api_key": '505763d6-4202-4b05-9efc-93b366939bcf'
      })

      console.log(data.data.access_key);

      return data.data.access_key;
    }

    async function sessionRegister(): Promise<string> {
      var config = {
        headers: { 'Authorization': "bearer " + sessionRequestAccessKey }
      };

      console.log(config);

      const { data } = await api.post('/auth/session-register', {
        "organization_user": { "email": "usuario-test@adopets.com", "password": "123123" }
      },
        config
      )

      console.log(data);

      return data;
    }

    async function init() {
      sessionRequestAccessKey = await sessionRequest();
      sessionRegisterAccessKey = await sessionRegister();

      console.log(sessionRegisterAccessKey);
    }

    init();

  }, [])

  return (
    <div>

    </div>
  );
}

export default App;
