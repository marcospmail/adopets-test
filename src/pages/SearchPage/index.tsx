import React, { useEffect, useState, } from 'react';
import { Menu, Input, Dropdown, Button, Icon, Table, Tag, Divider } from 'antd';

import api from '../../services/api';
import { ClickParam } from 'antd/lib/menu';

import { Container, NoData } from './styles';

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
  field: Field
  order: string
}

const ageOptions = ['ALL', 'BABY', 'YOUNG', 'ADULT', 'SENIOR'];
const sexOptions = ['ALL', 'MALE', 'FEMALE'];
const orderOptions = ['ASCEND', 'DESCEND'];

const fields: Field[] = [{ field: 'id', name: 'Id' }, { field: 'name', name: 'Name' }, { field: 'price', name: 'Price' }, { field: 'sex_key', name: 'Sex' }, { field: 'age_key', name: 'Age'}];

const SearchPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState<Sort>({ field: fields[0], order: orderOptions[0] });
  const [filteredName, setFilteredName] = useState('');
  const [filteredAge, setFilteredAge] = useState(ageOptions[0]);
  const [filteredSex, setFilteredSex] = useState(sexOptions[0]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<Field>(fields[0]);

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
    <Menu>
      {fields.map(f => (
        <Menu.Item onClick={() => handleSortFilterClick(f)} key={f.field}>
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

  const columnsMenuItems = (
    <Menu>
      {fields.map(f => (
        <Menu.Item key={f.field} onClick={() => setSelectedColumn(f)}>
          {f.name}
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

  function handleSortFilterClick(field: Field) {
    const order = sortedInfo!.order;
    setSortedInfo({ order, field });
  }

  function handleOrderFilterClick(e: ClickParam) {
    const field = sortedInfo!.field;
    setSortedInfo({ field, order: e.key });
  }

  function handleAddColumn(field: Field) {
    const newColumn = {
      title: field.name,
      dataIndex: field.field,
      key: field.field,
    };

    setColumns([...columns, newColumn]);
  }

  function handleRemoveColumn(key: string) {
    const newColumns = columns.filter(column => column.key !== key);
    setColumns(newColumns);
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
        sort: [(sortedInfo.order === 'DESCEND' ? '-' : '') + sortedInfo.field.field],
      }
    };

    const { data } = await api.post('/pet/search', postData);

    setData(data.data.result);
  }

  return (
    <Container>


      <div>
        <span className="filter-label">Columns: </span>
        <Dropdown className="dropdown" overlay={columnsMenuItems}>
          <Button>
            {selectedColumn.name} <Icon type="down" />
          </Button>
        </Dropdown>
        <Button onClick={() => handleAddColumn(selectedColumn)}> Add</Button>
        <div style={{ display: 'inline-block' }}>
          {columns.map(c => (<Tag key={c.key} closable onClose={() => handleRemoveColumn(c.key)}>{c.title}</Tag>))}
        </div>

      </div>

      <Divider orientation="left">Filters</Divider>

      <Search placeholder="Search for name" onSearch={value => { setFilteredName(value); }} enterButton />

      <div>
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
            {sortedInfo!.field.name} <Icon type="down" />
          </Button>
        </Dropdown>

        <Dropdown className="dropdown" overlay={orderMenuItems}>
          <Button>
            {sortedInfo!.order} <Icon type="down" />
          </Button>
        </Dropdown>
      </div>

      <br />


      {columns.length ?
        (<Table dataSource={data} columns={columns} rowKey="id" />) :
        (<NoData><span>Select at least one column</span></NoData>)}

    </Container>
  );
}

export default SearchPage;