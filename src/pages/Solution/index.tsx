import React, { useState, useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';

import Map from '../../components/Map';

import api from '../../services/api';

import { HeaderGoBack, Header, ContentTitle, Cards, Card, Footer } from './styles';

import { FiChevronLeft } from 'react-icons/fi';

import smart_city from "../../assets/logo/smart_city.png";
import gateway_logo from "../../assets/logo/gateway.png";

interface Gateway {
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
  category: string;
}

const Solution: React.FC = () => {
  const params = useParams();
  const nameSolution = `${params.solution}`;

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

  const markers = gateways
  .filter(gateway => gateway.solution === params.solution)
  .map(gateway => ({
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
      <HeaderGoBack>
        <Link to="/">
          <FiChevronLeft size={16} />
          Go Back
        </Link>
      </HeaderGoBack>
      
      <Header>
        <section>
          <img src={smart_city} />
          <div>
            <strong>
              {`${nameSolution.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())}`}
            </strong>
            <p>Solution</p>
          </div>
        </section>

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
      </Header>

      <ContentTitle>Gateways</ContentTitle>

      <Map 
        center={{ 
                    lat: -12.989194014215045, 
                    lng: -38.480299322509765 
                }} 
        zoom={13} 
        markers={markers}
      /> 

      <Cards>
        {gateways.map(gateway =>
          params.solution === gateway.solution ? (
            <Link 
              key={gateway.mac} 
              to={`/dashboard/gateway/${gateway.mac}`}
              style={{ textDecoration: 'none', marginTop: '25px'} 
            }>
              <Card>
                <p>
                  <img src={gateway_logo} />
                </p>
                
                <p>
                  <strong>{gateway.hostName}</strong>
                </p>

                <p>{gateway.ip}</p>
                <p>{gateway.manufacturer}</p>
                <p>{gateway.status}</p>
              </Card>
            </Link>
          ) : null,
        )}
      </Cards>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Solution;
