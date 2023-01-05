import React, { useEffect, useState } from 'react';

/** useMatch - possui as informações da requisição */
import { Link } from 'react-router-dom';

import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Header, InfoHeader, ContentTitle, Footer, Solutions } from './styles';

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
}

const Dashboard: React.FC = () => {
  const [gateways, setGateway] = useState<Gateway[]>([]);
  const [devices, setDevice] = useState<Device[]>([]);

  useEffect(() => {
    api.get('/m2fot/fot-gateway/').then(response => setGateway(response.data));
  }, []);

  useEffect(() => {
    api
      .get('/m2fot-device/fot-device/')
      .then(response => setDevice(response.data));
  }, []);

  // Search for existing solutions
  // https://igluonline.com/como-remover-elementos-duplicados-de-uma-array-no-javascript-es6/
  const solutionsWithRepetition = gateways.map(gateway => {
    return gateway.solution;
  });
  const solutionsWithoutRepetitionsTemp = new Set(solutionsWithRepetition);
  const solutionsWithoutRepetitions = [...solutionsWithoutRepetitionsTemp];

  // Total gateways by solution
  const gatewaysBySolutions = solutionsWithoutRepetitions.map(solution => {
    let count = 0;
    gateways.map(gateway => {
      if (gateway.solution === solution) count += 1;
      return null;
    });

    const result = { solution, count };

    return result;
  });

  // Total gateways
  const totalGateways = gateways.length;

  // Total devices
  const totalDevices = devices.length;

  // Total devices by solution
  const devicesBySolutions = solutionsWithoutRepetitions.map(solution => {
    let cont = 0;
    devices.map(device => {
      if (device.gateway.solution === solution) cont += 1;
      return null;
    });

    const result = { solution, cont };

    return result;
  });

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
      </Header>

      <InfoHeader>
        <header>
          <div>
            <strong>M2 - Smart Cities</strong>
            <p>Smart Manager</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{solutionsWithoutRepetitions.length}</strong>
            <span>Solutions</span>
          </li>
          <li>
            <strong>{totalGateways}</strong>
            <span>Gateways</span>
          </li>
          <li>
            <strong>{totalDevices}</strong>
            <span>Devices</span>
          </li>
        </ul>
      </InfoHeader>

      <ContentTitle>Solutions</ContentTitle>

      <Solutions>
        {solutionsWithoutRepetitions.map(solution => (
          <Link key={solution} to={`/dashboard/solution/${solution}`}>
            <div>
              <strong>{solution}</strong>
              {devicesBySolutions.map(device =>
                device.solution === solution ? (
                  <p>{device.cont} Devices</p>
                ) : null,
              )}

              {gatewaysBySolutions.map(gateway =>
                gateway.solution === solution ? (
                  <p>{gateway.count} Gateways</p>
                ) : null,
              )}
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Solutions>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Dashboard;
