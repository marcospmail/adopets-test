import React, { useEffect, useState } from 'react';
import { Menu, Input, Dropdown, Button, Icon, Table } from 'antd';

import api from '../../services/api';
import { Container } from './styles';
import { ClickParam } from 'antd/lib/menu';
import { filter } from 'minimatch';

const { Search } = Input;
const ageOptions = ['ALL', 'BABY', 'YOUNG', 'ADULT', 'SENIOR'];
const sexOptions = ['MALE', 'FEMAKE'];

const SearchPage: React.FC = () => {
  const [data, setData] = useState<[]>([]);
  const [sortedInfo, setSortedInfo] = useState();
  const [filteredName, setFilteredName] = useState('');
  const [filteredAge, setFilteredAge] = useState(ageOptions[0]);
  const [filteredSex, setFilteredSex] = useState(sexOptions[0]);
  
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      sortOrder: sortedInfo && sortedInfo.columnKey === 'id' && sortedInfo.order
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order
    },
  ];

  useEffect(() => {
    fetchApi();
  }, [filteredName, filteredAge])

  const ageMenuItems = (
    <Menu onClick={handleAgeFilterClick}>
      {ageOptions.map(age => (
        <Menu.Item key={age}>
          {age}
      </Menu.Item>
      ))}
    </Menu>
  );

  const sexMenuItems = (
    <Menu onClick={handleAgeFilterClick}>
      {ageOptions.map(age => (
        <Menu.Item key={age}>
          {age}
      </Menu.Item>
      ))}
    </Menu>
  );


  function handleAgeFilterClick(e: ClickParam) {
    setFilteredAge(e.key);
  }

  function handleSexFilterClick(e: ClickParam) {
    setFilteredSex(e.key);
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  async function fetchApi() {
    const nameFilter = filteredName ? { name: filteredName } : {}
    const ageFilter = filteredAge !== ages[0] ? { age_key: filteredAge } : {}

    const postData: {} = {
      "search": {
        ...nameFilter,
        ...ageFilter,
        "_fields": [
          "id",
          "name"
        ]
      }
    };

    console.log(postData);

    const { data } = await api.post('/pet/search', postData);

    console.log(data);

    setData(data.data.result);
  }

  return (
    <Container>
      <Search placeholder="Pesquisar por nome" onSearch={value => { setFilteredName(value); }} enterButton />

      <span>Age: </span>
      <Dropdown overlay={ageMenuItems}>
        <Button>
          {filteredAge} <Icon type="down" />
        </Button>
      </Dropdown>

      <span>Sex: </span>
      <Dropdown overlay={sexMenuItems}>
        <Button>
          {filteredAge} <Icon type="down" />
        </Button>
      </Dropdown>

      <Table dataSource={data} columns={columns} onChange={handleTableChange} rowKey={row => row.id} />;
    </Container>
  );
}

export default SearchPage;