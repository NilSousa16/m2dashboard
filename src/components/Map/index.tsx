import * as React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: -12.9704,
  lng: -38.5124,
};

const ufba = {
  lat: -13.0037,
  lng: -38.51,
};

/**
 * https://react-google-maps-api-docs.netlify.app/#googlemap
 * https://developers.google.com/maps/documentation/javascript/react-map#typescript_3
 * https://tomchentw.github.io/react-google-maps/
 */
const Map: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBQgSeEKZpZPpn6arYeBYcJe0pc05leHto">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Child components, such as markers, info windows, etc. */}
        <Marker visible position={ufba} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
