import React, { useEffect, useState } from 'react';
import { Input, Table } from 'antd';

import api from '../../services/api';

import { Container } from './styles';

const { Search } = Input;

const SearchPage: React.FC = () => {
  const [data, setData] = useState<[]>([]);
  const [sortedInfo, setSortedInfo] = useState();
  const [filteredName, setFilteredName] = useState();
  const [sessionRequestAccessKey, setSessionRequestAccessKey] = useState();
  const [sessionRegisterAccessKey, setSessionRegisterAccessKey] = useState();

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo?.columnKey === 'id' && sortedInfo.order,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo.order,
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setSortedInfo(sorter);
  };

  useEffect(() => {
    async function sessionRequest(): Promise<string> {
      const { data } = await api.post('/auth/session-request', {
        "system_api_key": '505763d6-4202-4b05-9efc-93b366939bcf'
      })

      return data.data.access_key;
    }

    async function sessionRegister(): Promise<string> {
      var config = {
        headers: { "Authorization": `Bearer ${sessionRequestAccessKey}` }
      }


      const { data } = await api.post('/auth/session-register', {
        "organization_user": { "email": "usuario-test@adopets.com", "password": "123123" }
      },
        config
      )

      return data.data.access_key;
    }

    async function init() {
      const sessionRequestAccessKey = await sessionRequest();
      setSessionRequestAccessKey(sessionRequestAccessKey);

      const sessionRegisterAccessKey = await sessionRegister();
      setSessionRegisterAccessKey(sessionRegisterAccessKey);
      
      fetchApi();
    }

    init();

  }, [])

  async function fetchApi() {
    var config = {
      headers: { "Authorization": `Bearer ${sessionRegisterAccessKey}` }
    }

    // const nameFilter = filteredName ? { name: filteredName } : {}

    const postData: {} = {
      "search": {
        "_fields": [
          "id",
          "name"
        ]
      }
    };

    console.log(postData);

    const { data } = await api.post('/pet/search', postData,
      config
    )

    console.log(data);
    console.log(data.data);
    console.log(data.data.result);

    setData(data.data.result);
  }

  return (
    <Container>
      <Search placeholder="input search text" onSearch={value => { setFilteredName(value); }} enterButton />
      <Table dataSource={data} columns={columns} onChange={handleChange} rowKey={row => row.id} />;
      </Container>
  );
}

export default SearchPage;