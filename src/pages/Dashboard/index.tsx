import React, { useEffect, useState } from 'react';

/** useMatch - possui as informações da requisição */
import { Link } from 'react-router-dom';

import Map from '../../components/Map';

import api from '../../services/api';

import { Header, ContentTitle, Footer, Cards, Card } from './styles';

import smart_city from "../../assets/logo/smart_city.png";

interface Gateway {
  type: 'gateway';
  mac: string;
  ip: string;
  manufacturer: string;
  hostName: string;
  status: string;
  solution: string;
  coordinates: {
		latitude: string;
    longitude: string;
	}
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
  
  const solutionsWithRepetition = gateways.map(gateway => {
    return gateway.solution;
  });

 // Constrói os marcadores para o Map
 const markers = gateways.map(gateway => ({
  type: "gateway" as const,
  mac: gateway.mac,
  ip: gateway.ip,
  manufacturer: gateway.manufacturer,
  hostName: gateway.hostName,
  status: gateway.status,
  solution: gateway.solution,
  coordinates: { 
    latitude: String(gateway.coordinates.latitude), 
    longitude: String(gateway.coordinates.longitude) },
  }));

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

  console.log();

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
        <section>
          <img src={smart_city}/>
              
          <div>
            <strong>M2 - Smart City</strong>
            <p>Smart Manager</p>
          </div>
        </section>
        
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
      </Header>

      <ContentTitle>Dashboard</ContentTitle>

      <Cards>
        {solutionsWithoutRepetitions.map(solution => (
          <Link 
            key={solution} 
            to={`/dashboard/solution/${solution}`}
            style={{ textDecoration: 'none' }} 
          >
            <Card>
              <p>
                <img src={`icons/${solution.replace(/ /g, "_")}.png`} />
              </p>

              <p>
                <strong>
                  {`${solution.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())}`}
                </strong>
              </p>

              {devicesBySolutions.map(device =>
                device.solution === solution ? (
                  <p>
                    {device.cont} Devices
                  </p>
                ) : null,
              )}

              {gatewaysBySolutions.map(gateway =>
                gateway.solution === solution ? (
                  <p>
                    {gateway.count} Gateways
                  </p>
                ) : null,
              )}
            </Card>
          </Link>
        ))}
      </Cards>

      <Map center={{ lat: -12.993149261359488, lng: -38.49283060302734 }} 
        zoom={13} 
        markers={markers}
      /> 

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Dashboard;
