import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const Content = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;

  input:not(:first-child) {
    margin-top: 10px;
  }

  button {
    margin-top: 10px;
  }

`;