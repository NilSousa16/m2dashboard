import React, { useEffect, useState } from 'react';

/** useMatch - possui as informações da requisição */
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

// import Table from 'react-bootstrap/Table';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import api from '../../services/api';

import Map from '../../components/Map';

import smart_city from "../../assets/logo/smart_city.png";

import {
  HeaderGoBack,
  Header,
  ContentTitle,
  Table,
  MapArea,
  Footer,
} from './styles';

/**
 * Interfaces
 */
interface Device {
  type: 'device';
  id: string;
  coordinates: { 
    latitude: string; 
    longitude: string 
  };  
  description: string;
  typeDevice: string;
  category: string
  status: boolean;
  gateway: {
    mac: string;
    solution: string;
  };
  // date: CustomDate;
}

interface DeviceStatus {
  device: {
    id: string;
    coordinates: {
			latitude: string;
			longitude: string;
    }
  };
  gateway: {
    mac: string;
  };
  date: CustomDate;
  situation: string;
}

interface CustomDate {
  dayOfMonth: number;
  month: number;
  year: number;
  hourOfDay: number;
  minute: number;
  second: number;
}

const Device: React.FC = () => {
  const params = useParams();

  const [device, setDevice] = useState<Device>();
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus[]>([]);
  const [situation, setSituation] = useState<string>();

  const [locationNames, setLocationNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api
      .get(`m2fot-device/fot-device/find?id=${params.device}`)
      .then(response => {
        setDevice(response.data);
      });

    api
      .get(`m2fot-device-status/fot-device-status/find?id=${params.device}`)
      .then(response => {
        setDeviceStatus(response.data);
      });
  }, [params.device]);
  
  setTimeout(
    () =>
      setSituation(
        deviceStatus[deviceStatus.length - 1].situation[0].toUpperCase() +
          deviceStatus[deviceStatus.length - 1].situation.substring(1),
      ),
    0,
  );

  // Busca endereços quando os dispositivos mudam
  useEffect(() => {
    const fetchLocations = async () => {
      if (!deviceStatus.length) return;

      const newLocationNames = { ...locationNames };

      for (const status of deviceStatus) {
        const latitude = status.device.coordinates.latitude;
        const longitude = status.device.coordinates.longitude;
        const key = `${latitude},${longitude}`;

        if (!newLocationNames[key]) {
          newLocationNames[key] = await getLocationName(latitude, longitude);
        }
      }

      setLocationNames(newLocationNames);
    };

    fetchLocations();
  }, [deviceStatus]);

  const getLocationName = async (latitude: string, longitude: string) => {
    const key = `${latitude},${longitude}`;
  
    if (locationNames[key]) return locationNames[key];
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCyyFOoWMUE5bOXZlGs_wq8mQvFk5PxQlM`
      );
  
      const data = await response.json();
  
      if (data.status === 'OK' && data.results.length > 0) {
        // Primeiro, tenta pegar o endereço principal
        let address = data.results[0].formatted_address;
  
        // Se não houver um endereço válido, busca a localidade mais próxima
        if (!address) {
          for (const result of data.results) {
            if (result.types.includes("street_address") || result.types.includes("route")) {
              address = result.formatted_address;
              break;
            }
          }
        }
  
        // Se ainda não encontrou, busca a cidade ou bairro mais próximo
        if (!address) {
          for (const result of data.results) {
            if (result.types.includes("locality") || result.types.includes("sublocality")) {
              address = result.formatted_address;
              break;
            }
          }
        }
  
        if (!address) address = 'Localização aproximada não encontrada';
  
        setLocationNames(prev => ({ ...prev, [key]: address }));
        return address;
      } else {
        console.warn('Nenhum endereço encontrado para:', latitude, longitude);
      }
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
    }
  
    return 'Localização aproximada não disponível';
  };

   /**
   * Table using https://mui.com/pt/x/react-data-grid/layout/
   */
   const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => {
        const day = String(params.row.date.dayOfMonth).padStart(2, '0');
        const month = String(params.row.date.month).padStart(2, '0');
        const year = String(params.row.date.year).slice(-2);
        const hour = String(params.row.date.hourOfDay).padStart(2, '0');
        const minute = String(params.row.date.minute).padStart(2, '0');
        const second = String(params.row.date.second).padStart(2, '0');
  
        return `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
      },
    },
    { field: 'situation', headerName: 'Situation', width: 130 },
    {
      field: 'location',
      headerName: 'Location',
      width: 250,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.row.device || !params.row.device.coordinates) return 'N/A';

        const latitude = params.row.device.coordinates.latitude;
        const longitude = params.row.device.coordinates.longitude;
        return locationNames[`${latitude},${longitude}`] || 'Carregando...';
      },
    },
    {
      field: 'gateway',
      headerName: 'Gateway',
      width: 180,
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.device.gateway?.hostName || 'Unknown'; // Mostra o nome do gateway
      },
    },
  ];
  

  const markers = device ? [{
    type: "device" as const,
    id: device.id,
    coordinates: { 
      latitude: String(device.coordinates.latitude), 
      longitude: String(device.coordinates.longitude),
    },
    description: device.description,
    typeDevice: device.typeDevice,
    category: device.category,
    status: device.status,
    gateway: {
      mac: device.gateway.mac,
      solution: device.gateway.solution,
    },
  }] : [];

  return (
    <>
      <HeaderGoBack>
        <Link to={`/dashboard/gateway/${params.gateway}`}>
          <FiChevronLeft size={16} />
          Go Back
        </Link>
      </HeaderGoBack>

      <Header>
        <section>
          <img src={smart_city} />
          <div>
            <strong>{device?.description}</strong>
            <p>{device?.id}</p>
          </div>
        </section>
        <ul>
          <li>
            <strong>
              {
                `${
                  device?.category.replace(/(^\w{1})|(\s+\w{1})/g, letra => 
                    letra.toUpperCase())
                }`
              }
            </strong>
            <span>Category</span>
          </li>
          <li>
            <strong>
              {
                `${
                  device?.typeDevice.replace(/(^\w{1})|(\s+\w{1})/g, letra => 
                    letra.toUpperCase())
                }`
              }
            </strong>
            <span>Type</span>
          </li>
          <li>
            <strong>
              {
                situation
              }
            </strong>
            <span>Status</span>
          </li>
        </ul>
      </Header>

      <ContentTitle>Log Device</ContentTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          minHeight: 400,
        }}
      >
        <Table>
          <DataGrid
            getRowId={row =>
              row.date.dayOfMonth +
              row.date.month +
              row.date.year +
              row.date.hourOfDay +
              row.date.minute +
              row.date.second
            }
            rows={deviceStatus}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Table>

        <MapArea>
          <Map center={
            { 
              lat: 
                device?.coordinates?.latitude ? parseFloat(device.coordinates.latitude) || -12.9704 : -12.9704, 
              lng: 
                device?.coordinates?.longitude ? parseFloat(device.coordinates.longitude) || -38.5124 : -38.5124 }
            } 
            zoom={13} 
            markers={markers}
          /> 
        </MapArea>
      </div>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Device;
