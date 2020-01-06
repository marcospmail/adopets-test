import React, { useEffect, useState } from 'react';
import { Menu, Input, Dropdown, Button, Icon, Table, Checkbox } from 'antd';

import api from '../../services/api';
import { ClickParam } from 'antd/lib/menu';

import { Container } from './styles';

const { Search } = Input;


interface Field {
  field: string
  name: string
}

interface Column {
  title: string
  dataIndex: string
  key: string
}

interface Sort {
  field: string
  order: string
}

const ageOptions = ['ALL', 'BABY', 'YOUNG', 'ADULT', 'SENIOR'];
const sexOptions = ['ALL', 'MALE', 'FEMALE'];
const orderOptions = ['ASCEND', 'DESCEND'];

const fields: Field[] = [{ field: 'id', name: 'Id' }, { field: 'name', name: 'Name' }, { field: 'price', name: 'Price' }, { field: 'sex_key', name: 'Sex' }];

const SearchPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState<Sort>({ field: fields[0].field, order: orderOptions[0] });
  const [filteredName, setFilteredName] = useState('');
  const [filteredAge, setFilteredAge] = useState(ageOptions[0]);
  const [filteredSex, setFilteredSex] = useState(sexOptions[0]);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    handleChangeColumn(true, { field: 'id', name: 'Field' });
  }, []) //eslint-disable-line

  useEffect(() => {
    if (columns.length) {
      fetchApi();
    }
  }, [filteredName, filteredAge, filteredSex, columns, sortedInfo.field, sortedInfo.order]) //eslint-disable-line

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
    <Menu onClick={handleSexFilterClick}>
      {sexOptions.map(age => (
        <Menu.Item key={age}>
          {age}
        </Menu.Item>
      ))}
    </Menu>
  );

  const sortMenuItems = (
    <Menu onClick={handleSortFilterClick}>
      {fields.map(f => (
        <Menu.Item key={f.field}>
          {f.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const orderMenuItems = (
    <Menu onClick={handleOrderFilterClick}>
      {orderOptions.map(o => (
        <Menu.Item key={o}>
          {o}
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

  function handleSortFilterClick(e: ClickParam) {
    const order = sortedInfo!.order;
    setSortedInfo({ order, field: e.key });
  }

  function handleOrderFilterClick(e: ClickParam) {
    const field = sortedInfo!.field;
    setSortedInfo({ field, order: e.key });
  }

  async function fetchApi() {
    const nameFilter = filteredName ? { name: filteredName } : {}
    const ageFilter = filteredAge !== ageOptions[0] ? { age_key: filteredAge } : {}
    const sexFilter = filteredSex !== sexOptions[0] ? { sex_key: filteredSex } : {}

    const postData: {} = {
      search: {
        ...nameFilter,
        ...ageFilter,
        ...sexFilter,
        _fields: ['id', ...columns.map(c => c.key)]
      },
      options: {
        sort: [(sortedInfo.order === 'DESCEND' ? '-' : '') + sortedInfo.field],
      }
    };

    console.log(postData);

    const { data } = await api.post('/pet/search', postData);

    console.log(data);

    setData(data.data.result);
  }

  function handleChangeColumn(checked: boolean, field: Field) {
    if (checked) {
      const newColumn = {
        title: field.name,
        dataIndex: field.field,
        key: field.field,
      };

      setColumns([...columns, newColumn]);
    }
    else {
      const newColumns = columns.filter(column => column.key !== field.field);
      setColumns(newColumns);
    }
  }

  return (
    <Container>
      <Search placeholder="Search for name" onSearch={value => { setFilteredName(value); }} enterButton />

      <span className="filter-label">Age: </span>
      <Dropdown className="dropdown" overlay={ageMenuItems}>
        <Button>
          {filteredAge} <Icon type="down" />
        </Button>
      </Dropdown>

      <br />

      <span className="filter-label">Sex: </span>
      <Dropdown className="dropdown" overlay={sexMenuItems}>
        <Button>
          {filteredSex} <Icon type="down" />
        </Button>
      </Dropdown>

      <br />

      <span className="filter-label">Sort: </span>
      <Dropdown className="dropdown" overlay={sortMenuItems}>
        <Button>
          {sortedInfo!.field} <Icon type="down" />
        </Button>
      </Dropdown>

      <Dropdown  className="dropdown" overlay={orderMenuItems}>
        <Button>
          {sortedInfo!.order} <Icon type="down" />
        </Button>
      </Dropdown>

      <br />

      <div className="table-columns-checkbox">
        {fields.map(f => (
          <Checkbox key={f.field} checked={columns.filter(c => c.key === f.field).length > 0} onChange={e => handleChangeColumn(e.target.checked, f)}>{f.name}</Checkbox>
        ))}
      </div>

      {columns.length ?
        (<Table dataSource={data} columns={columns} rowKey="id" />) :
        (<div><span>Select at least one column</span></div>)}

    </Container>
  );
}

export default SearchPage;