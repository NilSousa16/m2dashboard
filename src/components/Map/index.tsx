import * as React from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from '@vis.gl/react-google-maps';

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
  };
}

interface Device {
  type: 'device';
  id: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  description: string;
  typeDevice: string;
  category: string;
  status: boolean;
  gateway: {
    mac: string;
    solution: string;
  };
}

type Poi = Gateway | Device;

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Poi[];
}

const App: React.FC<MapProps> = ({ center, zoom, markers }) => {
  return (
    <APIProvider apiKey={'AIzaSyCyyFOoWMUE5bOXZlGs_wq8mQvFk5PxQlM'}>
      <Map
        defaultZoom={zoom}
        defaultCenter={center}
        mapId="m2_map_id"
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={containerStyle}
      >
        
        <PoiMarkers pois={markers} />
        
      </Map>
    </APIProvider>
  );
};

const PoiMarkers: React.FC<{ pois: Poi[] }> = ({ pois }) => {
  const handleMarkerClick = (poi: Poi) => {
    if (poi.type === 'gateway') {
      alert(`Gateway Information
      \nMac: ${poi.mac}
      \nIP: ${poi.ip}
      \nManufacturer: ${poi.manufacturer}
      \nHostname: ${poi.hostName}
      \nStatus: ${poi.status}
      \nSolution: ${poi.solution}`);
    } else {
      alert(`Device Information
      \nID: ${poi.id}
      \nDescription: ${poi.description}
      \nType: ${poi.typeDevice}
      \nCategory: ${poi.category}
      \nStatus: ${poi.status ? 'Active' : 'Inactive'}
      \nAssociated Gateway Mac: ${poi.gateway.mac}`);
    }
  };

  return (
    <>
      {pois.map((poi) => {
        const position = {
          lat: parseFloat(poi.coordinates.latitude),
          lng: parseFloat(poi.coordinates.longitude),
        };

        return (
          <AdvancedMarker
            key={poi.type + ('mac' in poi ? poi.mac : poi.id)}
            position={position}
            onClick={() => handleMarkerClick(poi)}
          >
            <Pin background={poi.type === 'gateway' ? '#FBBC04' : '#34A853'} glyphColor="#000" borderColor="#000" />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default App;
