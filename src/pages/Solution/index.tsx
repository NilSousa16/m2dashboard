import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Solutions, Header, InfoHeader, Footer } from './styles';

interface Gateway {
  mac: string;
  ip: string;
  manufacturer: string;
  hostName: string;
  status: string;
  solution: string;
}

interface Device {
  id: string;
  location: string;
  description: string;
  typeSensor: string;
  status: boolean;
  gateway: {
    mac: string;
    solution: string;
  };
  category: string;
}

const Solution: React.FC = () => {
  const params = useParams();

  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    api.get('/m2fot/fot-gateway/').then(response => setGateways(response.data));
    // .catch(err => {
    //   console.error(`Communication failure ${err}`);
    // })
  }, []);

  useEffect(() => {
    api
      .get('/m2fot-device/fot-device/')
      .then(response => setDevices(response.data));
    // .catch(err => {
    //   console.error(`Communication failure ${err}`);
    // })
  }, []);

  // Count gateways in solution
  let totalGatewaysSolution = 0;
  gateways.map(gateway => {
    if (gateway.solution === params.solution) {
      totalGatewaysSolution += 1;
    }
    return null;
  });

  let totalSensorSolution = 0;
  let totalActuadorSolution = 0;
  devices.map(device => {
    const category = device.category || '';

    if (
      device.gateway.solution === params.solution &&
      category.toLowerCase() === 'sensor'
    ) {
      totalSensorSolution += 1;
    }

    if (
      device.gateway.solution === params.solution &&
      category.toLowerCase() === 'actuador'
    ) {
      totalActuadorSolution += 1;
    }

    return null;
  });

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Go Back
        </Link>
      </Header>

      <InfoHeader>
        <header>
          <div>
            <strong>{params.solution}</strong>
            <p>Description</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{totalGatewaysSolution}</strong>
            <span>Gateways</span>
          </li>
          <li>
            <strong>{totalSensorSolution}</strong>
            <span>Sensors</span>
          </li>
          <li>
            <strong>{totalActuadorSolution}</strong>
            <span>Actuators</span>
          </li>
        </ul>
      </InfoHeader>

      <Solutions>
        {gateways.map(gateway =>
          params.solution === gateway.solution ? (
            <Link key={gateway.mac} to={`/dashboard/gateway/${gateway.mac}`}>
              <div>
                <strong>{gateway.hostName}</strong>
                <p>{gateway.ip}</p>
                <p>{gateway.manufacturer}</p>
                <p>{gateway.status}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          ) : null,
        )}
      </Solutions>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Solution;
