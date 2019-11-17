import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  height: 100%;
  background: linear-gradient(-90deg, #7159c1, #ab59c1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  text-align: center;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background-color: rgba(0, 0, 0, 0.2);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin-bottom: 10px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    button {
      margin-top: 5px;
      height: 44px;
      background-color: rgba(255, 255, 255, 0.7);
      font-weight: bold;
      color: #7159c1;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${darken(0.1, 'rgba(255, 255, 255, 0.7)')};
      }
    }

    a {
      margin-top: 15px;
      font-size: 16px;
      color: #fff;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
`;
