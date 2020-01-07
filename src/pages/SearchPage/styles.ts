import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px;
    height: 100%;

    span.filter-label {
        display: inline-block;
        width: 100px;
    }

    button.dropdown {
        margin-top: 5px;
    }

    div.table-columns-checkbox {
        margin-top: 5px;
    }

    table {
        margin-top: 5px;
    }
`;

export const NoData = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
`;

