import styled from 'styled-components';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #a8a8b3;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }
  }

  svg {
    margin-right: 4px;
  }
`;

export const InfoHeader = styled.section`
  display: flex;

  margin-top: 60px;
  margin-bottom: 40px;

  header {
    display: flex;
    align-items: center;
    width: 100%;

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

export const Graphic = styled.div`
  display: flex;
  margin: auto;
`;

export const Table = styled.div`
  display: block;
  height: 400px;
  background-color: #fff;
  width: 60%;
`;

export const MapArea = styled.div`
  display: block;
  height: 400px;
  background-color: #dcdcdc;
  width: 37%;
`;

export const GridContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;

  padding-left: 15px;
  padding-right: 15px;
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
