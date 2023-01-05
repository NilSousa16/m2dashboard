import React, { useEffect, useState } from 'react';

/** useMatch - possui as informações da requisição */
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

// import Table from 'react-bootstrap/Table';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import Map from '../../components/Map';

import {
  Header,
  InfoHeader,
  ContentTitle,
  Table,
  MapArea,
  Footer,
} from './styles';

/**
 * Interfaces
 */
interface Device {
  id: string;
  location: string;
  description: string;
  typeSensor: string;
  status: boolean;
  gateway: {
    mac: string;
  };
  date: CustomDate;
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
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.date.dayOfMonth}/${params.row.date.month}/${params.row.date.year} - ${params.row.date.hourOfDay}:${params.row.date.minute}:${params.row.date.second}`,
  },
  { field: 'situation', headerName: 'Situation', width: 130 },
  { field: 'location', headerName: 'Location', width: 130 },
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

  // https://www.freecodecamp.org/portuguese/news/tutorial-de-async-e-await-em-javascript-como-aguardar-que-uma-funcao-se-encerre-em-js/
  setTimeout(
    () =>
      setSituation(
        deviceStatus[deviceStatus.length - 1].situation[0].toUpperCase() +
          deviceStatus[deviceStatus.length - 1].situation.substring(1),
      ),
    0,
  );

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to={`/dashboard/gateway/${params.gateway}`}>
          <FiChevronLeft size={16} />
          Go Back
        </Link>
      </Header>

      <InfoHeader>
        <header>
          <div>
            <strong>{device?.description}</strong>
            <p>{device?.id}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>Actuator</strong>
            <span>Device</span>
          </li>
          <li>
            <strong>{device?.typeSensor}</strong>
            <span>Type</span>
          </li>
          <li>
            <strong>{situation}</strong>
            <span>Status</span>
          </li>
        </ul>
      </InfoHeader>

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
          <Map />
        </MapArea>
      </div>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Device;
