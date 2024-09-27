import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  margin-top: 20px;

  section {
    display: flex;
    align-items: center;
    width: 100%;

    img {
      width: 64px;
      height: 64px;
    }

    div {
      margin-left: 24px;

      strong {
        font-size: 26px;
        color: #3d3d4d;
      }

      p {
        font-size: 18px;
        color: #737380;
        margin-top: 4px;
      }
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin-right: 24px;

    li {
      & + li {
        margin-left: 80px;
      }

      strong {
        display: block;
        font-size: 25px;
        color: #3d3d4d;
      }

      span {
        display: block;
        margin-top: 4px;
        color: #6c6c80;
      }
    }
  }
`;

export const ContentTitle = styled.h5`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;

  font-size: 24px;
  color: #737380;
`;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  max-width: 1000px;
  min-height: 400px;

  justify-content: center;
`;

export const Card = styled.div`
  height: 200px;
  width: 200px;
  background-color: #fff;
  flex: 1 0 200px;
  
  border-radius: 5px;

  transition: background-color 0.4s;

  img {
    width: 64px;
    height: 64px;
    margin-top: 20px;
  }
  
  p {
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 18px;
    color: #a8a8b3;
    margin-top: 4px;
    padding: 0px;
  }

  strong {
    font-size: 20px;
    color: #3d3d4d;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  &:hover {
    background-color: #69a0ac;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 15px;

  border-style: solid;
  border-bottom-width: 0;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;

  p {
    font-size: 12px;
    color: #737380;
  }
`;
