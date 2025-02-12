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
    width: 200,
    valueGetter: (params: GridValueGetterParams) => {
      if (!params.row.device || !params.row.device.coordinates) return 'N/A';
      
      const latitude = params.row.device.coordinates.latitude;
      const longitude = params.row.device.coordinates.longitude;
      
      return `${latitude}, ${longitude}`;
    },
  },
  { field: 'gateway.id', headerName: 'Gateway', width: 130 },
];

const Device: React.FC = () => {
  const params = useParams();

  const [device, setDevice] = useState<Device>();
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus[]>([]);
  const [situation, setSituation] = useState<string>();

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
          <Map center={{ lat: -12.9704, lng: -38.5124 }} 
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
