import React, { useEffect, useState } from 'react';

/** useMatch - possui as informações da requisição */
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

import { MdSensors, MdOutlineCatchingPokemon } from 'react-icons/md';

// import Table from 'react-bootstrap/Table';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { CardActionArea, Card, CardContent, Typography } from '@mui/material';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import Map from '../../components/Map';

import {
  Header,
  Table,
  MapArea,
  InfoHeader,
  Graphic,
  GridContent,
  ContentTitle,
  Footer,
} from './styles';

interface Gateway {
  mac: string;
  ip: string;
  manufacturer: string;
  hostName: string;
  status: string;
  date: PersonDate;
}

interface GatewayStatus {
  date: PersonDate;
  baterryLevel: string;
  usedMemory: string;
  usedProcessor: string;
}

interface Device {
  id: string;
  location: string;
  description: string;
  typeSensor: string;
  status: boolean;
  gateway: {
    mac: string;
  };
  category: string;
}

interface PersonDate {
  dayOfMonth: number;
  month: number;
  year: number;
  hourOfDay: number;
  minute: number;
  second: number;
}

/**
 * Graph using
 * yarn add react-chartjs-2 chart.js
 * https://react-chartjs-2.js.org/examples/line-chart/
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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
  { field: 'usedMemory', headerName: 'Used Memory', width: 130 },
  { field: 'usedProcessor', headerName: 'Used Processor', width: 130 },
  { field: 'baterryLevel', headerName: 'Baterry Level', width: 130 },
];

const Gateway: React.FC = () => {
  const params = useParams();

  const [gatewayDetails, setGatewayDetails] = useState<GatewayStatus[]>([]);
  const [gatewayInfo, setGatewayInfo] = useState<Gateway>();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    api
      .get(`m2fot-status/fot-gateway-status/find?mac=${params.gateway}`)
      .then(response => {
        setGatewayDetails(response.data);
      });
  }, [params.gateway]);

  useEffect(() => {
    api.get(`m2fot/fot-gateway/find?mac=${params.gateway}`).then(response => {
      setGatewayInfo(response.data);
    });
  }, [params.gateway]);

  useEffect(() => {
    api
      .get(
        `m2fot-device/fot-device/find/device_gateway?gatewayMac=${params.gateway}`,
      )
      .then(response => {
        setDevices(response.data);
      });
  }, [params.gateway]);

  /**
   * Graphic assembly
   */
  const labels = gatewayDetails.map(dataGateway => {
    return `${dataGateway.date.dayOfMonth}/${dataGateway.date.month}/${dataGateway.date.year}-${dataGateway.date.hourOfDay}:${dataGateway.date.minute}:${dataGateway.date.second}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Baterry Level',
        data: gatewayDetails.map(
          dataBaterryGateway => dataBaterryGateway.baterryLevel,
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Used Memory',
        data: gatewayDetails.map(
          dataMemoryGateway => dataMemoryGateway.usedMemory,
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

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
            <strong>{gatewayInfo?.hostName}</strong>
            <p>{gatewayInfo?.ip}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{devices.length}</strong>
            <span>Devices</span>
          </li>
          <li>
            <strong>-</strong>
            <span>Services</span>
          </li>
          <li>
            <strong>-</strong>
            <span>Issues</span>
          </li>
        </ul>
      </InfoHeader>

      <ContentTitle>Performance</ContentTitle>

      <Graphic>
        <Line data={data} />
      </Graphic>

      <ContentTitle>Status Records</ContentTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
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
            rows={gatewayDetails}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Table>

        <MapArea>
          <Map />
        </MapArea>
      </div>

      <ContentTitle>Connected Devices</ContentTitle>

      <GridContent>
        {devices.map(device => (
          <Link
            key={device.id}
            to={`/dashboard/gateway/${gatewayInfo?.mac}/device/${device.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Card
              style={{
                width: 128,
                height: 110,
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <CardActionArea>
                <CardContent
                  style={{
                    display: 'block',
                    justifyContent: 'center',
                    width: 128,
                    height: 110,
                  }}
                >
                  {device.category === 'sensor' ? (
                    <MdSensors style={{ fontSize: '20', marginBottom: '5' }} />
                  ) : (
                    <MdOutlineCatchingPokemon
                      style={{ fontSize: '20', marginBottom: '5' }}
                    />
                  )}

                  <Typography gutterBottom variant="body2" component="div">
                    {device.id}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="span">
                    {device.typeSensor}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </GridContent>

      <Footer>
        <p>Developed by Wiser Research Group</p>
      </Footer>
    </>
  );
};

export default Gateway;
